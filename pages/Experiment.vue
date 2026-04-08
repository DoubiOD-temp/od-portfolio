<template>
  <div class="experiment-page">
    <div class="art-box" ref="propBox"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const propBox = ref(null)

let animFrameId = null

onMounted(() => {
  const FONT_SIZE = 14
  const LINE_HEIGHT = 16
  const PROP_FAMILY = 'Georgia, Palatino, "Times New Roman", serif'
  const TARGET_CHAR_W = 8.8
  const COLS = Math.ceil(window.innerWidth / TARGET_CHAR_W)
  const ROWS = Math.ceil(window.innerHeight / LINE_HEIGHT)
  const TARGET_ROW_W = COLS * TARGET_CHAR_W
  const FIELD_OVERSAMPLE = 2
  const FIELD_COLS = COLS * FIELD_OVERSAMPLE
  const FIELD_ROWS = ROWS * FIELD_OVERSAMPLE
  const CANVAS_W = Math.round(COLS * 4.4)
  const CANVAS_H = Math.round(ROWS * (LINE_HEIGHT / TARGET_CHAR_W) * 4.4)
  const FIELD_SCALE_X = FIELD_COLS / CANVAS_W
  const FIELD_SCALE_Y = FIELD_ROWS / CANVAS_H
  const PARTICLE_N = 300
  const SPRITE_R = 14
  const ATTRACTOR_R = 20
  const LARGE_ATTRACTOR_R = 40
  const ATTRACTOR_FORCE = 0.15
  const FIELD_DECAY = 0.85
  const CHARSET = ' .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const WEIGHTS = [300, 500, 800]
  const STYLES = ['normal', 'italic']

  // --- brightness measurement ---
  const brightnessCanvas = document.createElement('canvas')
  brightnessCanvas.width = 28
  brightnessCanvas.height = 28
  const bCtx = brightnessCanvas.getContext('2d', { willReadFrequently: true })

  function estimateBrightness(ch, font) {
    const size = 28
    bCtx.clearRect(0, 0, size, size)
    bCtx.font = font
    bCtx.fillStyle = '#fff'
    bCtx.textBaseline = 'middle'
    bCtx.fillText(ch, 1, size / 2)
    const data = bCtx.getImageData(0, 0, size, size).data
    let sum = 0
    for (let i = 3; i < data.length; i += 4) sum += data[i]
    return sum / (255 * size * size)
  }

  // --- width measurement (replaces pretext's prepareWithSegments) ---
  const measureCanvas = document.createElement('canvas')
  const mCtx = measureCanvas.getContext('2d')

  function measureWidth(ch, font) {
    mCtx.font = font
    return mCtx.measureText(ch).width
  }

  // --- build palette ---
  const palette = []
  for (const style of STYLES) {
    for (const weight of WEIGHTS) {
      const font = `${style === 'italic' ? 'italic ' : ''}${weight} ${FONT_SIZE}px ${PROP_FAMILY}`
      for (const ch of CHARSET) {
        if (ch === ' ') continue
        const width = measureWidth(ch, font)
        if (width <= 0) continue
        const brightness = estimateBrightness(ch, font)
        palette.push({ char: ch, weight, style, font, width, brightness })
      }
    }
  }

  const maxBrightness = Math.max(...palette.map(e => e.brightness))
  if (maxBrightness > 0) {
    for (const entry of palette) entry.brightness /= maxBrightness
  }
  palette.sort((a, b) => a.brightness - b.brightness)
  const targetCellW = TARGET_ROW_W / COLS

  function findBest(targetBrightness) {
    let lo = 0
    let hi = palette.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (palette[mid].brightness < targetBrightness) lo = mid + 1
      else hi = mid
    }
    let bestScore = Infinity
    let best = palette[lo]
    const start = Math.max(0, lo - 15)
    const end = Math.min(palette.length, lo + 15)
    for (let i = start; i < end; i++) {
      const entry = palette[i]
      const brightnessError = Math.abs(entry.brightness - targetBrightness) * 2.5
      const widthError = Math.abs(entry.width - targetCellW) / targetCellW
      const score = brightnessError + widthError
      if (score < bestScore) {
        bestScore = score
        best = entry
      }
    }
    return best
  }

  function esc(ch) {
    if (ch === '<') return '&lt;'
    if (ch === '>') return '&gt;'
    if (ch === '&') return '&amp;'
    if (ch === '"') return '&quot;'
    return ch
  }

  function wCls(weight, style) {
    const wc = weight === 300 ? 'w3' : weight === 500 ? 'w5' : 'w8'
    return style === 'italic' ? `${wc} it` : wc
  }

  // --- brightness lookup table ---
  const brightnessLookup = []
  for (let b = 0; b < 256; b++) {
    const brightness = b / 255
    if (brightness < 0.03) {
      brightnessLookup.push({ propHtml: ' ' })
      continue
    }
    const match = findBest(brightness)
    const alphaIndex = Math.max(1, Math.min(10, Math.round(brightness * 10)))
    brightnessLookup.push({
      propHtml: `<span class="${wCls(match.weight, match.style)} a${alphaIndex}">${esc(match.char)}</span>`,
    })
  }

  // --- particles ---
  const particles = []
  for (let i = 0; i < PARTICLE_N; i++) {
    particles.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
    })
  }

  // --- simulation canvas (offscreen, drives the brightness field) ---
  const simulationCanvas = document.createElement('canvas')
  simulationCanvas.width = CANVAS_W
  simulationCanvas.height = CANVAS_H
  const sCtx = simulationCanvas.getContext('2d', { willReadFrequently: true })

  // --- brightness field ---
  const brightnessField = new Float32Array(FIELD_COLS * FIELD_ROWS)

  // --- sprite cache ---
  const spriteCache = new Map()

  function getSpriteCanvas(radius) {
    if (spriteCache.has(radius)) return spriteCache.get(radius)
    const c = document.createElement('canvas')
    c.width = radius * 2
    c.height = radius * 2
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius)
    g.addColorStop(0, 'rgba(255,255,255,0.45)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.15)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, radius * 2, radius * 2)
    spriteCache.set(radius, c)
    return c
  }

  function spriteAlphaAt(d) {
    if (d >= 1) return 0
    if (d <= 0.35) return 0.45 + (0.15 - 0.45) * (d / 0.35)
    return 0.15 * (1 - (d - 0.35) / 0.65)
  }

  function createFieldStamp(radiusPx) {
    const frx = radiusPx * FIELD_SCALE_X
    const fry = radiusPx * FIELD_SCALE_Y
    const rx = Math.ceil(frx)
    const ry = Math.ceil(fry)
    const sx = rx * 2 + 1
    const sy = ry * 2 + 1
    const values = new Float32Array(sx * sy)
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        const nd = Math.sqrt((x / frx) ** 2 + (y / fry) ** 2)
        values[(y + ry) * sx + x + rx] = spriteAlphaAt(nd)
      }
    }
    return { radiusX: rx, radiusY: ry, sizeX: sx, sizeY: sy, values }
  }

  function splatFieldStamp(cx, cy, stamp) {
    const gcx = Math.round(cx * FIELD_SCALE_X)
    const gcy = Math.round(cy * FIELD_SCALE_Y)
    for (let y = -stamp.radiusY; y <= stamp.radiusY; y++) {
      const gy = gcy + y
      if (gy < 0 || gy >= FIELD_ROWS) continue
      const fro = gy * FIELD_COLS
      const sro = (y + stamp.radiusY) * stamp.sizeX
      for (let x = -stamp.radiusX; x <= stamp.radiusX; x++) {
        const gx = gcx + x
        if (gx < 0 || gx >= FIELD_COLS) continue
        const sv = stamp.values[sro + x + stamp.radiusX]
        if (sv === 0) continue
        const fi = fro + gx
        brightnessField[fi] = Math.min(1, brightnessField[fi] + sv)
      }
    }
  }

  const particleStamp = createFieldStamp(SPRITE_R)
  const largeAttractorStamp = createFieldStamp(LARGE_ATTRACTOR_R)
  const smallAttractorStamp = createFieldStamp(ATTRACTOR_R)

  // --- create prop rows ---
  const rowNodes = []
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('div')
    row.className = 'art-row'
    row.style.height = row.style.lineHeight = `${LINE_HEIGHT}px`
    propBox.value.appendChild(row)
    rowNodes.push(row)
  }

  // --- render loop ---
  // 3 attractors, each orbiting in a circle on a different plane
  const ORBIT_SPEED = 0.0004
  const ORBIT_R = 0.35

  function render(now) {
    const t = now * ORBIT_SPEED
    const ax = []
    const ay = []

    // blob 1: XY plane (horizontal circle)
    ax.push(Math.cos(t) * CANVAS_W * ORBIT_R + CANVAS_W / 2)
    ay.push(Math.sin(t) * CANVAS_H * ORBIT_R + CANVAS_H / 2)

    // blob 2: XZ plane (appears as horizontal oscillation + vertical circle, 120deg offset)
    ax.push(Math.cos(t + Math.PI * 2 / 3) * CANVAS_W * ORBIT_R + CANVAS_W / 2)
    ay.push(Math.sin(t * 0.7 + Math.PI * 2 / 3) * CANVAS_H * ORBIT_R + CANVAS_H / 2)

    // blob 3: YZ plane (vertical oscillation + horizontal circle, 240deg offset)
    ax.push(Math.cos(t * 0.7 + Math.PI * 4 / 3) * CANVAS_W * ORBIT_R + CANVAS_W / 2)
    ay.push(Math.sin(t + Math.PI * 4 / 3) * CANVAS_H * ORBIT_R + CANVAS_H / 2)

    for (const p of particles) {
      let closestDx = 0, closestDy = 0, closestDist = Infinity
      for (let i = 0; i < 3; i++) {
        const dx = ax[i] - p.x
        const dy = ay[i] - p.y
        const d2 = dx * dx + dy * dy
        if (d2 < closestDist) {
          closestDist = d2
          closestDx = dx
          closestDy = dy
        }
      }
      const dist = Math.sqrt(closestDist) + 1
      p.vx += (closestDx / dist) * ATTRACTOR_FORCE
      p.vy += (closestDy / dist) * ATTRACTOR_FORCE
      p.vx += (Math.random() - 0.5) * 0.2
      p.vy += (Math.random() - 0.5) * 0.2
      p.vx *= 0.96
      p.vy *= 0.96
      p.x += p.vx
      p.y += p.vy
      if (p.x < -SPRITE_R) p.x += CANVAS_W + SPRITE_R * 2
      if (p.x > CANVAS_W + SPRITE_R) p.x -= CANVAS_W + SPRITE_R * 2
      if (p.y < -SPRITE_R) p.y += CANVAS_H + SPRITE_R * 2
      if (p.y > CANVAS_H + SPRITE_R) p.y -= CANVAS_H + SPRITE_R * 2
    }

    // draw source canvas
    sCtx.fillStyle = 'rgba(0,0,0,0.15)'
    sCtx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    sCtx.globalCompositeOperation = 'lighter'
    const ps = getSpriteCanvas(SPRITE_R)
    for (const p of particles) sCtx.drawImage(ps, p.x - SPRITE_R, p.y - SPRITE_R)
    for (let i = 0; i < 3; i++) {
      sCtx.drawImage(getSpriteCanvas(LARGE_ATTRACTOR_R), ax[i] - LARGE_ATTRACTOR_R, ay[i] - LARGE_ATTRACTOR_R)
    }
    sCtx.globalCompositeOperation = 'source-over'

    // update brightness field
    for (let i = 0; i < brightnessField.length; i++) brightnessField[i] *= FIELD_DECAY
    for (const p of particles) splatFieldStamp(p.x, p.y, particleStamp)
    for (let i = 0; i < 3; i++) splatFieldStamp(ax[i], ay[i], largeAttractorStamp)

    // render ASCII rows
    for (let row = 0; row < ROWS; row++) {
      let html = ''
      const fieldRowStart = row * FIELD_OVERSAMPLE * FIELD_COLS
      for (let col = 0; col < COLS; col++) {
        const fieldColStart = col * FIELD_OVERSAMPLE
        let brightness = 0
        for (let sy = 0; sy < FIELD_OVERSAMPLE; sy++) {
          const offset = fieldRowStart + sy * FIELD_COLS + fieldColStart
          for (let sx = 0; sx < FIELD_OVERSAMPLE; sx++) {
            brightness += brightnessField[offset + sx]
          }
        }
        const byte = Math.min(255, ((brightness / (FIELD_OVERSAMPLE * FIELD_OVERSAMPLE)) * 255) | 0)
        html += brightnessLookup[byte].propHtml
      }
      rowNodes[row].innerHTML = html
    }

    animFrameId = requestAnimationFrame(render)
  }

  animFrameId = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (animFrameId !== null) cancelAnimationFrame(animFrameId)
})
</script>

<style scoped>
.experiment-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.art-box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.art-box :deep(.art-row) {
  display: block;
  width: fit-content;
  margin-inline: auto;
  white-space: pre;
  font-family: Georgia, Palatino, "Times New Roman", serif;
  font-size: 14px;
}

.art-box :deep(.w3) { font-weight: 300; }
.art-box :deep(.w5) { font-weight: 500; }
.art-box :deep(.w8) { font-weight: 800; }
.art-box :deep(.it) { font-style: italic; }

.art-box :deep(.a1) { color: rgba(110, 140, 180, 0.10); }
.art-box :deep(.a2) { color: rgba(110, 140, 180, 0.20); }
.art-box :deep(.a3) { color: rgba(110, 140, 180, 0.30); }
.art-box :deep(.a4) { color: rgba(110, 140, 180, 0.40); }
.art-box :deep(.a5) { color: rgba(110, 140, 180, 0.50); }
.art-box :deep(.a6) { color: rgba(110, 140, 180, 0.60); }
.art-box :deep(.a7) { color: rgba(110, 140, 180, 0.70); }
.art-box :deep(.a8) { color: rgba(110, 140, 180, 0.80); }
.art-box :deep(.a9) { color: rgba(110, 140, 180, 0.90); }
.art-box :deep(.a10) { color: rgba(110, 140, 180, 1.0); }
</style>
