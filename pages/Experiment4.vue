<template>
  <div class="experiment-page" ref="pageRef">
    <!-- 01 — Summon -->
    <section class="variation" ref="section1">
      <div class="variation-label"><span class="num">01</span><span class="rule"></span><span class="title">Summon</span></div>
      <canvas ref="canvas1"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 02 — Scroll Reveal -->
    <section class="variation" ref="section2">
      <div class="variation-label"><span class="num">02</span><span class="rule"></span><span class="title">Scroll Reveal</span></div>
      <canvas ref="canvas2"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 03 — Dual State -->
    <section class="variation" ref="section3">
      <div class="variation-label"><span class="num">03</span><span class="rule"></span><span class="title">Dual State</span></div>
      <canvas ref="canvas3"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 04 — Typewriter Cascade -->
    <section class="variation" ref="section4">
      <div class="variation-label"><span class="num">04</span><span class="rule"></span><span class="title">Typewriter Cascade</span></div>
      <canvas ref="canvas4"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 05 — Spaghettification -->
    <section class="variation" ref="section5">
      <div class="variation-label"><span class="num">05</span><span class="rule"></span><span class="title">Spaghettification</span></div>
      <canvas ref="canvas5"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 06 — Marquee Drift -->
    <section class="variation" ref="section6">
      <div class="variation-label"><span class="num">06</span><span class="rule"></span><span class="title">Marquee Drift</span></div>
      <canvas ref="canvas6"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 07 — Origami Fold -->
    <section class="variation" ref="section7">
      <div class="variation-label"><span class="num">07</span><span class="rule"></span><span class="title">Origami Fold</span></div>
      <canvas ref="canvas7"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 08 — Gravity Drop -->
    <section class="variation" ref="section8">
      <div class="variation-label"><span class="num">08</span><span class="rule"></span><span class="title">Gravity Drop</span></div>
      <canvas ref="canvas8"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 09 — Liquid Settle -->
    <section class="variation" ref="section9">
      <div class="variation-label"><span class="num">09</span><span class="rule"></span><span class="title">Liquid Settle</span></div>
      <canvas ref="canvas9"></canvas>
    </section>
    <div class="section-divider"></div>

    <!-- 10 — Erase / Reveal -->
    <section class="variation" ref="section10">
      <div class="variation-label"><span class="num">10</span><span class="rule"></span><span class="title">Erase / Reveal</span></div>
      <canvas ref="canvas10"></canvas>
    </section>

    <div class="page-counter"><span ref="counterEl">01</span><span class="slash"> / </span>10</div>
    <div class="page-mark">Ondrej Dobiš · Type Studies · MMXXVI</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const pageRef = ref(null)
const section1 = ref(null), section2 = ref(null), section3 = ref(null)
const section4 = ref(null), section5 = ref(null), section6 = ref(null)
const section7 = ref(null), section8 = ref(null), section9 = ref(null), section10 = ref(null)
const canvas1 = ref(null), canvas2 = ref(null), canvas3 = ref(null)
const canvas4 = ref(null), canvas5 = ref(null), canvas6 = ref(null)
const canvas7 = ref(null), canvas8 = ref(null), canvas9 = ref(null), canvas10 = ref(null)
const counterEl = ref(null)

const animFrames = []
const cleanups = []

const COLOR = {
  bg: '#2f3cfc',
  green: '#a4ff00',
  orange: '#fe5c24',
  white: '#ffffff'
}

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
    const lineX = offsetX + (maxWidth - line.width) / 2
    let x = lineX
    for (const ch of line.text) {
      if (ch === '\n') continue
      const w = ctx.measureText(ch).width
      chars.push({
        char: ch, homeX: x + w / 2, homeY: lineY,
        x: 0, y: 0, vx: 0, vy: 0,
        width: w, font, state: 'chaos'
      })
      x += w
    }
  }
  return { chars, height: result.height, lineCount: result.lineCount }
}

function setupCanvas(canvas, section) {
  const dpr = window.devicePixelRatio || 1
  const ctx = canvas.getContext('2d')
  const w = section.clientWidth
  const h = section.clientHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  ctx.scale(dpr, dpr)
  return { ctx, w, h }
}

function makeScrollTracker(pageEl, section) {
  const state = { fraction: 0, visible: false }
  function onScroll() {
    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    state.fraction = Math.max(0, Math.min(1, 1 - rect.top / viewH))
    state.visible = rect.bottom > 0 && rect.top < viewH
  }
  onScroll()
  pageEl.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  cleanups.push(() => {
    pageEl.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })
  return state
}

onMounted(() => {
  const pageEl = pageRef.value

  // Page counter update
  function updateCounter() {
    const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10]
    const viewH = window.innerHeight
    let activeIdx = 0
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].value.getBoundingClientRect()
      if (r.top < viewH * 0.5 && r.bottom > viewH * 0.5) { activeIdx = i; break }
      if (r.top < viewH * 0.5) activeIdx = i
    }
    if (counterEl.value) counterEl.value.textContent = String(activeIdx + 1).padStart(2, '0')
  }
  pageEl.addEventListener('scroll', updateCounter, { passive: true })
  cleanups.push(() => pageEl.removeEventListener('scroll', updateCounter))
  updateCounter()

  // =========================================================================
  // 01 — SUMMON
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas1.value, section1.value)
    const font = '900 64px "Fraunces", serif'
    const text = 'Ondrej Dobiš'
    const maxW = w - 40
    const result = getCharPositions(text, font, maxW, 76, (w - maxW) / 2, h / 2 - 10)
    const chars = result.chars

    for (const c of chars) {
      c.x = Math.random() * w
      c.y = Math.random() * h
      c.vx = (Math.random() - 0.5) * 2
      c.vy = (Math.random() - 0.5) * 2
    }

    let summonTime = performance.now() + 1000
    let lastVisible = false
    const tracker = makeScrollTracker(pageEl, section1.value)

    function triggerSummon() {
      for (let i = 0; i < chars.length; i++) {
        chars[i].state = 'forming'
        chars[i].formDelay = i * 14
        chars[i].formStart = performance.now()
        chars[i].formStartX = undefined
        chars[i].formStartY = undefined
      }
    }

    function explode(cx, cy) {
      for (const c of chars) {
        const dx = c.x - cx, dy = c.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy) + 1
        const speed = 18 + Math.random() * 8
        c.vx = (dx / dist) * speed + (Math.random() - 0.5) * 3
        c.vy = (dy / dist) * speed + (Math.random() - 0.5) * 3
        c.state = 'chaos'
      }
      summonTime = performance.now() + 700
    }

    canvas1.value.addEventListener('click', (e) => {
      const rect = canvas1.value.getBoundingClientRect()
      explode(e.clientX - rect.left, e.clientY - rect.top)
    })

    const FORM_DURATION = 420

    function animate1(now) {
      ctx.clearRect(0, 0, w, h)

      // Re-trigger summon when section re-enters viewport
      if (tracker.visible && !lastVisible) {
        for (const c of chars) {
          c.x = Math.random() * w
          c.y = Math.random() * h
          c.vx = (Math.random() - 0.5) * 2
          c.vy = (Math.random() - 0.5) * 2
          c.state = 'chaos'
        }
        summonTime = now + 600
      }
      lastVisible = tracker.visible

      if (chars[0].state === 'chaos' && now >= summonTime) triggerSummon()

      for (const c of chars) {
        if (c.state === 'chaos') {
          c.vx += (Math.random() - 0.5) * 0.2
          c.vy += (Math.random() - 0.5) * 0.2
          c.vx *= 0.96; c.vy *= 0.96
          c.x += c.vx; c.y += c.vy
          if (c.x < -30) c.x += w + 60
          if (c.x > w + 30) c.x -= w + 60
          if (c.y < -30) c.y += h + 60
          if (c.y > h + 30) c.y -= h + 60
        } else if (c.state === 'forming') {
          const elapsed = now - c.formStart
          if (elapsed < c.formDelay) {
            c.vx *= 0.98; c.vy *= 0.98
            c.x += c.vx; c.y += c.vy
          } else {
            const t = Math.min(1, (elapsed - c.formDelay) / FORM_DURATION)
            const ease = 1 - (1 - t) * (1 - t)
            if (c.formStartX === undefined) { c.formStartX = c.x; c.formStartY = c.y }
            c.x = c.formStartX + (c.homeX - c.formStartX) * ease
            c.y = c.formStartY + (c.homeY - c.formStartY) * ease
            if (t >= 1) c.state = 'settled'
          }
        }

        let alpha, color
        if (c.state === 'settled') {
          color = COLOR.white
          alpha = 1
        } else {
          const dist = Math.sqrt((c.x - c.homeX) ** 2 + (c.y - c.homeY) ** 2)
          color = COLOR.green
          alpha = Math.min(1, 0.35 + dist / 250)
        }
        ctx.font = c.font
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.x - c.width / 2, c.y)
      }
      ctx.globalAlpha = 1

      animFrames[0] = requestAnimationFrame(animate1)
    }
    animFrames[0] = requestAnimationFrame(animate1)
  }

  // =========================================================================
  // 02 — SCROLL REVEAL
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas2.value, section2.value)
    const font = '600 19px "Fraunces", serif'
    const paragraphs = [
      'Developer & Designer',
      'Skilled in Vue, Nuxt, JavaScript, Python, Java, and C#. Building beautiful, performant web experiences.',
      'Based in Bratislava, Slovakia. Always exploring new creative frontiers in interactive design.'
    ]
    const maxW = Math.min(w - 80, 560)
    const allChars = []
    let yOffset = 90
    const lineH = 30
    for (const para of paragraphs) {
      const result = getCharPositions(para, font, maxW, lineH, (w - maxW) / 2, yOffset)
      for (const c of result.chars) {
        c.chaosX = Math.random() * w
        c.chaosY = Math.random() * h
        c.chaosvx = (Math.random() - 0.5) * 1
        c.chaosvy = (Math.random() - 0.5) * 1
        c.x = c.chaosX; c.y = c.chaosY
      }
      allChars.push(...result.chars)
      yOffset += result.lineCount * lineH + 36
    }
    const totalTextHeight = yOffset + 40
    const tracker = makeScrollTracker(pageEl, section2.value)
    const TRANSITION_BAND = 80

    function animate2() {
      ctx.clearRect(0, 0, w, h)
      const formationY = tracker.fraction * (totalTextHeight + 100) - 50

      for (const c of allChars) {
        const distToLine = c.homeY - formationY
        if (distToLine < -TRANSITION_BAND / 2) {
          c.x += (c.homeX - c.x) * 0.18
          c.y += (c.homeY - c.y) * 0.18
        } else if (distToLine > TRANSITION_BAND / 2) {
          c.chaosvx += (Math.random() - 0.5) * 0.2
          c.chaosvy += (Math.random() - 0.5) * 0.2
          c.chaosvx *= 0.98; c.chaosvy *= 0.98
          c.chaosX += c.chaosvx; c.chaosY += c.chaosvy
          if (c.chaosX < 10) c.chaosvx = Math.abs(c.chaosvx)
          if (c.chaosX > w - 10) c.chaosvx = -Math.abs(c.chaosvx)
          if (c.chaosY < 10) c.chaosvy = Math.abs(c.chaosvy)
          if (c.chaosY > h - 10) c.chaosvy = -Math.abs(c.chaosvy)
          c.x += (c.chaosX - c.x) * 0.1
          c.y += (c.chaosY - c.y) * 0.1
        } else {
          const t = 1 - (distToLine + TRANSITION_BAND / 2) / TRANSITION_BAND
          c.x += (c.homeX * t + c.chaosX * (1 - t) - c.x) * 0.14
          c.y += (c.homeY * t + c.chaosY * (1 - t) - c.y) * 0.14
        }
        const distNorm = Math.max(0, Math.min(1, 1 - (c.homeY - formationY + TRANSITION_BAND / 2) / TRANSITION_BAND))
        const alpha = 0.25 + distNorm * 0.75
        ctx.font = c.font
        ctx.globalAlpha = alpha
        ctx.fillStyle = distNorm > 0.92 ? COLOR.white : (distNorm > 0.5 ? COLOR.white : COLOR.orange)
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.x - c.width / 2, c.y)
      }
      ctx.globalAlpha = 1
      animFrames[1] = requestAnimationFrame(animate2)
    }
    animFrames[1] = requestAnimationFrame(animate2)
  }

  // =========================================================================
  // 03 — DUAL STATE (now scroll-driven)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas3.value, section3.value)
    const font = '600 19px "Fraunces", serif'
    const text = "Creative developer who loves to build beautiful web experiences and push the boundaries of what's possible in the browser."
    const maxW = Math.min(w - 80, 560)
    const result = getCharPositions(text, font, maxW, 30, (w - maxW) / 2, h / 2 - 50)
    const chars = result.chars
    for (const c of chars) {
      c.chaosX = Math.random() * w
      c.chaosY = Math.random() * h
      c.chaosvx = (Math.random() - 0.5) * 1.5
      c.chaosvy = (Math.random() - 0.5) * 1.5
      c.x = c.chaosX; c.y = c.chaosY
    }
    const tracker = makeScrollTracker(pageEl, section3.value)
    const TRANSITION_BAND = 80

    function animate3() {
      ctx.clearRect(0, 0, w, h)
      const dividerX = tracker.fraction * w

      // Divider
      ctx.strokeStyle = COLOR.green
      ctx.lineWidth = 2
      ctx.shadowColor = COLOR.green
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(dividerX, h * 0.18)
      ctx.lineTo(dividerX, h * 0.82)
      ctx.stroke()
      ctx.shadowBlur = 0

      for (const c of chars) {
        const distToDivider = c.homeX - dividerX
        if (distToDivider > TRANSITION_BAND / 2) {
          c.chaosvx += (Math.random() - 0.5) * 0.3
          c.chaosvy += (Math.random() - 0.5) * 0.3
          c.chaosvx *= 0.97; c.chaosvy *= 0.97
          c.chaosX += c.chaosvx; c.chaosY += c.chaosvy
          if (c.chaosX < dividerX + 10) c.chaosvx = Math.abs(c.chaosvx)
          if (c.chaosX > w - 10) c.chaosvx = -Math.abs(c.chaosvx)
          if (c.chaosY < 30) c.chaosvy = Math.abs(c.chaosvy)
          if (c.chaosY > h - 30) c.chaosvy = -Math.abs(c.chaosvy)
          c.x += (c.chaosX - c.x) * 0.1
          c.y += (c.chaosY - c.y) * 0.1
        } else if (distToDivider < -TRANSITION_BAND / 2) {
          c.x += (c.homeX - c.x) * 0.16
          c.y += (c.homeY - c.y) * 0.16
        } else {
          const t = 1 - (distToDivider + TRANSITION_BAND / 2) / TRANSITION_BAND
          c.x += (c.homeX * t + c.chaosX * (1 - t) - c.x) * 0.12
          c.y += (c.homeY * t + c.chaosY * (1 - t) - c.y) * 0.12
        }
        const formed = c.homeX < dividerX
        ctx.font = c.font
        ctx.globalAlpha = formed ? 1 : 0.45
        ctx.fillStyle = formed ? COLOR.white : COLOR.orange
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.x - c.width / 2, c.y)
      }
      ctx.globalAlpha = 1
      animFrames[2] = requestAnimationFrame(animate3)
    }
    animFrames[2] = requestAnimationFrame(animate3)
  }

  // =========================================================================
  // 04 — TYPEWRITER CASCADE (green)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas4.value, section4.value)
    const font = '900 italic 38px "Fraunces", serif'
    const text = 'Words arrive one at a time, the way thoughts form before they are spoken.'
    const maxW = Math.min(w - 60, 720)
    const probe = getCharPositions(text, font, maxW, 50, 0, 0)
    const result = getCharPositions(text, font, maxW, 50, (w - maxW) / 2, h / 2 - (probe.lineCount * 50) / 2)
    const chars = result.chars
    const tracker = makeScrollTracker(pageEl, section4.value)

    function animate4() {
      ctx.clearRect(0, 0, w, h)
      const f = tracker.fraction
      const eased = Math.max(0, Math.min(1, (f - 0.1) / 0.7))
      const revealed = eased * chars.length

      let lastRevealedChar = null
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        const local = revealed - i
        if (local <= 0) continue
        const t = Math.min(1, local)
        const dropOffset = (1 - t) * 14
        const alpha = t
        ctx.font = c.font
        ctx.globalAlpha = alpha
        ctx.fillStyle = COLOR.white
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.x = c.homeX - c.width / 2, c.y = c.homeY + dropOffset)
        if (t >= 0.95) lastRevealedChar = c
      }
      ctx.globalAlpha = 1

      // Caret
      if (lastRevealedChar) {
        const blink = (Math.sin(performance.now() / 250) + 1) / 2
        ctx.fillStyle = COLOR.green
        ctx.globalAlpha = 0.3 + blink * 0.7
        ctx.fillRect(lastRevealedChar.homeX + lastRevealedChar.width / 2 + 4, lastRevealedChar.homeY - 18, 3, 36)
        ctx.globalAlpha = 1
      }
      animFrames[3] = requestAnimationFrame(animate4)
    }
    animFrames[3] = requestAnimationFrame(animate4)
  }

  // =========================================================================
  // 05 — SPAGHETTIFICATION (orange)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas5.value, section5.value)
    const font = '800 56px "Fraunces", serif'
    const text = 'Stretch · Distort · Settle'
    const maxW = w - 40
    const result = getCharPositions(text, font, maxW, 70, (w - maxW) / 2, h / 2)
    const chars = result.chars
    const tracker = makeScrollTracker(pageEl, section5.value)

    function animate5() {
      ctx.clearRect(0, 0, w, h)
      const f = tracker.fraction
      // Stretch peaks at f=0.5, zero at 0 and 1
      const stretch = Math.sin(f * Math.PI) * 1
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        const centerOffset = (i - chars.length / 2) / chars.length
        const yShift = centerOffset * stretch * h * 0.45
        const scaleY = 1 + stretch * 4
        ctx.save()
        ctx.translate(c.homeX, c.homeY + yShift)
        ctx.scale(1, scaleY)
        ctx.font = c.font
        ctx.globalAlpha = 1 - stretch * 0.5
        ctx.fillStyle = stretch > 0.05 ? COLOR.orange : COLOR.white
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, -c.width / 2, 0)
        ctx.restore()
      }
      ctx.globalAlpha = 1
      animFrames[4] = requestAnimationFrame(animate5)
    }
    animFrames[4] = requestAnimationFrame(animate5)
  }

  // =========================================================================
  // 06 — MARQUEE DRIFT (green)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas6.value, section6.value)
    const font = '900 italic 80px "Fraunces", serif'
    const phraseTop = '  DESIGN  ·  DEVELOP  ·  DELIVER  '
    const phraseBot = '  TYPE  ·  MOTION  ·  CRAFT  '
    const tracker = makeScrollTracker(pageEl, section6.value)
    const measureC = document.createElement('canvas').getContext('2d')
    measureC.font = font
    const wTop = measureC.measureText(phraseTop).width
    const wBot = measureC.measureText(phraseBot).width

    function animate6() {
      ctx.clearRect(0, 0, w, h)
      const f = tracker.fraction
      const offsetTop = -((f * w * 1.2) % wTop)
      const offsetBot = ((f * w * 1.2) % wBot) - wBot
      ctx.font = font
      ctx.textBaseline = 'middle'
      ctx.fillStyle = COLOR.white
      const yTop = h / 2 - 60
      const yBot = h / 2 + 60
      // Repeat to fill width
      for (let x = offsetTop; x < w + wTop; x += wTop) ctx.fillText(phraseTop, x, yTop)
      ctx.fillStyle = COLOR.green
      for (let x = offsetBot; x < w + wBot; x += wBot) ctx.fillText(phraseBot, x, yBot)
      // Underline grows with scroll
      ctx.fillStyle = COLOR.green
      ctx.fillRect(0, h / 2 + 6, w * f, 2)
      animFrames[5] = requestAnimationFrame(animate6)
    }
    animFrames[5] = requestAnimationFrame(animate6)
  }

  // =========================================================================
  // 07 — ORIGAMI FOLD (orange)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas7.value, section7.value)
    const font = '800 52px "Fraunces", serif'
    const text = 'Unfold the surface'
    const maxW = w - 60
    const result = getCharPositions(text, font, maxW, 64, (w - maxW) / 2, h / 2)
    const chars = result.chars
    const tracker = makeScrollTracker(pageEl, section7.value)

    function animate7() {
      ctx.clearRect(0, 0, w, h)
      const f = tracker.fraction
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        const localStart = (i / chars.length) * 0.5
        const t = Math.max(0, Math.min(1, (f - localStart) / 0.5))
        const angle = (1 - t) * Math.PI / 2
        const scaleX = Math.cos(angle)
        const skew = (1 - t) * 0.4 * (i % 2 === 0 ? 1 : -1)
        ctx.save()
        ctx.translate(c.homeX, c.homeY)
        ctx.transform(scaleX, skew, 0, 1, 0, 0)
        ctx.font = c.font
        ctx.globalAlpha = 0.2 + t * 0.8
        ctx.fillStyle = t > 0.95 ? COLOR.white : COLOR.orange
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, -c.width / 2, 0)
        ctx.restore()
      }
      ctx.globalAlpha = 1
      animFrames[6] = requestAnimationFrame(animate7)
    }
    animFrames[6] = requestAnimationFrame(animate7)
  }

  // =========================================================================
  // 08 — GRAVITY DROP (green)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas8.value, section8.value)
    const font = '800 58px "Fraunces", serif'
    const text = 'Falling Into Place'
    const maxW = w - 40
    const result = getCharPositions(text, font, maxW, 70, (w - maxW) / 2, h / 2)
    const chars = result.chars
    const tracker = makeScrollTracker(pageEl, section8.value)
    const seeds = chars.map(() => Math.random())

    function animate8() {
      ctx.clearRect(0, 0, w, h)
      const f = tracker.fraction
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        const localStart = (i / chars.length) * 0.6
        const t = Math.max(0, Math.min(1, (f - localStart) / 0.35))
        // Quadratic ease-in (gravity), then small bounce
        let y
        if (t < 1) {
          const startY = c.homeY - h * 0.6 - seeds[i] * 60
          const eased = t * t
          y = startY + (c.homeY - startY) * eased
        } else {
          y = c.homeY
        }
        // Bounce
        const bounceT = Math.max(0, Math.min(1, (f - localStart - 0.35) / 0.1))
        if (bounceT > 0 && bounceT < 1) {
          y -= Math.sin(bounceT * Math.PI) * 6
        }
        const alpha = Math.min(1, t * 1.6)
        ctx.font = c.font
        ctx.globalAlpha = alpha
        ctx.fillStyle = t < 1 ? COLOR.green : COLOR.white
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.homeX - c.width / 2, y)
      }
      ctx.globalAlpha = 1
      animFrames[7] = requestAnimationFrame(animate8)
    }
    animFrames[7] = requestAnimationFrame(animate8)
  }

  // =========================================================================
  // 09 — LIQUID SETTLE (orange)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas9.value, section9.value)
    const font = '800 48px "Fraunces", serif'
    const text = 'Calm follows the wave'
    const maxW = w - 40
    const result = getCharPositions(text, font, maxW, 60, (w - maxW) / 2, h / 2)
    const chars = result.chars
    const tracker = makeScrollTracker(pageEl, section9.value)

    function animate9() {
      ctx.clearRect(0, 0, w, h)
      const f = tracker.fraction
      const damp = 1 - f
      const amplitude = damp * 60
      const phase = performance.now() / 600
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        const wave = Math.sin(i * 0.4 + phase) * amplitude
        // Shimmer sweeps once across based on f
        const charPos = i / chars.length
        const shimmerWidth = 0.18
        const shimmerCenter = f
        const dist = Math.abs(charPos - shimmerCenter)
        const shimmerStrength = Math.max(0, 1 - dist / shimmerWidth)
        ctx.font = c.font
        ctx.globalAlpha = 1
        if (shimmerStrength > 0.02) {
          // Mix toward orange
          ctx.fillStyle = COLOR.orange
          ctx.globalAlpha = 0.4 + shimmerStrength * 0.6
        } else {
          ctx.fillStyle = COLOR.white
        }
        ctx.textBaseline = 'middle'
        ctx.fillText(c.char, c.homeX - c.width / 2, c.homeY + wave)
      }
      ctx.globalAlpha = 1
      animFrames[8] = requestAnimationFrame(animate9)
    }
    animFrames[8] = requestAnimationFrame(animate9)
  }

  // =========================================================================
  // 10 — ERASE / REVEAL (green)
  // =========================================================================
  {
    const { ctx, w, h } = setupCanvas(canvas10.value, section10.value)
    const font = '800 56px "Fraunces", serif'
    const phraseA = 'Before the change'
    const phraseB = 'After it all'
    const maxW = w - 40
    const layoutA = getCharPositions(phraseA, font, maxW, 70, (w - maxW) / 2, h / 2)
    const layoutB = getCharPositions(phraseB, font, maxW, 70, (w - maxW) / 2, h / 2)
    const tracker = makeScrollTracker(pageEl, section10.value)

    function animate10() {
      ctx.clearRect(0, 0, w, h)
      const f = tracker.fraction
      const boundary = f * w

      // Phrase A on right of boundary
      ctx.save()
      ctx.beginPath()
      ctx.rect(boundary, 0, w - boundary, h)
      ctx.clip()
      ctx.font = font
      ctx.fillStyle = COLOR.white
      ctx.textBaseline = 'middle'
      for (const c of layoutA.chars) ctx.fillText(c.char, c.homeX - c.width / 2, c.homeY)
      ctx.restore()

      // Phrase B on left of boundary
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, boundary, h)
      ctx.clip()
      ctx.font = font
      ctx.fillStyle = COLOR.white
      ctx.textBaseline = 'middle'
      for (const c of layoutB.chars) ctx.fillText(c.char, c.homeX - c.width / 2, c.homeY)
      ctx.restore()

      // Boundary bar
      ctx.fillStyle = COLOR.green
      ctx.shadowColor = COLOR.green
      ctx.shadowBlur = 14
      ctx.fillRect(boundary - 1.5, h * 0.15, 3, h * 0.7)
      ctx.shadowBlur = 0

      animFrames[9] = requestAnimationFrame(animate10)
    }
    animFrames[9] = requestAnimationFrame(animate10)
  }
})

onUnmounted(() => {
  for (const id of animFrames) if (id) cancelAnimationFrame(id)
  for (const fn of cleanups) fn()
})
</script>

<style scoped>
.experiment-page {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: #2f3cfc;
  color: #fff;
  font-family: 'Fraunces', serif;
}

.variation {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.variation canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.variation-label {
  position: absolute;
  top: 22px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Fraunces', serif;
  font-size: 11px;
  font-weight: 500;
  font-style: italic;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  z-index: 1;
  pointer-events: none;
}

.variation-label .num {
  color: #a4ff00;
  font-style: normal;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.variation-label .rule {
  width: 36px;
  height: 1px;
  background: #a4ff00;
}

.variation-label .title {
  color: rgba(255, 255, 255, 0.7);
}

.section-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}

.page-counter {
  position: fixed;
  right: 24px;
  bottom: 22px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.7);
  z-index: 5;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

.page-counter .slash {
  color: rgba(255, 255, 255, 0.35);
  margin: 0 2px;
}

.page-mark {
  position: fixed;
  left: 24px;
  bottom: 22px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  z-index: 5;
  pointer-events: none;
}
</style>
