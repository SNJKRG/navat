import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { STAR_RECTS, STAR_VIEWBOX, WORDMARK_PATHS, WORDMARK_VIEWBOX } from './marks'

export type Picture = { sources: Record<string, string>; img: { src: string; w: number; h: number } }

export function Pic({ pic, alt, sizes, eager }: { pic: Picture; alt: string; sizes: string; eager?: boolean }) {
  const { jpeg, jpg, ...modern } = pic.sources
  return (
    <picture>
      {Object.entries(modern).map(([fmt, srcSet]) => (
        <source key={fmt} type={`image/${fmt}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={pic.img.src}
        srcSet={jpeg ?? jpg}
        sizes={sizes}
        width={pic.img.w}
        height={pic.img.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}

export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox={STAR_VIEWBOX} className={className} aria-hidden="true" fill="currentColor">
      {STAR_RECTS.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} transform={r.transform} />
      ))}
    </svg>
  )
}

export function Wordmark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox={WORDMARK_VIEWBOX} className={className} fill="currentColor" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

// Editorial reveal (spec: 300-450 ms, смещение ≤12 px). Под reduced motion MotionConfig отключает движение.
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Маскированное раскрытие фото снизу вверх (motion level 2 из брифа).
export function Unveil({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(18% 0 0 0)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
