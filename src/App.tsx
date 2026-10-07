import { ForkKnifeIcon, MapPinIcon, MopedIcon, PhoneIcon } from '@phosphor-icons/react'
import { MotionConfig } from 'motion/react'
import { useCallback, useState } from 'react'
import { Branches, Reserve } from './Branches'
import { delivery, dishes, footer, halls, hero, nav, story, telHref } from './content'
import Hero from './Hero'
import { branchPic, chef, dishPics } from './media'
import Menu from './Menu'
import { Pic, Reveal, Star, Unveil, Wordmark } from './ui'

export default function App() {
  const [overHero, setOverHero] = useState(true)
  const onHero = useCallback((v: boolean) => setOverHero(v), [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Негизги мазмунга өтүү</a>
      <Header solid={!overHero} />
      <main id="main">
        <Hero onVisibleChange={onHero} />
        <Dishes />
        <Menu />
        <Halls />
        <Branches />
        <Reserve />
        <Story />
        <Delivery />
      </main>
      <Footer />
      <nav className="tabbar" aria-label="Тез өтүү">
        <a href="#menu"><ForkKnifeIcon size={22} />Меню</a>
        <a href="#filialdar"><MapPinIcon size={22} />Филиалдар</a>
        <a href="#bron"><PhoneIcon size={22} />Брондоо</a>
      </nav>
    </MotionConfig>
  )
}

function Header({ solid }: { solid: boolean }) {
  return (
    <header className="header" data-solid={solid}>
      <div className="wrap header__inner">
        <a className="brand" href="#" aria-label="NAVAT Чайкана, башкы бет">
          <Star className="brand__star" />
          <Wordmark className="brand__word" />
          <span className="brand__sub">Чайкана</span>
        </a>
        <nav className="nav" aria-label="Негизги">
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
      </div>
    </header>
  )
}

function DishFigure({ id, wide }: { id: string; wide?: boolean }) {
  const d = dishes.items.find((x) => x.id === id)!
  return (
    <article className={`dish ${wide ? 'dish--wide' : 'dish--arch'}`}>
      <figure>
        <Unveil className="dish__img">
          <Pic pic={dishPics[id]} alt={d.name} sizes={wide ? '(min-width: 1360px) 1300px, 100vw' : '(min-width: 768px) 40vw, 100vw'} />
        </Unveil>
        <figcaption className="dish__cap">
          <h3>{d.name}</h3>
          <span className="price">{d.price}</span>
          <p>{d.text}</p>
          <span className="dish__meta">{d.meta}</span>
        </figcaption>
      </figure>
    </article>
  )
}

function Dishes() {
  return (
    <section className="section" aria-labelledby="dishes-title">
      <div className="wrap">
        <Reveal className="dishes__head">
          <h2 id="dishes-title">{dishes.title}</h2>
          <p className="lead">{dishes.lead}</p>
        </Reveal>
        <div className="dishes__grid">
          <DishFigure id="beshbarmak" wide />
          <div className="dishes__col dishes__col--l">
            <DishFigure id="plov" />
            <DishFigure id="kuurdak" />
          </div>
          <div className="dishes__col dishes__col--r">
            <DishFigure id="boz-uy" />
            <DishFigure id="samovar" />
          </div>
        </div>
      </div>
    </section>
  )
}

const hallStrip = [
  { slug: 'ul-baytik-baatyra-55', cap: 'Байтик Баатыр көч., 55' },
  { slug: 'ul-lenina-288', cap: 'Ош, Ленин көч., 288' },
  { slug: 'ul-fuchika-3', cap: 'Фучик көч., 3' },
]

function Halls() {
  return (
    <section id="zaldar" className="section" aria-labelledby="halls-title">
      <div className="wrap halls">
        <figure className="halls__main">
          <Unveil className="frame">
            <Pic pic={branchPic('ul-kievskaya-114-1')!} alt="Киев көчөсүндөгү NAVAT, VIP-бөлмө" sizes="(min-width: 900px) 55vw, 100vw" />
          </Unveil>
          <figcaption>Киев көч., 114/1</figcaption>
        </figure>
        <Reveal className="halls__text">
          <span className="eyebrow">{halls.eyebrow}</span>
          <h2 id="halls-title">{halls.title}</h2>
          <p>{halls.text}</p>
          <ul className="halls__names" aria-label="Бөлмөлөрдүн аттары">
            {halls.names.map((n) => <li key={n}>{n}</li>)}
          </ul>
          <a className="btn btn--ghost" href="#bron">{halls.cta}</a>
        </Reveal>
        <div className="halls__strip">
          {hallStrip.map((h) => (
            <figure key={h.slug}>
              <div className="frame"><Pic pic={branchPic(h.slug)!} alt="" sizes="(min-width: 900px) 33vw, 78vw" /></div>
              <figcaption>{h.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section id="biz" className="section" aria-labelledby="story-title">
      <div className="wrap story">
        <figure className="story__photo">
          <Unveil className="frame"><Pic pic={chef} alt={story.chef} sizes="(min-width: 900px) 40vw, 100vw" /></Unveil>
          <figcaption>{story.chef}</figcaption>
        </figure>
        <Reveal className="story__text">
          <span className="eyebrow">{story.eyebrow}</span>
          <h2 id="story-title">{story.title}</h2>
          <p>{story.text}</p>
          <dl className="facts">
            {story.facts.map((f) => (
              <div key={f.value}><dt>{f.value}</dt><dd>{f.label}</dd></div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

function Delivery() {
  return (
    <section className="delivery" aria-labelledby="delivery-title">
      <div className="wrap delivery__inner">
        <div>
          <h2 id="delivery-title">{delivery.title}</h2>
          <p>{delivery.text}</p>
        </div>
        <div className="delivery__act">
          <a className="phone" href={telHref(delivery.tel)}>{delivery.phone}</a>
          <a className="btn btn--primary" href={delivery.href} target="_blank" rel="noreferrer">
            <MopedIcon size={18} weight="bold" />{delivery.cta}
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <p className="footer__tag">{hero.title}</p>
          </div>
          <div>
            <h3>Байланыш</h3>
            <ul><li><a href={`mailto:${footer.email}`}>{footer.email}</a></li></ul>
          </div>
          <div>
            <h3>Instagram</h3>
            <ul>{footer.instagram.map((i) => <li key={i.href}><a href={i.href} target="_blank" rel="noreferrer">{i.label}</a></li>)}</ul>
          </div>
          <div>
            <h3>Тил</h3>
            <ul>
              {footer.langs.map((l) => (
                <li key={l.label}>{l.current ? <span aria-current="true">{l.label}</span> : <a href={l.href}>{l.label}</a>}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer__word"><Wordmark title="NAVAT" /></div>
        <div className="footer__base">
          <span>{footer.copy}</span>
          <span>Бишкек, Ош</span>
        </div>
      </div>
    </footer>
  )
}
