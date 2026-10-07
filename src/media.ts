import type { Picture } from './ui'

import heroFirst from './media/hero-first.jpg?w=960;1440;1920&format=avif;webp;jpg&as=picture'
import hallK4Wide from './media/hall-k4-wide.jpg?w=960;1440;1680&format=avif;webp;jpg&as=picture'
import hallK4Tall from './media/hall-k4-tall.jpg?w=420;839&format=avif;webp;jpg&as=picture'
import beshbarmak from './media/dish-beshbarmak.jpg?w=720;1200;1774&format=avif;webp;jpg&as=picture'
import plov from './media/dish-plov.jpg?w=420;839&format=avif;webp;jpg&as=picture'
import bozUy from './media/dish-boz-uy.jpg?w=420;839&format=avif;webp;jpg&as=picture'
import kuurdak from './media/dish-kuurdak.jpg?w=420;840&format=avif;webp;jpg&as=picture'
import samovar from './media/dish-samovar.jpg?w=420;839&format=avif;webp;jpg&as=picture'
import chef from './media/chef.jpg?w=480;800&format=avif;webp;jpg&as=picture'

export { heroFirst, hallK4Wide, hallK4Tall, chef }

export const dishPics: Record<string, Picture> = {
  beshbarmak,
  plov,
  'boz-uy': bozUy,
  kuurdak,
  samovar,
}

const branchGlob = import.meta.glob('./media/branch-*.jpg', {
  query: { w: '320;640;1200', format: 'avif;webp;jpg', as: 'picture' },
  import: 'default',
  eager: true,
}) as Record<string, Picture>

export const branchPic = (slug?: string) => (slug ? branchGlob[`./media/branch-${slug}.jpg`] : undefined)
