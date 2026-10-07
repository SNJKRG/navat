import { ArrowRightIcon, ArrowUpRightIcon, FastForwardIcon } from '@phosphor-icons/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { hero } from './content'
import { createDust } from './dust'
import { hallK4Tall, hallK4Wide, heroFirst } from './media'
import { STAR_RECTS } from './marks'
import { Pic } from './ui'

// Hero = прокручиваемая сцена (SPEC §6, пересмотрено):
// 1) арабесковые ворота: тёмная плита с гирихом, в арке живописный кадр «дышит» (idle.mp4: 1 с видео, растянутая на 30 с
//    со смешиванием кадров), поверх ветер и пыль;
// 2) скролл проводит сквозь арку и ведёт видео по currentTime: караван → двор → дверь → зал.
//    scrub-*.mp4 закодированы с ключевым кадром каждые 1–4 кадра: перемотка декодируется аппаратно, вне главного потока,
//    память ~ один кадр (секвенция WebP на canvas декодировалась заново на каждом шаге: 3+ с на главном потоке за проход);
// 3) живописный зал проявляется в реальное фото, появляются заголовок и кнопки, дальше обычный сайт.
// Reduced motion / Save-Data / медленная сеть: сразу финал (фото + заголовок), без кадров.

// scrub-*.mp4: v3_omni_restyle, доведённый до 48 fps промежуточными кадрами (ffmpeg minterpolate, mci):
// на 24 fps картинка при скролле шла ступеньками (кадр на ~17 px), на 48 — вдвое мельче.
const N = 381
const FPS = 48
const IDLE_FRAMES = 48 // idle.mp4 = первая секунда (48 кадров при 48 fps), растянутая в 30 раз
const IDLE_STRETCH = 30

type NetInfo = { saveData?: boolean; effectiveType?: string }

function scrubAllowed() {
  const net = (navigator as Navigator & { connection?: NetInfo }).connection
  return (
    !matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !net?.saveData &&
    !['slow-2g', '2g', '3g'].includes(net?.effectiveType ?? '')
  )
}

const clamp = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t) }

// Стрельчатая арка: дуги касаются косяков на линии пяты, подъём 0.742·W.
function archPath(cx: number, bottom: number, w: number, h: number, grow = 0) {
  const W = w + grow * 2
  const r = 0.8 * W
  const top = bottom - h - grow
  const spring = top + Math.sqrt(r * r - (W / 2 - r) ** 2)
  return `M${cx - W / 2} ${bottom}V${spring}A${r} ${r} 0 0 1 ${cx} ${top}A${r} ${r} 0 0 1 ${cx + W / 2} ${spring}V${bottom}`
}

function gateGeometry(vw: number, vh: number) {
  const mobile = vw < 700
  const h = vh * (mobile ? 0.54 : 0.7)
  const w = Math.min(h * 0.62, vw * (mobile ? 0.74 : 0.4))
  const bottom = vh * (mobile ? 0.72 : 0.9) // мобильный: под аркой место для двух строк слогана
  const top = bottom - h
  const oy = bottom - h * 0.38 // точка, к которой «летим»
  // минимальный масштаб картины, при котором она ещё закрывает проём арки
  const z0 = Math.max((oy - top) / oy, (bottom - oy) / (vh - oy), w / vw) * 1.02
  return { vw, vh, w, h, bottom, cx: vw / 2, top, oy, z0 }
}
type Gate = ReturnType<typeof gateGeometry>

// Перемотка тяжелее на мобильных декодерах: там 960 px и ключ каждый кадр, на десктопе 1600 px и ключ каждые 4.
const scrubSrc = () => (window.innerWidth * devicePixelRatio > 1100 ? '/hero/scrub-1600.mp4' : '/hero/scrub-960.mp4')

export default function Hero({ onVisibleChange }: { onVisibleChange: (visible: boolean) => void }) {
  const section = useRef<HTMLElement>(null)
  const idleVid = useRef<HTMLVideoElement>(null)
  const scrubVid = useRef<HTMLVideoElement>(null)
  const dustCanvas = useRef<HTMLCanvasElement>(null)
  const [scrub] = useState(scrubAllowed)
  const [gate, setGate] = useState<Gate>()
  const [done, setDone] = useState(!scrub)

  // Шапка: прозрачная над hero, сплошная после него.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => onVisibleChange(e.isIntersecting), { rootMargin: '-68px 0px 0px 0px' })
    io.observe(section.current!)
    return () => io.disconnect()
  }, [onVisibleChange])

  useLayoutEffect(() => {
    if (!scrub) return
    const measure = () => setGate(gateGeometry(window.innerWidth, window.innerHeight))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [scrub])

  useEffect(() => {
    if (!scrub || !gate) return
    const sec = section.current!
    const idleV = idleVid.current!
    const scrubV = scrubVid.current!
    const dust = createDust(dustCanvas.current!)
    dust.resize()
    // iOS не показывает кадры после currentTime, пока видео ни разу не играло: «пинаем» play/pause.
    scrubV.addEventListener('loadeddata', () => scrubV.play().then(() => scrubV.pause(), () => {}), { once: true })

    let sp = -1 // сглаженный прогресс
    let idleF = 0
    let showIdle = true
    const vars: Record<string, string> = {}
    const set = (k: string, x: number) => {
      const val = x.toFixed(4)
      if (vars[k] !== val) { vars[k] = val; sec.style.setProperty(k, val) }
    }
    let last = performance.now()
    let raf = 0
    let visible = true
    let wasDone = false
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(sec)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) return
      const r = sec.getBoundingClientRect()
      const p = clamp(-r.top / (r.height - gate.vh))
      sp = sp < 0 ? p : sp + (p - sp) * (1 - Math.exp(-dt * 9))

      const g = clamp(sp / 0.14) // проход сквозь арку
      const v = clamp((sp - 0.03) / 0.81) // видео
      const photo = smooth((sp - 0.86) / 0.06)
      const fin = smooth((sp - 0.9) / 0.07)
      const gs = 1 + 7.5 * g ** 2.4
      set('--gate-s', gs)
      set('--gate-o', 1 - smooth((g - 0.45) / 0.5))
      set('--ui-o', 1 - smooth(g / 0.25))
      set('--zoom', Math.min(1, gate.z0 * Math.sqrt(gs))) // картина «дальше» плиты: параллакс
      set('--photo', photo)
      set('--final', fin)
      const isDone = fin > 0.5
      if (isDone !== wasDone) { wasDone = isDone; setDone(isDone) }

      // В покое играет idle.mp4. Scrub-видео всё время держим на нужном кадре (и в покое тоже),
      // а idle прячем, только когда scrub уже там: иначе в начале скролла кадр прыгал назад.
      const resting = v < 0.002
      if (resting && idleV.readyState >= 2) {
        if (idleV.paused) idleV.play().catch(() => {})
        idleF = Math.min(IDLE_FRAMES, (idleV.currentTime * FPS) / IDLE_STRETCH)
      } else if (!resting && !idleV.paused) idleV.pause()
      const want = Math.min((idleF + v * (N - 1 - idleF) + 0.5) / FPS, (scrubV.duration || 1e9) - 0.01)
      const off = Math.abs(scrubV.currentTime - want)
      if (scrubV.readyState >= 1 && !scrubV.seeking && off > 0.5 / FPS) scrubV.currentTime = want
      const synced = scrubV.readyState >= 2 && !scrubV.seeking && off < 1.5 / FPS
      const idleNow = idleV.readyState >= 2 && (resting || !synced)
      if (idleNow !== showIdle) {
        showIdle = idleNow
        idleV.dataset.on = String(idleNow)
      }

      dust.step(dt, now / 1000, 1 - smooth((v - 0.6) / 0.16))
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [scrub, gate])

  // Клавиатура: фокус на скрытой кнопке финала → докручиваем до финала.
  const toEnd = (smoothScroll: boolean) => {
    const sec = section.current!
    window.scrollTo({ top: sec.offsetTop + sec.offsetHeight - window.innerHeight, behavior: smoothScroll ? 'smooth' : 'auto' })
  }

  return (
    <section ref={section} className="hero" data-mode={scrub ? 'scrub' : 'still'} aria-labelledby="hero-title">
      <div className="hero__stage">
        {scrub && (
          <div className="hero__film" aria-hidden="true" style={gate && { transformOrigin: `${gate.cx}px ${gate.oy}px` }}>
            <Pic pic={heroFirst} alt="" sizes="100vw" eager />
            <video ref={scrubVid} src={scrubSrc()} muted playsInline preload="auto" />
            <video ref={idleVid} src="/hero/idle.mp4" muted playsInline autoPlay preload="auto" data-on="true" />
          </div>
        )}

        <div className="hero__photo">
          <picture>
            <source media="(max-aspect-ratio: 4/5)" type="image/avif" srcSet={hallK4Tall.sources.avif} sizes="100vw" />
            <source media="(max-aspect-ratio: 4/5)" type="image/webp" srcSet={hallK4Tall.sources.webp} sizes="100vw" />
            <source type="image/avif" srcSet={hallK4Wide.sources.avif} sizes="100vw" />
            <source type="image/webp" srcSet={hallK4Wide.sources.webp} sizes="100vw" />
            <img src={hallK4Wide.img.src} alt="NAVAT чайканасынын залы, Курманжан Датка көчөсү, 242" loading="lazy" decoding="async" />
          </picture>
        </div>

        {scrub && gate && <GateFrame g={gate} />}

        {scrub && <canvas ref={dustCanvas} className="hero__dust" aria-hidden="true" />}

        {scrub && gate && (
          <div className="gate__ui" aria-hidden="true" style={{ '--aw': `${gate.w}px`, '--amid': `${gate.bottom - gate.h * 0.45}px`, '--abot': `${gate.bottom}px` } as React.CSSProperties}>
            <Slogans />
          </div>
        )}

        <div className="wrap hero__final" data-on={done} onFocus={() => !done && toEnd(false)}>
          <h1 id="hero-title" className="hero__title">
            {hero.titleLines.map((line, i) => (
              <span key={i} className="hero__line" style={{ '--i': i } as React.CSSProperties}>
                <span>{i === 1 ? <em>{line}</em> : line}</span>{' '}
              </span>
            ))}
          </h1>
          <div className="hero__meta">
            <p className="hero__sub"><span className="hero__eyebrow">{hero.eyebrow}</span>{hero.sub}</p>
            <a className="hero__caption" href="#filialdar">
              <small>{hero.captionLabel}</small>
              <span>{hero.caption} <ArrowUpRightIcon size={13} /></span>
            </a>
            <a className="hero__cta" href="#menu">
              {hero.menuCta}
              <span className="hero__cta-dot"><ArrowRightIcon size={18} /></span>
            </a>
          </div>
        </div>

        {scrub && !done && (
          <button type="button" className="icon-btn hero__skip" onClick={() => toEnd(true)}>
            <FastForwardIcon size={16} weight="bold" />
            {hero.skip}
          </button>
        )}
      </div>
    </section>
  )
}

// Фразы по сторонам арки «пишутся» пером строка за строкой (CSS-маска), держатся и сменяются следующей парой.
function Slogans() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % hero.slogans.length), 7000)
    return () => clearInterval(t)
  }, [])
  const s = hero.slogans[i]
  return (
    <div className="slogan" key={i}>
      {(['left', 'right'] as const).map((side, k) => (
        <p key={side} className={`slogan__side slogan__side--${side}`}>
          {s[side].map((line, j) => (
            <span key={j} style={{ '--d': `${(k * 2 + j) * 0.45}s` } as React.CSSProperties}>{line}</span>
          ))}
        </p>
      ))}
    </div>
  )
}

// Плита ворот: NAVAT Green, гирих из 8-конечных звёзд (хатам), стрельчатая арка, бордюр и звезда-замок.
function GateFrame({ g }: { g: Gate }) {
  const s = g.vw < 700 ? 64 : 92 // шаг гириха
  const R = s * 0.36
  const star = (cx: number, cy: number) => {
    const pts = Array.from({ length: 16 }, (_, k) => {
      const a = (k * Math.PI) / 8 - Math.PI / 2
      const r = k % 2 ? R * 0.7654 : R
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
    })
    return pts.join(' ')
  }
  const tips = Array.from({ length: 8 }, (_, k) => {
    const a = (k * Math.PI) / 4 - Math.PI / 2
    return [Math.cos(a), Math.sin(a)]
  })
  const arch = archPath(g.cx, g.bottom, g.w, g.h)
  const keyY = g.top - 58

  return (
    <svg
      className="gate"
      width={g.vw}
      height={g.vh}
      viewBox={`0 0 ${g.vw} ${g.vh}`}
      aria-hidden="true"
      style={{ transformOrigin: `${g.cx}px ${g.oy}px` }}
    >
      <defs>
        <pattern id="girih" width={s} height={s} patternUnits="userSpaceOnUse" x={g.cx - s / 2} y={g.top - s / 2}>
          {[[s / 2, s / 2], [0, 0], [s, 0], [0, s], [s, s]].map(([x, y], i) => (
            <polygon key={i} points={star(x, y)} />
          ))}
          {/* лучи между звёздами: сетка становится непрерывным узором */}
          {tips.map(([dx, dy], i) => (
            <line key={i} x1={s / 2 + dx * R} y1={s / 2 + dy * R} x2={s / 2 + dx * s * 0.5} y2={s / 2 + dy * s * 0.5} />
          ))}
          <circle cx={s / 2} cy={s / 2} r={1.6} className="gate__seed" />
        </pattern>
        <radialGradient id="gate-glow" gradientUnits="userSpaceOnUse" cx={g.cx} cy={g.bottom - g.h * 0.45} r={Math.max(g.vw, g.vh) * 0.62}>
          <stop offset="0" stopColor="#e2a04a" stopOpacity=".22" />
          <stop offset=".45" stopColor="#e2a04a" stopOpacity=".05" />
          <stop offset="1" stopColor="#e2a04a" stopOpacity="0" />
        </radialGradient>
        <mask id="gate-hole">
          <rect width={g.vw} height={g.vh} fill="#fff" />
          <path d={arch + 'Z'} fill="#000" />
        </mask>
        <mask id="gate-clear">
          <rect width={g.vw} height={g.vh} fill="#fff" />
          <path d={archPath(g.cx, g.bottom + 40, g.w, g.h + 40, 52) + 'Z'} fill="#000" />
        </mask>
      </defs>
      <g mask="url(#gate-hole)">
        <rect className="gate__plate" width={g.vw} height={g.vh} />
        <rect fill="url(#girih)" className="gate__girih" width={g.vw} height={g.vh} mask="url(#gate-clear)" />
        <rect fill="url(#gate-glow)" width={g.vw} height={g.vh} />
      </g>
      <path d={archPath(g.cx, g.bottom, g.w, g.h, 10)} className="gate__line" />
      <path d={archPath(g.cx, g.bottom, g.w, g.h, 24)} className="gate__line gate__line--dots" />
      <path d={archPath(g.cx, g.bottom, g.w, g.h, 38)} className="gate__line gate__line--thin" />
      <line x1={g.cx - g.w / 2 - 70} x2={g.cx + g.w / 2 + 70} y1={g.bottom + 0.5} y2={g.bottom + 0.5} className="gate__line gate__line--thin" />
      <g transform={`translate(${g.cx - 14} ${keyY - 14}) scale(${28 / 55})`} className="gate__key">
        {STAR_RECTS.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} transform={r.transform} />)}
      </g>
    </svg>
  )
}
