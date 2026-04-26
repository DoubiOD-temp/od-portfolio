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
  const isMobile = window.innerWidth < 768
  const FONT_SIZE = isMobile ? 10 : 14
  const LINE_HEIGHT = isMobile ? 12 : 16
  const PROP_FAMILY = 'Georgia, Palatino, "Times New Roman", serif'
  const TARGET_CHAR_W = isMobile ? 6.3 : 8.8
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
  const PARTICLE_N = 350
  const SPRITE_R = 14
  const LARGE_ATTRACTOR_R = 40
  const ATTRACTOR_FORCE = 0.15
  const FIELD_DECAY = 0.85
  const CHARSET = ' .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const WEIGHTS = [300, 500, 800]
  const STYLES = ['normal', 'italic']
  const NUM_BLOBS = 7

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

  // --- width measurement ---
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

  // --- brightness lookup per color (colorIndex, brightnessByte) -> html ---
  function buildHtml(brightnessByte, colorIndex) {
    const brightness = brightnessByte / 255
    if (brightness < 0.03) return ' '
    const match = findBest(brightness)
    const alphaIndex = Math.max(1, Math.min(10, Math.round(brightness * 10)))
    return `<span class="${wCls(match.weight, match.style)} c${colorIndex} a${alphaIndex}">${esc(match.char)}</span>`
  }

  // pre-build lookup: [colorIndex][brightnessByte] -> html
  const brightnessLookup = []
  for (let c = 0; c < NUM_BLOBS; c++) {
    const arr = []
    for (let b = 0; b < 256; b++) arr.push(buildHtml(b, c))
    brightnessLookup.push(arr)
  }

  // --- particles: each assigned to a blob ---
  const particles = []
  for (let i = 0; i < PARTICLE_N; i++) {
    particles.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      blob: i % NUM_BLOBS,
    })
  }

  // --- simulation canvas (offscreen) ---
  const simulationCanvas = document.createElement('canvas')
  simulationCanvas.width = CANVAS_W
  simulationCanvas.height = CANVAS_H
  const sCtx = simulationCanvas.getContext('2d', { willReadFrequently: true })

  // --- single brightness field + color index field ---
  const brightnessField = new Float32Array(FIELD_COLS * FIELD_ROWS)
  const colorField = new Uint8Array(FIELD_COLS * FIELD_ROWS)

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

  function splatFieldStamp(cx, cy, stamp, blobIndex) {
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
        const newVal = brightnessField[fi] + sv
        if (newVal > brightnessField[fi] || brightnessField[fi] < 0.01) {
          colorField[fi] = blobIndex
        }
        brightnessField[fi] = Math.min(1, newVal)
      }
    }
  }

  const particleStamp = createFieldStamp(SPRITE_R)
  const attractorStamp = createFieldStamp(LARGE_ATTRACTOR_R)

  // --- create prop rows ---
  const rowNodes = []
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('div')
    row.className = 'art-row'
    row.style.height = row.style.lineHeight = `${LINE_HEIGHT}px`
    row.style.fontSize = `${FONT_SIZE}px`
    propBox.value.appendChild(row)
    rowNodes.push(row)
  }

  // --- 7 attractors, each on a different orbital axis ---
  const ORBIT_SPEED = 0.0004
  const ORBIT_R = 0.35

  function render(now) {
    const t = now * ORBIT_SPEED
    const ax = []
    const ay = []

    // each blob gets a unique combination of x/y speeds and orbit radii
    const blobOrbits = [
      { xs: 1.0,  ys: 0.6,  rx: 0.40, ry: 0.35 },
      { xs: 0.7,  ys: 1.1,  rx: 0.35, ry: 0.40 },
      { xs: 1.3,  ys: 0.8,  rx: 0.30, ry: 0.38 },
      { xs: 0.5,  ys: 1.4,  rx: 0.42, ry: 0.28 },
      { xs: 1.1,  ys: 0.4,  rx: 0.28, ry: 0.42 },
      { xs: 0.9,  ys: 1.2,  rx: 0.38, ry: 0.32 },
      { xs: 1.5,  ys: 0.9,  rx: 0.33, ry: 0.36 },
    ]
    for (let i = 0; i < NUM_BLOBS; i++) {
      const phase = (Math.PI * 2 * i) / NUM_BLOBS
      const o = blobOrbits[i]
      ax.push(Math.cos(t * o.xs + phase) * CANVAS_W * o.rx + CANVAS_W / 2)
      ay.push(Math.sin(t * o.ys + phase) * CANVAS_H * o.ry + CANVAS_H / 2)
    }

    for (const p of particles) {
      const bi = p.blob
      const dx = ax[bi] - p.x
      const dy = ay[bi] - p.y
      const dist = Math.sqrt(dx * dx + dy * dy) + 1
      p.vx += (dx / dist) * ATTRACTOR_FORCE
      p.vy += (dy / dist) * ATTRACTOR_FORCE
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
    for (let i = 0; i < NUM_BLOBS; i++) {
      sCtx.drawImage(getSpriteCanvas(LARGE_ATTRACTOR_R), ax[i] - LARGE_ATTRACTOR_R, ay[i] - LARGE_ATTRACTOR_R)
    }
    sCtx.globalCompositeOperation = 'source-over'

    // decay and splat single field
    for (let i = 0; i < brightnessField.length; i++) brightnessField[i] *= FIELD_DECAY
    for (let b = 0; b < NUM_BLOBS; b++) {
      splatFieldStamp(ax[b], ay[b], attractorStamp, b)
    }
    for (const p of particles) {
      splatFieldStamp(p.x, p.y, particleStamp, p.blob)
    }

    // render ASCII rows
    for (let row = 0; row < ROWS; row++) {
      let html = ''
      const fieldRowStart = row * FIELD_OVERSAMPLE * FIELD_COLS
      for (let col = 0; col < COLS; col++) {
        const fieldColStart = col * FIELD_OVERSAMPLE
        let brightness = 0
        let dominantColor = 0
        for (let sy = 0; sy < FIELD_OVERSAMPLE; sy++) {
          const offset = fieldRowStart + sy * FIELD_COLS + fieldColStart
          for (let sx = 0; sx < FIELD_OVERSAMPLE; sx++) {
            const fi = offset + sx
            const v = brightnessField[fi]
            if (v > brightness) {
              dominantColor = colorField[fi]
            }
            brightness += v
          }
        }
        const byte = Math.min(255, ((brightness / (FIELD_OVERSAMPLE * FIELD_OVERSAMPLE)) * 255) | 0)
        html += brightnessLookup[dominantColor][byte]
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
  font-size: inherit;
}

.art-box :deep(.w3) { font-weight: 300; }
.art-box :deep(.w5) { font-weight: 500; }
.art-box :deep(.w8) { font-weight: 800; }
.art-box :deep(.it) { font-style: italic; }

/* 7 dark pastel colors */
.art-box :deep(.c0.a1) { color: rgba(110, 140, 180, 0.10); }
.art-box :deep(.c0.a2) { color: rgba(110, 140, 180, 0.20); }
.art-box :deep(.c0.a3) { color: rgba(110, 140, 180, 0.30); }
.art-box :deep(.c0.a4) { color: rgba(110, 140, 180, 0.40); }
.art-box :deep(.c0.a5) { color: rgba(110, 140, 180, 0.50); }
.art-box :deep(.c0.a6) { color: rgba(110, 140, 180, 0.60); }
.art-box :deep(.c0.a7) { color: rgba(110, 140, 180, 0.70); }
.art-box :deep(.c0.a8) { color: rgba(110, 140, 180, 0.80); }
.art-box :deep(.c0.a9) { color: rgba(110, 140, 180, 0.90); }
.art-box :deep(.c0.a10) { color: rgba(110, 140, 180, 1.0); }

.art-box :deep(.c1.a1) { color: rgba(160, 120, 140, 0.10); }
.art-box :deep(.c1.a2) { color: rgba(160, 120, 140, 0.20); }
.art-box :deep(.c1.a3) { color: rgba(160, 120, 140, 0.30); }
.art-box :deep(.c1.a4) { color: rgba(160, 120, 140, 0.40); }
.art-box :deep(.c1.a5) { color: rgba(160, 120, 140, 0.50); }
.art-box :deep(.c1.a6) { color: rgba(160, 120, 140, 0.60); }
.art-box :deep(.c1.a7) { color: rgba(160, 120, 140, 0.70); }
.art-box :deep(.c1.a8) { color: rgba(160, 120, 140, 0.80); }
.art-box :deep(.c1.a9) { color: rgba(160, 120, 140, 0.90); }
.art-box :deep(.c1.a10) { color: rgba(160, 120, 140, 1.0); }

.art-box :deep(.c2.a1) { color: rgba(130, 165, 130, 0.10); }
.art-box :deep(.c2.a2) { color: rgba(130, 165, 130, 0.20); }
.art-box :deep(.c2.a3) { color: rgba(130, 165, 130, 0.30); }
.art-box :deep(.c2.a4) { color: rgba(130, 165, 130, 0.40); }
.art-box :deep(.c2.a5) { color: rgba(130, 165, 130, 0.50); }
.art-box :deep(.c2.a6) { color: rgba(130, 165, 130, 0.60); }
.art-box :deep(.c2.a7) { color: rgba(130, 165, 130, 0.70); }
.art-box :deep(.c2.a8) { color: rgba(130, 165, 130, 0.80); }
.art-box :deep(.c2.a9) { color: rgba(130, 165, 130, 0.90); }
.art-box :deep(.c2.a10) { color: rgba(130, 165, 130, 1.0); }

.art-box :deep(.c3.a1) { color: rgba(180, 155, 110, 0.10); }
.art-box :deep(.c3.a2) { color: rgba(180, 155, 110, 0.20); }
.art-box :deep(.c3.a3) { color: rgba(180, 155, 110, 0.30); }
.art-box :deep(.c3.a4) { color: rgba(180, 155, 110, 0.40); }
.art-box :deep(.c3.a5) { color: rgba(180, 155, 110, 0.50); }
.art-box :deep(.c3.a6) { color: rgba(180, 155, 110, 0.60); }
.art-box :deep(.c3.a7) { color: rgba(180, 155, 110, 0.70); }
.art-box :deep(.c3.a8) { color: rgba(180, 155, 110, 0.80); }
.art-box :deep(.c3.a9) { color: rgba(180, 155, 110, 0.90); }
.art-box :deep(.c3.a10) { color: rgba(180, 155, 110, 1.0); }

.art-box :deep(.c4.a1) { color: rgba(145, 125, 175, 0.10); }
.art-box :deep(.c4.a2) { color: rgba(145, 125, 175, 0.20); }
.art-box :deep(.c4.a3) { color: rgba(145, 125, 175, 0.30); }
.art-box :deep(.c4.a4) { color: rgba(145, 125, 175, 0.40); }
.art-box :deep(.c4.a5) { color: rgba(145, 125, 175, 0.50); }
.art-box :deep(.c4.a6) { color: rgba(145, 125, 175, 0.60); }
.art-box :deep(.c4.a7) { color: rgba(145, 125, 175, 0.70); }
.art-box :deep(.c4.a8) { color: rgba(145, 125, 175, 0.80); }
.art-box :deep(.c4.a9) { color: rgba(145, 125, 175, 0.90); }
.art-box :deep(.c4.a10) { color: rgba(145, 125, 175, 1.0); }

.art-box :deep(.c5.a1) { color: rgba(170, 130, 120, 0.10); }
.art-box :deep(.c5.a2) { color: rgba(170, 130, 120, 0.20); }
.art-box :deep(.c5.a3) { color: rgba(170, 130, 120, 0.30); }
.art-box :deep(.c5.a4) { color: rgba(170, 130, 120, 0.40); }
.art-box :deep(.c5.a5) { color: rgba(170, 130, 120, 0.50); }
.art-box :deep(.c5.a6) { color: rgba(170, 130, 120, 0.60); }
.art-box :deep(.c5.a7) { color: rgba(170, 130, 120, 0.70); }
.art-box :deep(.c5.a8) { color: rgba(170, 130, 120, 0.80); }
.art-box :deep(.c5.a9) { color: rgba(170, 130, 120, 0.90); }
.art-box :deep(.c5.a10) { color: rgba(170, 130, 120, 1.0); }

.art-box :deep(.c6.a1) { color: rgba(120, 160, 155, 0.10); }
.art-box :deep(.c6.a2) { color: rgba(120, 160, 155, 0.20); }
.art-box :deep(.c6.a3) { color: rgba(120, 160, 155, 0.30); }
.art-box :deep(.c6.a4) { color: rgba(120, 160, 155, 0.40); }
.art-box :deep(.c6.a5) { color: rgba(120, 160, 155, 0.50); }
.art-box :deep(.c6.a6) { color: rgba(120, 160, 155, 0.60); }
.art-box :deep(.c6.a7) { color: rgba(120, 160, 155, 0.70); }
.art-box :deep(.c6.a8) { color: rgba(120, 160, 155, 0.80); }
.art-box :deep(.c6.a9) { color: rgba(120, 160, 155, 0.90); }
.art-box :deep(.c6.a10) { color: rgba(120, 160, 155, 1.0); }
</style>
