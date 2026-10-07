import { BabyIcon, CheckIcon, CopyIcon, CrownIcon, MagnifyingGlassIcon, MapPinIcon, PhoneIcon, SunIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { branches, branchUi, reserve, routeHref, telHref, type Branch } from './content'
import { branchPic } from './media'
import { Pic, Reveal, Star } from './ui'

const cities = ['Бишкек', 'Ош'] as const

export function Branches() {
  const [city, setCity] = useState<(typeof cities)[number]>('Бишкек')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return branches.filter((b) => b.city === city && (!needle || b.address.toLowerCase().includes(needle)))
  }, [city, q])

  return (
    <section id="filialdar" className="section" aria-labelledby="branches-title">
      <div className="wrap">
        <Reveal className="branches__top">
          <div>
            <h2 id="branches-title">{branchUi.title}</h2>
            <div className="tabs" role="group" aria-label="Шаар" style={{ marginTop: '1.5rem' }}>
              {cities.map((c) => (
                <button key={c} type="button" aria-pressed={city === c} onClick={() => setCity(c)}>
                  {c}
                  <small>{branches.filter((b) => b.city === c).length}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="search">
            <label htmlFor="branch-q">{branchUi.searchLabel}</label>
            <div className="search__field">
              <MagnifyingGlassIcon size={18} />
              <input id="branch-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={branchUi.searchPlaceholder} autoComplete="off" />
            </div>
          </div>
        </Reveal>

        <ul className="branch-list" aria-live="polite">
          {list.map((b) => <BranchRow key={b.id} b={b} />)}
          {list.length === 0 && (
            <li className="empty">
              {branchUi.empty}
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setQ('')}>{branchUi.clear}</button>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}

function BranchRow({ b }: { b: Branch }) {
  const pic = branchPic(b.photo)
  return (
    <li className="branch">
      <div className="branch__thumb">
        {pic ? <Pic pic={pic} alt="" sizes="120px" /> : <Star />}
      </div>
      <div>
        <h3>{b.address}</h3>
        <p className="branch__hours">{b.hours}</p>
        {(b.terrace || b.kids || b.vip) && (
          <ul className="branch__feats">
            {b.terrace && <li><SunIcon size={15} />{branchUi.terrace}</li>}
            {b.kids && <li><BabyIcon size={15} />{branchUi.kids}</li>}
            {b.vip && <li><CrownIcon size={15} />{branchUi.vip}</li>}
          </ul>
        )}
        <div className="branch__actions">
          <a className="btn btn--ghost btn--small" href={telHref(b.phone)} aria-label={`${branchUi.call}: ${b.address}, ${b.phone}`}>
            <PhoneIcon size={16} />{branchUi.call}
          </a>
          <a className="btn btn--ghost btn--small" href={routeHref(b)} target="_blank" rel="noreferrer">
            <MapPinIcon size={16} />{branchUi.route}
          </a>
        </div>
      </div>
    </li>
  )
}

const STORE = 'navat-branch'

export function Reserve() {
  const [id, setId] = useState(() => {
    try { return localStorage.getItem(STORE) ?? '' } catch { return '' }
  })
  const [copied, setCopied] = useState(false)
  const b = branches.find((x) => x.id === id)

  const choose = (v: string) => {
    setId(v)
    setCopied(false)
    try { localStorage.setItem(STORE, v) } catch { /* приватный режим: выбор живёт до перезагрузки */ }
  }

  const copy = async () => {
    if (!b) return
    try {
      await navigator.clipboard.writeText(b.phone)
      setCopied(true)
    } catch { /* без доступа к буферу номер остаётся видимым текстом */ }
  }

  return (
    <section id="bron" className="section section--tint" aria-labelledby="reserve-title">
      <div className="wrap reserve">
        <Reveal className="reserve__intro">
          <h2 id="reserve-title">{reserve.title}</h2>
          <p>{reserve.text}</p>
          <div className="field">
            <label htmlFor="reserve-branch">{reserve.pick}</label>
            <select id="reserve-branch" className="select" value={id} onChange={(e) => choose(e.target.value)}>
              <option value="">{reserve.pick}</option>
              {cities.map((c) => (
                <optgroup key={c} label={c}>
                  {branches.filter((x) => x.city === c).map((x) => <option key={x.id} value={x.id}>{x.address}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
        </Reveal>

        <div className={b ? 'ticket' : 'ticket ticket--empty'} aria-live="polite">
          {b ? (
            <>
              <span className="ticket__city">NAVAT, {b.city}</span>
              <h3>{b.address}</h3>
              <div className="ticket__row"><span>{reserve.hours}</span><span>{b.hours}</span></div>
              <a className="ticket__phone" href={telHref(b.phone)}>{b.phone}</a>
              <div className="ticket__actions">
                <a className="btn btn--primary" href={telHref(b.phone)}><PhoneIcon size={18} weight="bold" />{reserve.call}</a>
                <button type="button" className="btn btn--ghost" onClick={copy}>
                  {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                  {copied ? reserve.copied : reserve.copy}
                </button>
              </div>
              <p className="ticket__note">{reserve.note}</p>
            </>
          ) : (
            <>
              <Star />
              <p style={{ margin: 0, maxWidth: '34ch' }}>{reserve.emptyPanel}</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
