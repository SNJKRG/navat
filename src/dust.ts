// Ветер и пыль поверх живописи hero: частицы на canvas 2D, без зависимостей.
// step(dt, t, k): k 0..1 гасит всё (во дворе пыль есть, в зале её нет).

type Mote = { x: number; y: number; r: number; a: number; z: number; ph: number }
type Streak = { x: number; y: number; len: number; v: number; a: number; bend: number; g: CanvasGradient }
type Haze = { x: number; y: number; r: number; a: number; z: number }

const rnd = (a: number, b: number) => a + Math.random() * (b - a)

// Мягкая тёплая точка, рисуем её масштабированной вместо arc+blur для каждой частицы.
function sprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgb(246 226 192 / 1)')
  grad.addColorStop(0.35, 'rgb(236 208 168 / .55)')
  grad.addColorStop(1, 'rgb(226 196 152 / 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

export function createDust(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  const dot = sprite()
  let w = 0, h = 0, dpr = 1
  let motes: Mote[] = []
  let haze: Haze[] = []
  const streaks: Streak[] = []
  let nextStreak = 0

  // Больше пыли у земли: y смещён к низу кадра.
  const groundY = () => h * (1 - 0.78 * Math.pow(Math.random(), 1.6))

  function resize() {
    dpr = 1 // мягкие точки не нуждаются в ретине: в 2–4 раза меньше пикселей
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    const n = Math.max(60, Math.min(150, Math.round((w * h) / 10000)))
    motes = Array.from({ length: n }, () => {
      const bokeh = Math.random() < 0.09
      const z = bokeh ? rnd(1.4, 2.2) : rnd(0.35, 1.2)
      return {
        x: rnd(0, w), y: groundY(), z, ph: rnd(0, 6.3),
        r: bokeh ? rnd(5, 12) : rnd(0.7, 2.4) * z,
        a: bokeh ? rnd(0.06, 0.13) : rnd(0.18, 0.62),
      }
    })
    haze = Array.from({ length: 6 }, () => ({
      x: rnd(0, w), y: h * rnd(0.72, 1.02), r: w * rnd(0.22, 0.42), a: rnd(0.05, 0.1), z: rnd(0.2, 0.45),
    }))
  }

  function step(dt: number, t: number, k: number) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    if (k <= 0.01) return

    // Порывы: ветер слева направо, сила плавает.
    const gust = 0.55 + 0.35 * Math.sin(t * 0.31) + 0.2 * Math.sin(t * 1.17 + 1.3)
    const wind = 14 + 46 * gust

    for (const z of haze) {
      z.x += wind * z.z * dt
      if (z.x - z.r > w) z.x = -z.r
      ctx.globalAlpha = z.a * k * (0.7 + 0.3 * gust)
      ctx.drawImage(dot, z.x - z.r, z.y - z.r * 0.45, z.r * 2, z.r * 0.9)
    }

    for (const m of motes) {
      m.x += (wind * m.z + Math.sin(t * 0.9 + m.ph) * 7) * dt
      m.y += (Math.sin(t * 0.7 + m.ph * 2) * 9 - 3 * m.z * gust) * dt
      if (m.x - m.r > w) { m.x = -m.r; m.y = groundY() }
      if (m.y < -m.r) m.y = h + m.r
      // мерцание: пылинка ловит солнце
      ctx.globalAlpha = m.a * k * (0.75 + 0.25 * Math.sin(t * 2.3 + m.ph * 3))
      ctx.drawImage(dot, m.x - m.r, m.y - m.r, m.r * 2, m.r * 2)
    }

    // Штрихи ветра: редкие, быстрые, на сильных порывах.
    if (t > nextStreak) {
      const len = rnd(140, 360)
      const g = ctx.createLinearGradient(-len, 0, 0, 0) // в локальных координатах штриха: создаётся один раз
      g.addColorStop(0, 'rgb(246 230 204 / 0)')
      g.addColorStop(0.7, 'rgb(246 230 204 / 1)')
      g.addColorStop(1, 'rgb(246 230 204 / 0)')
      streaks.push({ x: -rnd(80, 300), y: h * rnd(0.35, 0.95), len, v: rnd(320, 520), a: rnd(0.08, 0.16), bend: rnd(-14, 14), g })
      nextStreak = t + rnd(0.35, 1.1) / Math.max(gust, 0.3)
    }
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    for (let i = streaks.length - 1; i >= 0; i--) {
      const s = streaks[i]
      s.x += s.v * dt
      if (s.x - s.len > w) { streaks.splice(i, 1); continue }
      ctx.setTransform(dpr, 0, 0, dpr, s.x * dpr, s.y * dpr)
      ctx.strokeStyle = s.g
      ctx.globalAlpha = s.a * k
      ctx.beginPath()
      ctx.moveTo(-s.len, 0)
      ctx.quadraticCurveTo(-s.len / 2, s.bend, 0, Math.sin(s.x * 0.01) * 3)
      ctx.stroke()
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalAlpha = 1
  }

  return { resize, step }
}
