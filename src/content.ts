// All site copy (English) and data for NAVAT Dubai. Sources (navat-dubai/, collected 2026-10-13):
// dishes and AED prices: Zomato menu snapshot (menus/zomato-pages), edition date unknown;
// address, phone, hours: place.json (Tower B and 08:00-03:00 are the majority versions, conflicts listed there).
// ponytail: prices and hours come from public listings, not from the restaurant; confirm with NAVAT Dubai before launch.

export const nav = [
  { href: '#menu', label: 'Menu' },
  { href: '#room', label: 'The room' },
  { href: '#visit', label: 'Visit' },
]

export const place = {
  name: 'NAVAT Dubai',
  address: 'Stand Point, Tower B, Sheikh Mohammed bin Rashid Blvd',
  area: 'Downtown Dubai, next to Dubai Opera',
  phone: '+971 56 879 2607',
  hours: 'Daily, 08:00 to 03:00',
  breakfast: '08:00 to 15:00',
  map: 'https://www.google.com/maps/search/?api=1&query=25.1970567%2C55.2707744',
  instagram: { label: '@navatdubai_', href: 'https://www.instagram.com/navatdubai_/' },
  facebook: 'https://www.facebook.com/Navatdubai/',
}

export const hero = {
  eyebrow: 'Teahouse · Downtown Dubai',
  // finale title lines, the second one (accent) in italics
  titleLines: ['A Silk Road', 'teahouse', 'on the Boulevard.'],
  sub: 'Central Asian kazan cooking, mezze and tea, from breakfast until 3 am.',
  menuCta: 'See the menu',
  captionLabel: 'Our dining room',
  caption: 'Stand Point, Tower B',
  skip: 'Skip',
  // gate slogans: pairs on both sides of the arch, rotating (each item = one line of calligraphy)
  slogans: [
    { left: ['A taste', 'of history'], right: ['The Silk Road', 'table'] },
    { left: ['Where caravans', 'came to rest'], right: ['The kazan is on,', 'the tea is ready'] },
    { left: ['From Bishkek', 'to Dubai'], right: ['Old recipes,', 'a new city'] },
  ],
}

export type Dish = {
  id: string
  name: string
  text: string
  meta: string
  price: string
}

export const dishes = {
  title: 'Why people come back',
  lead: 'Kyrgyz classics from the kazan, mezze for the table and teddy-bear desserts. Prices in AED.',
  items: [
    {
      id: 'beshbarmak',
      name: 'Beshbarmak',
      text: 'Hand-rolled noodles, slow-cooked meat and broth. The dish a Kyrgyz family serves its most honoured guest.',
      meta: 'Kyrgyz national dish',
      price: 'AED 75',
    },
    {
      id: 'plov',
      name: 'Festive Rice',
      text: 'Central Asian plov from a whole kazan, made for a big table. Order three hours ahead.',
      meta: 'For the whole table',
      price: 'AED 365',
    },
    {
      id: 'kuurdak',
      name: 'Kuurdak',
      text: 'Meat and potatoes seared in the kazan with onion. Simple, rich, made the way it is at home.',
      meta: 'From the kazan',
      price: 'AED 85',
    },
    {
      id: 'mezze',
      name: 'Mezze',
      text: 'Hummus, moutabbal, babaganush, vine leaves and labneh with bread straight from the oven.',
      meta: 'For sharing',
      price: 'from AED 32',
    },
    {
      id: 'desserts',
      name: 'Desserts',
      text: 'Teddy Cake, char-grilled kunafa, baklava and San Sebastian cheesecake. Tea comes next.',
      meta: 'Teddy Cake AED 59',
      price: 'from AED 29',
    },
  ] satisfies Dish[],
}

export type MenuItem = { name: string; text?: string; meta?: string; price: string }
export type MenuCategory = { id: string; title: string; note?: string; items: MenuItem[] }

export const menu = {
  title: 'Menu',
  lead: 'A selection from our dine-in menu, prices in AED. Prices and availability can change: your server has the current menu.',
  moreLabel: 'Order delivery on Deliveroo',
  more: 'https://deliveroo.ae/en/menu/dubai/downtown-dubai-mall/navat-tea-house',
  currency: 'AED',
  categories: [
    {
      id: 'central-asian',
      title: 'Central Asian',
      items: [
        { name: 'Beshbarmak', text: 'Hand-rolled noodles, slow-cooked meat, broth', price: '75' },
        { name: 'Kuurdak', text: 'Meat and potatoes from the kazan', price: '85' },
        { name: 'Boso Lagman', text: 'Hand-pulled noodles, wok-fried', price: '69' },
        { name: 'Steamed Manti', price: '45' },
        { name: 'Fried Manti', price: '45' },
        { name: 'Navat Samsa', price: '45' },
        { name: 'Shorpo', text: 'Clear meat soup', price: '44' },
        { name: 'Festive Rice', meta: 'individual', price: '69' },
        { name: 'Festive Rice platter', price: '110' },
        { name: 'Festive Rice, whole kazan', meta: 'order 3 hours ahead', price: '365' },
        { name: 'Mixed Shashlik', meta: 'for 4 to 6', price: '480' },
        { name: 'Boorsok basket', text: 'Fried dough, served with tea', price: '25' },
      ],
    },
    {
      id: 'breakfast',
      title: 'Breakfast',
      note: '08:00 to 15:00',
      items: [
        { name: 'Turkish breakfast plate', meta: 'for one', price: '65' },
        { name: 'Arabic breakfast plate', meta: 'for one', price: '68' },
        { name: 'Serpme Turkish breakfast', meta: 'for 4', price: '210' },
        { name: 'Arabic sharing breakfast', meta: 'for 5', price: '289' },
        { name: 'Shakshuka', price: '32' },
        { name: 'Turkish chilbir', text: 'Poached eggs, garlic yoghurt', price: '32' },
        { name: 'Syrniki', text: 'Cottage cheese pancakes', price: '49' },
        { name: 'Navat Simit', price: '39' },
      ],
    },
    {
      id: 'mezze',
      title: 'Mezze and salads',
      items: [
        { name: 'Classic hummus', price: '34' },
        { name: 'Hummus with sautéed beef', price: '45' },
        { name: 'Navat hummus selection', price: '65' },
        { name: 'Moutabbal', price: '32' },
        { name: 'Babaganush', price: '32' },
        { name: 'Vine leaves sarma (yalanji)', price: '34' },
        { name: 'Mezze selection', price: '45' },
        { name: 'Navat fattoush', price: '48' },
        { name: 'Tabbouleh', price: '45' },
        { name: 'Navat warm chicken salad', price: '45' },
      ],
    },
    {
      id: 'oven',
      title: 'Pide and börek',
      items: [
        { name: 'Cheese pide', price: '65' },
        { name: 'Pide with beef', price: '69' },
        { name: 'Pide with beef sujuk', price: '75' },
        { name: 'Lahmacun', price: '49' },
        { name: 'Su börek', price: '49' },
        { name: 'Rolling börek', price: '37' },
      ],
    },
    {
      id: 'sea',
      title: 'Fish and seafood',
      items: [
        { name: 'Grilled salmon steak', price: '125' },
        { name: 'Supreme fish', price: '99' },
        { name: 'Shrimp casserole', price: '85' },
        { name: 'Creamy garlic shrimp', price: '55' },
      ],
    },
    {
      id: 'desserts',
      title: 'Desserts',
      items: [
        { name: 'Teddy Cake', price: '59' },
        { name: 'Teddy Raffaello Cake', price: '59' },
        { name: 'Teddy Dubai', price: '69' },
        { name: 'Char-grilled kunafa', price: '65' },
        { name: 'Classic baklava', price: '42' },
        { name: 'Pistachio sarma', price: '52' },
        { name: 'San Sebastian cheesecake', text: 'With melted chocolate', price: '65' },
        { name: 'Saffron cake', price: '49' },
      ],
    },
    {
      id: 'shisha',
      title: 'Shisha',
      items: [
        { name: 'Classic flavours', text: 'Apple, double apple, mint, grape, lemon mint and more', price: '49' },
        { name: 'Navat Shisha', price: '79' },
        { name: 'Russian shisha', text: 'Love 66, Lady Killer, English Lord', price: '99' },
        { name: 'Special Russian shisha', text: 'Ice Baby, Peach Killer, Lemon Shock and more', price: '120' },
        { name: 'Panda Shisha', price: '149' },
      ],
    },
  ] satisfies MenuCategory[],
}

export const room = {
  eyebrow: 'The room',
  title: 'Arches, lanterns and a bear at your table.',
  text: 'Inside: tiled arches, lanterns and hand-painted plates. Outside: a terrace on the Boulevard, a few minutes from Dubai Opera. And at many tables, a giant teddy bear keeping you company.',
  features: ['Indoor hall', 'Boulevard terrace', 'Breakfast from 08:00', 'Shisha', 'Open until 03:00'],
  cta: 'Plan your visit',
}

export const visit = {
  title: 'Visit us',
  text: 'Walk in or call ahead for a table. For birthdays and big groups, call and we will set the table and the menu with you.',
  hours: 'Hours',
  breakfast: 'Breakfast',
  call: 'Call',
  route: 'Directions',
  copy: 'Copy number',
  copied: 'Copied',
}

export const story = {
  eyebrow: 'About NAVAT',
  title: 'It started in 2014 with one teahouse in Bishkek.',
  text: 'Today NAVAT runs more than 40 teahouses in Kyrgyzstan, Kazakhstan and the United Arab Emirates. The kitchen is led by brand chef Anvar Babadzhanov. In Dubai we have been on the Boulevard since 2022.',
  chef: 'Anvar Babadzhanov, NAVAT brand chef',
  facts: [
    { value: '2014', label: 'first teahouse, Bishkek' },
    { value: '40+', label: 'teahouses in three countries' },
    { value: '2022', label: 'NAVAT opens in Dubai' },
  ],
}

export const delivery = {
  title: 'Manti and samsa, at your door.',
  text: 'NAVAT Tea House delivers across Downtown Dubai through Deliveroo.',
  cta: 'Order on Deliveroo',
  href: menu.more,
}

export const footer = {
  langs: [
    { label: 'English', href: '#', current: true },
    { label: 'NAVAT Kyrgyzstan', href: 'https://navat.kg/' },
  ],
  copy: '© 2026 NAVAT Dubai',
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
