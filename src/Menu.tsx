import { FilePdfIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { menu } from './content'
import { Reveal } from './ui'

export default function Menu() {
  const [active, setActive] = useState(menu.categories[0].id)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace('menu-', ''))),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    menu.categories.forEach((c) => io.observe(document.getElementById(`menu-${c.id}`)!))
    return () => io.disconnect()
  }, [])

  return (
    <section id="menu" className="section section--tint" aria-labelledby="menu-title">
      <div className="wrap">
        <Reveal className="menu__head">
          <div>
            <h2 id="menu-title">{menu.title}</h2>
            <p className="lead">{menu.lead}</p>
          </div>
          <a className="link" href={menu.pdf} target="_blank" rel="noreferrer">
            <FilePdfIcon size={18} />
            {menu.pdfLabel}
          </a>
        </Reveal>

        <div className="menu">
          <nav className="menu__nav" aria-label="Менюнун бөлүмдөрү">
            {menu.categories.map((c) => (
              <a key={c.id} href={`#menu-${c.id}`} aria-current={active === c.id}>
                {c.title}
              </a>
            ))}
          </nav>

          <div>
            {menu.categories.map((c) => (
              <section key={c.id} id={`menu-${c.id}`} className="menu__cat" aria-labelledby={`menu-${c.id}-t`}>
                <h3 id={`menu-${c.id}-t`}>{c.title}</h3>
                <ul className="menu__items">
                  {c.items.map((it) => (
                    <li key={it.name} className="menu__item">
                      <div className="menu__row">
                        <span className="menu__name">{it.name}</span>
                        <span className="menu__dots" aria-hidden="true" />
                        <span className="price">{it.price}<span className="sr-only"> сом</span></span>
                      </div>
                      <div className="menu__sub">
                        <span>{it.text}</span>
                        <span>{it.meta}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
