import { CheckIcon, CopyIcon, ForkKnifeIcon, MapPinIcon, MopedIcon, PhoneIcon } from '@phosphor-icons/react'
import { MotionConfig } from 'motion/react'
import { useCallback, useState } from 'react'
import { delivery, dishes, footer, hero, nav, place, room, story, telHref, visit } from './content'
import Hero from './Hero'
import { chef, dishPics, roomFacade, roomHall, roomSofas, roomTeddy, roomTerrace } from './media'
import Menu from './Menu'
import { Pic, Reveal, Star, Unveil, Wordmark } from './ui'

export default function App() {
  const [overHero, setOverHero] = useState(true)
  const onHero = useCallback((v: boolean) => setOverHero(v), [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header solid={!overHero} />
      <main id="main">
        <Hero onVisibleChange={onHero} />
        <Dishes />
        <Menu />
        <Room />
        <Visit />
        <Story />
        <Delivery />
      </main>
      <Footer />
      <nav className="tabbar" aria-label="Quick links">
        <a href="#menu"><ForkKnifeIcon size={22} />Menu</a>
        <a href="#visit"><MapPinIcon size={22} />Visit</a>
        <a href={telHref(place.phone)}><PhoneIcon size={22} />Call</a>
      </nav>
    </MotionConfig>
  )
}

function Header({ solid }: { solid: boolean }) {
  return (
    <header className="header" data-solid={solid}>
      <div className="wrap header__inner">
        <a className="brand" href="#" aria-label="NAVAT Dubai, home">
          <Star className="brand__star" />
          <Wordmark className="brand__word" />
          <span className="brand__sub">Dubai</span>
        </a>
        <nav className="nav" aria-label="Main">
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
            <DishFigure id="mezze" />
            <DishFigure id="desserts" />
          </div>
        </div>
      </div>
    </section>
  )
}

const roomStrip = [
  { pic: roomTerrace, cap: 'The terrace' },
  { pic: roomHall, cap: 'The hall' },
  { pic: roomSofas, cap: 'Sofa seating' },
]

function Room() {
  return (
    <section id="room" className="section" aria-labelledby="room-title">
      <div className="wrap halls">
        <figure className="halls__main">
          <Unveil className="frame">
            <Pic pic={roomTeddy} alt="NAVAT Dubai dining room with a giant red teddy bear on the sofa" sizes="(min-width: 900px) 55vw, 100vw" />
          </Unveil>
          <figcaption>NAVAT Dubai</figcaption>
        </figure>
        <Reveal className="halls__text">
          <span className="eyebrow">{room.eyebrow}</span>
          <h2 id="room-title">{room.title}</h2>
          <p>{room.text}</p>
          <ul className="halls__names">
            {room.features.map((n) => <li key={n}>{n}</li>)}
          </ul>
          <a className="btn btn--ghost" href="#visit">{room.cta}</a>
        </Reveal>
        <div className="halls__strip">
          {roomStrip.map((h) => (
            <figure key={h.cap}>
              <div className="frame"><Pic pic={h.pic} alt="" sizes="(min-width: 900px) 33vw, 78vw" /></div>
              <figcaption>{h.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Visit() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(place.phone)
      setCopied(true)
    } catch { /* no clipboard access: the number stays visible as text */ }
  }

  return (
    <section id="visit" className="section section--tint" aria-labelledby="visit-title">
      <div className="wrap reserve">
        <Reveal className="reserve__intro">
          <h2 id="visit-title">{visit.title}</h2>
          <p>{visit.text}</p>
          <figure className="visit__photo">
            <div className="frame"><Pic pic={roomFacade} alt="NAVAT Dubai storefront and terrace on the Boulevard" sizes="(min-width: 900px) 34rem, 100vw" /></div>
          </figure>
        </Reveal>

        <div className="ticket">
          <span className="ticket__city">{place.name}, {place.area}</span>
          <h3>{place.address}</h3>
          <div className="ticket__row"><span>{visit.hours}</span><span>{place.hours}</span></div>
          <div className="ticket__row"><span>{visit.breakfast}</span><span>{place.breakfast}</span></div>
          <a className="ticket__phone" href={telHref(place.phone)}>{place.phone}</a>
          <div className="ticket__actions">
            <a className="btn btn--primary" href={telHref(place.phone)}><PhoneIcon size={18} weight="bold" />{visit.call}</a>
            <a className="btn btn--ghost" href={place.map} target="_blank" rel="noreferrer"><MapPinIcon size={18} />{visit.route}</a>
            <button type="button" className="btn btn--ghost" onClick={copy}>
              {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
              {copied ? visit.copied : visit.copy}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section id="about" className="section" aria-labelledby="story-title">
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
            <p className="footer__tag">{hero.titleLines.join(' ')}</p>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li><a href={telHref(place.phone)}>{place.phone}</a></li>
              <li><a href={place.map} target="_blank" rel="noreferrer">{place.address}</a></li>
            </ul>
          </div>
          <div>
            <h3>Follow</h3>
            <ul>
              <li><a href={place.instagram.href} target="_blank" rel="noreferrer">Instagram {place.instagram.label}</a></li>
              <li><a href={place.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
            </ul>
          </div>
          <div>
            <h3>NAVAT</h3>
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
          <span>Downtown Dubai, UAE</span>
        </div>
      </div>
    </footer>
  )
}
