<template>
  <div class="experiment-page" ref="pageRef">
    <!-- Variation 1: Magnetic Cursor -->
    <section class="variation" ref="section1">
      <div class="variation-label">01 — Magnetic Cursor</div>
      <canvas ref="canvas1"></canvas>
    </section>

    <div class="section-divider"></div>

    <!-- Variation 2: Gravity Well -->
    <section class="variation" ref="section2">
      <div class="variation-label">02 — Gravity Well</div>
      <canvas ref="canvas2"></canvas>
    </section>

    <div class="section-divider"></div>

    <!-- Variation 3: Wind Tunnel -->
    <section class="variation" ref="section3">
      <div class="variation-label">03 — Wind Tunnel</div>
      <canvas ref="canvas3"></canvas>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const pageRef = ref(null)
const section1 = ref(null)
const section2 = ref(null)
const section3 = ref(null)
const canvas1 = ref(null)
const canvas2 = ref(null)
const canvas3 = ref(null)

const animFrames = []
const cleanups = []

function getCharPositions(text, font, maxWidth, lineHeight, offsetX = 0, offsetY = 0) {
  const prepared = prepareWithSegments(text, font)
  const result = layoutWithLines(prepared, maxWidth, lineHeight)
  const chars = []
  const measureCanvas = document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  ctx.font = font

  for (let i = 0; i < result.lines.length; i++) {
    const line = result.lines[i]
    const lineY = offsetY + i * lineHeight
    // Center the line horizontally
    const lineX = offsetX + (maxWidth - line.width) / 2
    let x = lineX
    for (const ch of line.text) {
      if (ch === '\n') continue
      const w = ctx.measureText(ch).width
      chars.push({ char: ch, homeX: x + w / 2, homeY: lineY, x: x + w / 2, y: lineY, vx: 0, vy: 0, width: w, font })
      x += w
    }
  }
  return { chars, height: result.height, lineCount: result.lineCount }
}

onMounted(() => {
  const dpr = window.devicePixelRatio || 1

  // =============================================
  // VARIATION 1: Magnetic Cursor
  // =============================================
  {
    const canvas = canvas1.value
    const section = section1.value
    const ctx = canvas.getContext('2d')
    let w = section.clientWidth
    let h = section.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)

    const titleFont = '700 48px "Space Grotesk", sans-serif'
    const subFont = '400 20px "Space Grotesk", sans-serif'

    const titleText = 'Ondrej Dobiš'
    const subText = 'Developer & Designer'

    const maxW = Math.min(w - 80, 700)
    const titleResult = getCharPositions(titleText, titleFont, maxW, 58, (w - maxW) / 2, h / 2 - 50)
    const subResult = getCharPositions(subText, subFont, maxW, 30, (w - maxW) / 2, h / 2 + 20)

    const allChars = [...titleResult.chars, ...subResult.chars]

    let mouseX = -9999
    let mouseY = -9999
    const REPEL_RADIUS = 150
    const SPRING = 0.08
    const DAMPING = 0.88

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    function onMouseLeave() {
      mouseX = -9999
      mouseY = -9999
    }
    function onTouchMove(e) {
      const rect = canvas.getBoundingClientRect()
      const t = e.touches[0]
      mouseX = t.clientX - rect.left
      mouseY = t.clientY - rect.top
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })

    cleanups.push(() => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('touchmove', onTouchMove)
    })

    function animate1() {
      ctx.clearRect(0, 0, w, h)

      for (const c of allChars) {
        // Repulsion from mouse
        const dx = c.x - mouseX
        const dy = c.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * 12
          c.vx += (dx / dist) * force
          c.vy += (dy / dist) * force
        }

        // Spring back to home
        c.vx += (c.homeX - c.x) * SPRING
        c.vy += (c.homeY - c.y) * SPRING

        // Damping
        c.vx *= DAMPING
        c.vy *= DAMPING

        c.x += c.vx
        c.y += c.vy

        // Color: brighter when displaced
        const displacement = Math.sqrt((c.x - c.homeX) ** 2 + (c.y - c.homeY) ** 2)
        const brightness = Math.min(1, 0.55 + displacement / 100)
        const r = Math.round(77 + displacement * 0.5)
        const g = Math.round(147 + displacement * 0.3)
        const b = Math.round(235)

        ctx.font = c.font
        ctx.fillStyle = `rgba(${Math.min(r, 200)}, ${Math.min(g, 220)}, ${b}, ${brightness})`
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.x - c.width / 2, c.y)
      }

      animFrames[0] = requestAnimationFrame(animate1)
    }
    animFrames[0] = requestAnimationFrame(animate1)

    // Resize handler
    function resize1() {
      w = section.clientWidth
      h = section.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const newMaxW = Math.min(w - 80, 700)
      const newTitle = getCharPositions(titleText, titleFont, newMaxW, 58, (w - newMaxW) / 2, h / 2 - 50)
      const newSub = getCharPositions(subText, subFont, newMaxW, 30, (w - newMaxW) / 2, h / 2 + 20)
      const newAll = [...newTitle.chars, ...newSub.chars]
      for (let i = 0; i < allChars.length && i < newAll.length; i++) {
        allChars[i].homeX = newAll[i].homeX
        allChars[i].homeY = newAll[i].homeY
      }
    }
    window.addEventListener('resize', resize1)
    cleanups.push(() => window.removeEventListener('resize', resize1))
  }

  // =============================================
  // VARIATION 2: Gravity Well
  // =============================================
  {
    const canvas = canvas2.value
    const section = section2.value
    const ctx = canvas.getContext('2d')
    let w = section.clientWidth
    let h = section.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)

    const font = '400 18px "Space Grotesk", sans-serif'
    const text = 'The quick brown fox jumps over the lazy dog. Every character in this paragraph is an independent physics body, waiting to fall.'
    const maxW = Math.min(w - 80, 600)
    const result = getCharPositions(text, font, maxW, 28, (w - maxW) / 2, h / 2 - 60)
    const chars = result.chars

    let restoreTimer = null
    let restoring = false
    const GRAVITY = 0.4
    const BOUNCE = 0.55
    const RESTORE_SPRING = 0.05
    const RESTORE_DAMP = 0.9

    function onClick(e) {
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      restoring = false
      if (restoreTimer) clearTimeout(restoreTimer)

      for (const c of chars) {
        const dx = cx - c.x
        const dy = cy - c.y
        const dist = Math.sqrt(dx * dx + dy * dy) + 1
        const force = Math.min(15, 300 / dist)
        c.vx += (dx / dist) * force + (Math.random() - 0.5) * 3
        c.vy += (dy / dist) * force + (Math.random() - 0.5) * 3
      }

      restoreTimer = setTimeout(() => { restoring = true }, 2000)
    }

    canvas.addEventListener('click', onClick)
    cleanups.push(() => {
      canvas.removeEventListener('click', onClick)
      if (restoreTimer) clearTimeout(restoreTimer)
    })

    function animate2() {
      // Trail effect
      ctx.fillStyle = 'rgba(10, 10, 26, 0.2)'
      ctx.fillRect(0, 0, w, h)

      for (const c of chars) {
        if (restoring) {
          c.vx += (c.homeX - c.x) * RESTORE_SPRING
          c.vy += (c.homeY - c.y) * RESTORE_SPRING
          c.vx *= RESTORE_DAMP
          c.vy *= RESTORE_DAMP
        } else {
          // Only apply gravity if character has been disturbed
          if (Math.abs(c.vx) > 0.1 || Math.abs(c.vy) > 0.1 || Math.abs(c.y - c.homeY) > 1) {
            c.vy += GRAVITY
          }
          c.vx *= 0.99
          c.vy *= 0.99
        }

        c.x += c.vx
        c.y += c.vy

        // Floor collision
        if (c.y > h - 20) {
          c.y = h - 20
          c.vy *= -BOUNCE
          c.vx *= 0.9
        }
        // Wall collisions
        if (c.x < 10) { c.x = 10; c.vx *= -BOUNCE }
        if (c.x > w - 10) { c.x = w - 10; c.vx *= -BOUNCE }

        const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy)
        const alpha = Math.min(1, 0.5 + speed / 10)
        ctx.font = c.font
        ctx.fillStyle = `rgba(123, 147, 235, ${alpha})`
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.x - c.width / 2, c.y)
      }

      animFrames[1] = requestAnimationFrame(animate2)
    }
    animFrames[1] = requestAnimationFrame(animate2)
  }

  // =============================================
  // VARIATION 3: Wind Tunnel
  // =============================================
  {
    const canvas = canvas3.value
    const section = section3.value
    const ctx = canvas.getContext('2d')
    let w = section.clientWidth
    let h = section.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)

    const font = '400 18px "Space Grotesk", sans-serif'
    const text = 'Developer, designer, and problem solver based in Bratislava, Slovakia. I build things for the web and love creative experiments.'
    const maxW = Math.min(w - 80, 600)
    const result = getCharPositions(text, font, maxW, 28, (w - maxW) / 2, h / 2 - 50)
    const chars = result.chars

    // Add mass to each character (punctuation is lighter)
    const lightChars = new Set(['.', ',', '!', '?', ';', ':', "'", '"', '-', ' '])
    for (const c of chars) {
      c.mass = lightChars.has(c.char) ? 0.3 : 1.0
    }

    let dragging = false
    let lastMouseX = 0
    let dragVelocity = 0
    let windForce = 0
    const WIND_DECAY = 0.95
    const SPRING = 0.06
    const DAMPING = 0.9

    function onMouseDown(e) {
      dragging = true
      lastMouseX = e.clientX
      dragVelocity = 0
    }
    function onMouseMoveWind(e) {
      if (!dragging) return
      dragVelocity = e.clientX - lastMouseX
      lastMouseX = e.clientX
    }
    function onMouseUp() {
      dragging = false
    }

    function onTouchStart(e) {
      dragging = true
      lastMouseX = e.touches[0].clientX
      dragVelocity = 0
    }
    function onTouchMoveWind(e) {
      if (!dragging) return
      dragVelocity = e.touches[0].clientX - lastMouseX
      lastMouseX = e.touches[0].clientX
    }
    function onTouchEnd() {
      dragging = false
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMoveWind)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMoveWind, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    cleanups.push(() => {
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMoveWind)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMoveWind)
      window.removeEventListener('touchend', onTouchEnd)
    })

    function animate3() {
      // Trail effect
      ctx.fillStyle = 'rgba(10, 10, 26, 0.15)'
      ctx.fillRect(0, 0, w, h)

      if (dragging) {
        windForce = dragVelocity * 0.8
      }
      windForce *= WIND_DECAY

      for (const c of chars) {
        // Wind force (lighter chars blown more)
        c.vx += windForce * (0.5 / c.mass)

        // Spring back to home
        c.vx += (c.homeX - c.x) * SPRING
        c.vy += (c.homeY - c.y) * SPRING

        // Slight perpendicular force during return for spiral effect
        const dx = c.homeX - c.x
        const dy = c.homeY - c.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 5 && Math.abs(windForce) < 0.5) {
          c.vx += (dy / dist) * 0.3
          c.vy += (-dx / dist) * 0.3
        }

        c.vx *= DAMPING
        c.vy *= DAMPING
        c.x += c.vx
        c.y += c.vy

        // Wrap horizontally
        if (c.x > w + 20) c.x -= w + 40
        if (c.x < -20) c.x += w + 40

        const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy)
        const alpha = Math.min(1, 0.5 + speed / 8)
        const blue = Math.round(180 + Math.min(75, speed * 5))
        ctx.font = c.font
        ctx.fillStyle = `rgba(110, 140, ${blue}, ${alpha})`
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.x - c.width / 2, c.y)
      }

      animFrames[2] = requestAnimationFrame(animate3)
    }
    animFrames[2] = requestAnimationFrame(animate3)
  }
})

onUnmounted(() => {
  for (const id of animFrames) {
    if (id) cancelAnimationFrame(id)
  }
  for (const fn of cleanups) fn()
})
</script>

<style scoped>
.experiment-page {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: #0a0a1a;
  scroll-snap-type: y mandatory;
}

.variation {
  position: relative;
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
}

.variation canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.variation-label {
  position: absolute;
  top: 16px;
  left: 20px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(77, 99, 187, 0.4);
  z-index: 1;
  pointer-events: none;
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #4D63BB33, transparent);
}
</style>
