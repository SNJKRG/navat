// Все тексты сайта (кыргызча) и данные. Источники:
// цены и названия блюд: content/menu-pdf-text/bishkek-ky.txt (печатное меню Бишкек 2026);
// филиалы: data/branches.json (on_site). Факты о бренде: brand/BRAND_OVERVIEW.md.

export const nav = [
  { href: '#menu', label: 'Меню' },
  { href: '#filialdar', label: 'Филиалдар' },
  { href: '#biz', label: 'Биз жөнүндө' },
]

export const hero = {
  eyebrow: 'Чайкана · 2014-жылдан бери',
  title: 'Бардык жол дасторконго алып келет.',
  // финал hero: строки заголовка, вторая (accent) курсивом
  titleLines: ['Бардык жол', 'дасторконго', 'алып келет.'],
  sub: 'Бишкекте жана Ошто 17 чайкана.',
  menuCta: 'Менюну ачуу',
  captionLabel: 'Сүрөттөгү зал чыныгы',
  caption: 'Курманжан Датка көч., 242',
  skip: 'Өткөрүү',
  // ворота hero: пары фраз по обе стороны арки, сменяются (каждая строка = отдельная строка в каллиграфии).
  // Шрифт Great Vibes не содержит ң ө ү: фразы без этих букв (иначе буква упадёт в Literata Italic).
  slogans: [
    { left: ['Тарыхтын', 'даамы'], right: ['Жибек жолунун', 'дасторкону'] },
    { left: ['Кербендер', 'токтогон жер'], right: ['Казан кайнап,', 'чай даяр'] },
    { left: ['Ата-бабалардын', 'салты'], right: ['Ар бир', 'дасторкондо'] },
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
  title: 'Дасторкондун төрүндө',
  lead: 'Бул тамактарды издеп атайын келишет. Баалар Бишкектеги филиалдар боюнча.',
  items: [
    {
      id: 'beshbarmak',
      name: 'Бешбармак',
      text: 'Колго жайылган камыр, тунук сорпо, үстүнө ысык чык. Кесмесин өзүңүз тандайсыз: кадимки же таласча пластинка.',
      meta: '540 г',
      price: '595 сом',
    },
    {
      id: 'plov',
      name: 'Ташкент ашы',
      text: 'Лазер күрүчү, кой жана торпок эти, сары жана кызыл сабиз, ноокат. Беш кишилик казан.',
      meta: '3,3 кг',
      price: '3 750 сом',
    },
    {
      id: 'boz-uy',
      name: 'Боз үй',
      text: 'Боз үй түрүндө бышкан алтын токоч. Ичинде казанда кызарган торпоктун кабыргасы.',
      meta: '1,7 кг, беш кишиге',
      price: '4 950 сом',
    },
    {
      id: 'kuurdak',
      name: 'Үйдөгүдөй куурдак',
      text: 'Койдун эти менен кабыргасы казанда картошка менен кызарат. Жанында маринаддалган пияз.',
      meta: '530 г',
      price: '795 сом',
    },
    {
      id: 'samovar',
      name: 'Апамдын чайы',
      text: 'Беш литрлик самоор: кара, көк же махабат чай. Сөз узарат, чай муздабайт.',
      meta: '5 л',
      price: '400 сом',
    },
  ] satisfies Dish[],
}

export type MenuItem = { name: string; text?: string; meta: string; price: string }
export type MenuCategory = { id: string; title: string; items: MenuItem[] }

export const menu = {
  title: 'Меню',
  lead: 'Бишкектеги баалар, сом менен. Ош жана Фучик көчөсүндөгү филиалда баалар бир аз башкача.',
  pdfLabel: 'Толук меню, PDF',
  pdf: 'https://navat.kg/price/bishkek/ky.pdf',
  categories: [
    {
      id: 'ulut',
      title: 'Улуттук тамактар',
      items: [
        { name: 'Бешбармак, кой же уй эти менен', text: 'Кесме же таласча пластинка', meta: '540 г / 670 г', price: '595 / 625' },
        { name: 'Бешбармак, жылкы эти жана казы менен', meta: '560 г / 710 г', price: '705 / 735' },
        { name: 'Нарын', text: 'Жылкы эти, ичке кесме, муздак тартылат. Жанына ысык сорпо', meta: '350 г', price: '685' },
        { name: 'Үйдөгүдөй куурдак', text: 'Койдун эти жана кабыргасы, картошка', meta: '530 г', price: '795' },
        { name: 'Тоок куурдак', text: 'Казанда кызарган канаттар, картошка', meta: '550 г', price: '680' },
        { name: 'Ташкент ашы', text: 'Беш кишиге', meta: '3,3 кг', price: '3 750' },
        { name: 'Боз үй', text: 'Беш кишиге', meta: '1,7 кг', price: '4 950' },
        { name: 'Жибек жолу', text: 'Бренд-шефтин рецеби, 6-8 кишиге. Алдын ала заказ менен', meta: '4 кг', price: '4 650' },
      ],
    },
    {
      id: 'shorpo',
      title: 'Шорполор',
      items: [
        { name: 'Шорпо', text: 'Койдун кабыргасы, картошка, сабиз', meta: '0,7 / 1 п', price: '360 / 380' },
        { name: 'Чүчпара', text: 'Колго түйүлгөн майда чүчпара', meta: '0,7 / 1 п', price: '330 / 350' },
        { name: 'Казакча эт', text: 'Янтарь сорпо, жука камыр', meta: '0,7 / 1 п', price: '340 / 360' },
        { name: 'Мампар', meta: '0,7 / 1 п', price: '320 / 340' },
        { name: 'Мастава', text: 'Күрүч жана маш', meta: '0,7 / 1 п', price: '320 / 340' },
        { name: 'Кесме шорпо', text: 'Үйдөгүдөй кесме, тоок эти', meta: '0,7 / 1 п', price: '280 / 300' },
      ],
    },
    {
      id: 'lagman',
      title: 'Лагман жана казан',
      items: [
        { name: 'Үй шартында лагман', text: 'Кесмени колго гана чоебуз', meta: '350 / 500 г', price: '440 / 460' },
        { name: 'Гюро-лагман', text: 'Сяй менен кесме өз-өзүнчө берилет', meta: '350 / 500 г', price: '440 / 460' },
        { name: 'Соомян', meta: '350 / 550 г', price: '450 / 470' },
        { name: 'Босолагман', meta: '350 / 550 г', price: '450 / 470' },
        { name: 'Ганфан', text: 'Лазер күрүчү, ширелүү сяй', meta: '400 / 600 г', price: '440 / 460' },
        { name: 'Казан-кебаб фри менен', text: 'Торпок же кой эти', meta: '380 г', price: '695' },
      ],
    },
    {
      id: 'shishkebek',
      title: 'Тандыр шишкебектер',
      items: [
        { name: 'Хандык люля-кебаб', meta: '160 г', price: '570' },
        { name: 'Кой этинен', meta: '155 г', price: '580' },
        { name: 'Торпок этинен', meta: '135 г', price: '580' },
        { name: 'Тооктун сулп этинен', meta: '175 г', price: '430' },
        { name: 'Тооктун канаттарынан', meta: '200 г', price: '450' },
      ],
    },
    {
      id: 'nan',
      title: 'Нан жана бышырма',
      items: [
        { name: 'Алат самсасы', text: 'Жука камыр, торпок эти, пияз, помидор', meta: '90 г', price: '160' },
        { name: 'Самса эт менен', meta: '100 г', price: '145' },
        { name: 'Хан чебурек', meta: '170 г', price: '290' },
        { name: 'Чебурек жусай менен', meta: '3 даана', price: '290' },
        { name: 'Каттама', text: 'Көмөч казанда бышкан катмар нан', meta: '200 г', price: '220' },
        { name: 'Боорсок', meta: '200 г', price: '130' },
        { name: 'Токоч', meta: '175 г', price: '85' },
      ],
    },
    {
      id: 'chai',
      title: 'Чай жана таттуу',
      items: [
        { name: 'Апамдын чайы', text: 'Самоор, кара, көк же махабат чай', meta: '5 л', price: '400' },
        { name: 'Кара же көк чай', meta: '1 чайнек', price: '135' },
        { name: 'Махабат чай', meta: '1 чайнек', price: '145' },
        { name: 'Хандын чайы', text: 'Корица, жалбыз, алма', meta: '1 чайнек', price: '320' },
        { name: 'NAVAT фирмалык чайы', text: 'Нават, лайм, лимон, жалбыз', meta: '1 чайнек', price: '350' },
        { name: 'Чыгыш таттуулары', text: 'Чак-чак, пахлава, халва, тоо балы, нават', meta: '750 г', price: '1 100' },
        { name: 'Кунафе', text: 'Анвар Бабаджановдун рецеби', meta: '250 г', price: '580' },
      ],
    },
  ] satisfies MenuCategory[],
}

export const halls = {
  eyebrow: 'Залдар',
  title: 'Ар бир жыйынга өз бөлмөсү.',
  text: 'VIP-бөлмөлөр 12ден 30 кишиге чейин, акысыз. Тушоо той, туулган күн, кудалашуу: күнүн жана менюсун администратор менен сүйлөшөсүз.',
  names: ['Боз үй', 'Көчмөн', 'Чыгыш базары', 'Манас', 'Кара-Суу', 'Жашыл зал'],
  cta: 'Үстөл брондоо',
}

export type Branch = {
  id: string
  city: 'Бишкек' | 'Ош'
  address: string
  phone: string
  hours: string
  terrace?: boolean
  kids?: boolean
  vip?: boolean
  photo?: string
}

// ponytail: телефондор/убакыт navat.kg'ден 2026-10-06 алынды; ар бир филиал менен текшерүү керек (SPEC P0)
export const branches: Branch[] = [
  { id: 'ibraimova', city: 'Бишкек', address: 'Ибраимов көч., 42', phone: '+996 551 57 11 11', hours: '10:00-00:00', terrace: true, photo: 'ul-ibraimova-42' },
  { id: 'kievskaya', city: 'Бишкек', address: 'Киев көч., 114/1', phone: '+996 551 53 11 11', hours: '10:00-00:00', terrace: true, kids: true, vip: true, photo: 'ul-kievskaya-114-1' },
  { id: 'fuchika', city: 'Бишкек', address: 'Фучик көч., 3', phone: '+996 551 54 11 11', hours: '10:00-00:00', kids: true, vip: true, photo: 'ul-fuchika-3' },
  { id: 'tokombaeva', city: 'Бишкек', address: 'Токомбаев көч., 32/4', phone: '+996 551 62 11 11', hours: '10:00-00:00', terrace: true, kids: true, vip: true, photo: 'ul-tokombaeva-32-4' },
  { id: 'kurmanjan', city: 'Бишкек', address: 'Курманжан Датка көч., 242', phone: '+996 551 84 11 11', hours: '10:00-00:00', terrace: true, kids: true, vip: true, photo: 'ul-kurmandzhan-datka-242' },
  { id: 'baytik', city: 'Бишкек', address: 'Байтик Баатыр көч., 55', phone: '+996 551 06 11 11', hours: 'Күнү-түнү', terrace: true, vip: true, photo: 'ul-baytik-baatyra-55' },
  { id: 'turusbekova', city: 'Бишкек', address: 'Турусбеков көч., 100', phone: '+996 551 83 11 11', hours: '10:00-00:00', terrace: true, vip: true, photo: 'ul-turusbekova-100' },
  { id: 'technopark', city: 'Бишкек', address: 'Технопарк, Горький көч., 1/2', phone: '+996 554 56 11 11', hours: '10:00-00:00', kids: true, photo: 'ul-gorkogo-1-2' },
  { id: 'akhunbaeva', city: 'Бишкек', address: 'Ахунбаев көч., 2в', phone: '+996 995 54 11 11', hours: '10:00-00:00', kids: true, vip: true },
  { id: 'tamir', city: 'Бишкек', address: '«Тамир» турак жайы, Аалы Токомбаев көч., 21а/3', phone: '+996 553 45 11 11', hours: '10:00-00:00', kids: true, vip: true },
  { id: 'abdymomunov', city: 'Бишкек', address: 'Абдымомунов көч., 244', phone: '+996 554 39 11 11', hours: '10:00-00:00', vip: true },
  { id: 'skypark', city: 'Бишкек', address: 'Skypark Байтик', phone: '+996 553 38 11 11', hours: '12:00-00:00', kids: true },
  { id: 'tsum', city: 'Бишкек', address: 'ЦУМ «Айчүрөк», 6-кабат', phone: '+996 551 23 11 11', hours: '10:00-22:00', kids: true, photo: 'tsum-aychurek-6-etazh' },
  { id: 'bishkekpark', city: 'Бишкек', address: 'Bishkek Park, 3-кабат', phone: '+996 550 53 11 11', hours: '10:00-22:00', photo: 'trts-bishkekpark-3-etazh' },
  { id: 'asiamall', city: 'Бишкек', address: 'Asia Mall, 3-кабат', phone: '+996 551 56 11 11', hours: '10:00-22:00', photo: 'trts-asiamall-3-etazh' },
  { id: 'dordoi', city: 'Бишкек', address: 'Dordoi Plaza, 4-кабат', phone: '+996 553 41 11 11', hours: '10:00-22:00', photo: 'trts-dordoi-plaza-4-etazh' },
  { id: 'osh-lenina', city: 'Ош', address: 'Ленин көч., 288', phone: '+996 551 77 11 11', hours: '10:00-00:00', terrace: true, kids: true, vip: true, photo: 'ul-lenina-288' },
]

export const branchUi = {
  title: 'Филиалдар',
  searchLabel: 'Филиал издөө',
  searchPlaceholder: 'Көчө же соода борбору',
  empty: 'Мындай дарек табылган жок.',
  clear: 'Издөөнү тазалоо',
  terrace: 'Жайкы терраса',
  kids: 'Балдар аянтчасы',
  vip: 'VIP-бөлмө',
  call: 'Чалуу',
  route: 'Маршрут',
  choose: 'Ушул филиалга брондоо',
}

export const reserve = {
  title: 'Үстөл брондоо',
  text: 'Филиалды тандап, чалыңыз. Бош орун барбы, жокпу, администратор айтып берет.',
  pick: 'Филиалды тандаңыз',
  emptyPanel: 'Тизмеден филиал тандаңыз: дареги, иш убактысы жана номери ушул жерде чыгат.',
  hours: 'Иш убактысы',
  call: 'Чалуу',
  copy: 'Номерди көчүрүү',
  copied: 'Көчүрүлдү',
  note: 'Брондоону администратор телефон аркылуу тастыктайт. Той же банкет болсо, ушул эле номерге чалыңыз.',
}

export const story = {
  eyebrow: 'Биз жөнүндө',
  title: 'Баары 2014-жылы Бишкектеги бир чайканадан башталган.',
  text: 'Бүгүн NAVAT Кыргызстанда, Казакстанда жана Бириккен Араб Эмирликтеринде 40тан ашык чайкана. Ашкананы бренд-шеф Анвар Бабаджанов жетектейт: «Жибек жолу» менен кунафе анын рецеби боюнча бышат.',
  chef: 'Анвар Бабаджанов, NAVAT бренд-шефи',
  facts: [
    { value: '2014', label: 'Бишкекте биринчи чайкана' },
    { value: '17', label: 'чайкана Бишкек менен Ошто' },
    { value: '40+', label: 'чайкана үч өлкөдө' },
  ],
}

export const delivery = {
  title: 'Үйгө жеткирүү, күнү-түнү.',
  text: '500 сомдон ашкан заказ Бишкек ичинде акысыз жеткирилет.',
  phone: '0551 64 11 11',
  tel: '+996551641111',
  cta: 'Жеткирүүгө заказ',
  href: 'https://navat.kg/dostavka',
}

export const footer = {
  email: 'chaihana.navat@gmail.com',
  instagram: [
    { label: '@navat_kg', href: 'https://instagram.com/navat_kg' },
    { label: '@navat.osh', href: 'https://instagram.com/navat.osh' },
  ],
  langs: [
    { label: 'Кыргызча', href: '#', current: true },
    { label: 'Русский', href: 'https://navat.kg/' },
    { label: 'English', href: 'https://en.navat.kg/' },
  ],
  copy: '© 2026 NAVAT Чайкана',
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

export const routeHref = (b: Branch) =>
  `https://2gis.kg/${b.city === 'Ош' ? 'osh' : 'bishkek'}/search/${encodeURIComponent(`NAVAT ${b.address}`)}`
