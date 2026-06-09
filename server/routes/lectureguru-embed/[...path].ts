import { createError, defineEventHandler, getQuery, setHeader, setResponseStatus } from 'h3';

const upstreamOrigin = 'https://app.lecture-guru.com';
const localPrefix = '/lectureguru-embed';
const requestTimeoutMs = 8000;

const textualContentTypes = [
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'application/json',
  'application/x-ndjson',
  'text/x-component',
];

const allowedPathPatterns = [
  /^slides\/[A-Za-z0-9_-]+$/,
  /^_next\/image$/,
  /^_next\/static\/[A-Za-z0-9._~!$&'()*+,;=:@/%-]+$/,
  /^api\/[A-Za-z0-9._~!$&'()*+,;=:@/%-]+$/,
  /^(?:manifest\.webmanifest|favicon[^/]*|apple-touch-icon[^/]*|android-chrome[^/]*)$/,
];

const headerValue = (value: string | string[] | undefined, fallback: string) => {
  if (Array.isArray(value)) return value.join(', ');
  return value ?? fallback;
};

const shouldRewriteBody = (contentType: string) =>
  textualContentTypes.some((type) => contentType.includes(type));

const badRequest = (message: string) =>
  createError({ statusCode: 400, statusMessage: message });

const normalizeProxyPath = (path: string) => {
  if (!path) {
    throw badRequest('Missing proxy path');
  }

  if (
    path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('\\') ||
    /%2f/i.test(path) ||
    /%5c/i.test(path)
  ) {
    throw badRequest('Invalid proxy path');
  }

  let decodedPath: string;

  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    throw badRequest('Malformed proxy path');
  }

  const pathSegments = decodedPath.split('/');

  if (
    decodedPath.startsWith('/') ||
    decodedPath.startsWith('//') ||
    decodedPath.includes('\\') ||
    pathSegments.some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw badRequest('Invalid proxy path');
  }

  if (!allowedPathPatterns.some((pattern) => pattern.test(decodedPath))) {
    throw badRequest('Proxy path is not allowed');
  }

  return decodedPath;
};

const cacheControlForPath = (path: string) => {
  if (
    path.startsWith('_next/static/') ||
    path === '_next/image' ||
    /^(?:manifest\.webmanifest|favicon|apple-touch-icon|android-chrome)/.test(path)
  ) {
    return 'public, max-age=31536000, immutable';
  }

  if (path.startsWith('api/')) {
    return 'no-store';
  }

  return 'public, max-age=60, s-maxage=300';
};

const rewriteScopedReferences = (body: string) =>
  body
    .replaceAll(`${upstreamOrigin}/`, `${localPrefix}/`)
    .replace(/(["'(=:\s])\/(_next|api)\//g, `$1${localPrefix}/$2/`)
    .replace(
      /(["'(=:\s])\/(manifest\.webmanifest|favicon[^"'()<>\s,]*|apple-touch-icon[^"'()<>\s,]*|android-chrome[^"'()<>\s,]*)/g,
      `$1${localPrefix}/$2`
    )
    .replace(/\\u002f(_next|api)\\u002f/g, `\\u002flectureguru-embed\\u002f$1\\u002f`);

export default defineEventHandler(async (event) => {
  const rawPath = event.context.params?.path ?? '';
  const path = normalizeProxyPath(Array.isArray(rawPath) ? rawPath.join('/') : rawPath);
  const query = getQuery(event);
  const method = event.node.req.method ?? 'GET';
  const normalizedMethod = method.toUpperCase();

  if (!['GET', 'HEAD'].includes(normalizedMethod)) {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
  }

  const upstreamUrl = new URL(`${upstreamOrigin}/${path}`);
  const requestHeaders: Record<string, string> = {
    accept: headerValue(event.node.req.headers.accept, '*/*'),
    'accept-language': headerValue(event.node.req.headers['accept-language'], 'en'),
    'user-agent': 'od-portfolio-embed',
  };

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => upstreamUrl.searchParams.append(key, String(entry)));
    } else if (value != null) {
      upstreamUrl.searchParams.set(key, String(value));
    }
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), requestTimeoutMs);
  const fetchOptions: RequestInit & { duplex?: 'half' } = {
    method: normalizedMethod,
    headers: requestHeaders,
    signal: abortController.signal,
  };

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(upstreamUrl, fetchOptions);
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';

    throw createError({
      statusCode: isTimeout ? 504 : 502,
      statusMessage: isTimeout ? 'Upstream request timed out' : 'Upstream request failed',
    });
  } finally {
    clearTimeout(timeout);
  }

  setResponseStatus(event, upstreamResponse.status);

  const contentType = upstreamResponse.headers.get('content-type') ?? 'application/octet-stream';

  setHeader(event, 'content-type', contentType);
  setHeader(event, 'cache-control', cacheControlForPath(path));
  setHeader(event, 'vary', 'accept, accept-language');
  setHeader(event, 'x-content-type-options', 'nosniff');

  if (shouldRewriteBody(contentType)) {
    return rewriteScopedReferences(await upstreamResponse.text());
  }

  return new Uint8Array(await upstreamResponse.arrayBuffer());
});
