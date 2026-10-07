import { ArrowRightIcon, ArrowUpRightIcon, FastForwardIcon } from '@phosphor-icons/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { hero } from './content'
import { createDust } from './dust'
import { hallK4Tall, hallK4Wide, heroFirst } from './media'
import { STAR_RECTS } from './marks'
import { Pic } from './ui'

// Hero = сцена у входа (SPEC §6, пересмотрено):
// 1) арабесковые ворота: тёмная плита с гирихом, в арке живописный кадр «дышит» (idle.mp4: 1 с видео, растянутая на 30 с
//    со смешиванием кадров), поверх ветер и пыль;
// 2) первый жест вниз (колесо, свайп, клавиша) запускает видео целиком: проход сквозь арку, караван → двор → дверь → зал.
//    Обычное воспроизведение, не перемотка по скроллу: перемотку iOS Safari не тянул (кадр замирал), а играет видео плавно
//    везде. Пока оно идёт, страница стоит (html[data-intro]);
// 3) живописный зал проявляется в реальное фото, появляются заголовок и кнопки, скролл свободен.
// Reduced motion / Save-Data / медленная сеть: сразу финал (фото + заголовок), без видео.

// scrub-*.mp4: v3_omni_restyle, доведённый до 48 fps промежуточными кадрами (ffmpeg minterpolate, mci).
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

// Телефон в портрете видит лишь вертикальную полосу кадра:
// ему scrub-m720 = эта полоса (crop 540×900 из 1600×900 при x = 0.42·(1600−540), совпадает с object-position 42%),
// 432×720, ключ каждые 4 кадра, 1.7 МБ. Прочие сенсорные экраны: 960 px; десктоп: 1600 px.
// ponytail: файл выбирается один раз; повернул телефон после загрузки — портретная полоса растянется на ландшафт.
function scrubSrc() {
  if (innerWidth < 700 && innerHeight > innerWidth) return '/hero/scrub-m720.mp4'
  if (matchMedia('(pointer: coarse)').matches || innerWidth * devicePixelRatio <= 1100) return '/hero/scrub-960.mp4'
  return '/hero/scrub-1600.mp4'
}

export default function Hero({ onVisibleChange }: { onVisibleChange: (visible: boolean) => void }) {
  const section = useRef<HTMLElement>(null)
  const idleVid = useRef<HTMLVideoElement>(null)
  const scrubVid = useRef<HTMLVideoElement>(null)
  const dustCanvas = useRef<HTMLCanvasElement>(null)
  const [scrub] = useState(scrubAllowed)
  const [gate, setGate] = useState<Gate>()
  const [done, setDone] = useState(!scrub)
  // idle: ждём жеста; play: идёт видео; end: финал. В ref, чтобы resize (новый gate) не сбрасывал сцену.
  const phase = useRef<'idle' | 'play' | 'end'>('idle')
  const endAt = useRef(0)
  const finish = useRef(() => {})

  useEffect(() => {
    if (!scrub) return
    const root = document.documentElement
    const v = scrubVid.current!
    v.src = scrubSrc()
    const end = () => {
      if (phase.current === 'end') return
      phase.current = 'end'
      endAt.current = performance.now()
      v.pause()
      delete root.dataset.intro
    }
    finish.current = end
    const start = () => {
      if (phase.current !== 'idle') return
      phase.current = 'play'
      const idleV = idleVid.current!
      v.currentTime = Math.min(IDLE_FRAMES, (idleV.currentTime * FPS) / IDLE_STRETCH) / FPS // с того же кадра, что дышал
      v.play().catch(end) // iPhone в энергосбережении не играет без тапа: сразу финал
    }
    // Зашли не сверху (якорь, восстановление позиции) или ссылка шапки увела со сцены: сразу финал.
    const hash = location.hash.slice(1)
    if (scrollY > 10 || hash) {
      end()
      if (hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash))?.scrollIntoView())
    } else root.dataset.intro = ''
    const away = () => { if (scrollY > 10) end() }
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) start() }
    let y0 = 0
    const onTouchStart = (e: TouchEvent) => { y0 = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => { if (y0 - e.touches[0].clientY > 24) start() }
    const onKey = (e: KeyboardEvent) => { if (e.target === document.body && ['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) start() }
    v.addEventListener('ended', end)
    addEventListener('scroll', away, { passive: true })
    addEventListener('wheel', onWheel, { passive: true })
    addEventListener('touchstart', onTouchStart, { passive: true })
    addEventListener('touchmove', onTouchMove, { passive: true })
    addEventListener('keydown', onKey)
    return () => {
      v.removeEventListener('ended', end)
      removeEventListener('scroll', away)
      removeEventListener('wheel', onWheel)
      removeEventListener('touchstart', onTouchStart)
      removeEventListener('touchmove', onTouchMove)
      removeEventListener('keydown', onKey)
      delete root.dataset.intro
    }
  }, [scrub])

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
    let sp = -1 // сглаженный прогресс
    let showIdle = true
    let playing = false // scrub реально пошёл: дальше idle не нужен
    const onPlaying = () => { playing = true }
    scrubV.addEventListener('playing', onPlaying)
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
      // прогресс сцены: видео ведёт 0.03..0.84, после конца 1.4 с на проявление зала и финал
      const ph = phase.current
      const p = ph === 'play' ? 0.03 + 0.81 * clamp(scrubV.currentTime / (scrubV.duration || 8))
        : ph === 'end' ? Math.min(1, 0.84 + (0.16 * (now - endAt.current)) / 1400) : 0
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

      // В покое играет idle.mp4 и лежит поверх, пока scrub не пошёл (так нет скачка кадра назад).
      if (ph === 'idle' && idleV.readyState >= 2 && idleV.paused) idleV.play().catch(() => {})
      else if (ph !== 'idle' && !idleV.paused) idleV.pause()
      const idleNow = idleV.readyState >= 2 && (ph === 'idle' || !playing)
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
      scrubV.removeEventListener('playing', onPlaying)
    }
  }, [scrub, gate])

  return (
    <section ref={section} className="hero" data-mode={scrub ? 'scrub' : 'still'} aria-labelledby="hero-title">
      <div className="hero__stage">
        {scrub && (
          <div className="hero__film" aria-hidden="true" style={gate && { transformOrigin: `${gate.cx}px ${gate.oy}px` }}>
            <Pic pic={heroFirst} alt="" sizes="100vw" eager />
            <video ref={scrubVid} muted playsInline preload="auto" />
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

        <div className="wrap hero__final" data-on={done} onFocus={() => !done && finish.current()}>
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
          <button type="button" className="icon-btn hero__skip" onClick={() => finish.current()}>
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
      {/* pathLength=1: контуры прорисовываются от пят к замку; точки (пунктир) открывает маска с тем же рисованием */}
      <path d={archPath(g.cx, g.bottom, g.w, g.h, 10)} pathLength={1} className="gate__line gate__draw" />
      <mask id="gate-load" maskUnits="userSpaceOnUse">
        <path d={archPath(g.cx, g.bottom, g.w, g.h, 24)} pathLength={1} className="gate__load" />
      </mask>
      <path d={archPath(g.cx, g.bottom, g.w, g.h, 24)} className="gate__line gate__line--dots" mask="url(#gate-load)" />
      <path d={archPath(g.cx, g.bottom, g.w, g.h, 38)} pathLength={1} className="gate__line gate__line--thin gate__draw" />
      <line x1={g.cx - g.w / 2 - 70} x2={g.cx + g.w / 2 + 70} y1={g.bottom + 0.5} y2={g.bottom + 0.5} className="gate__line gate__line--thin" />
      <g transform={`translate(${g.cx - 14} ${keyY - 14}) scale(${28 / 55})`} className="gate__key">
        {STAR_RECTS.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} transform={r.transform} />)}
      </g>
    </svg>
  )
}
