import type { Picture } from './ui'

import heroFirst from './media/hero-first.jpg?w=960;1440;1920&format=avif;webp;jpg&as=picture'
import hallWide from './media/hall-dxb-wide.jpg?w=960;1360&format=avif;webp;jpg&as=picture'
import hallTall from './media/hall-dxb-tall.jpg?w=420;680&format=avif;webp;jpg&as=picture'
import beshbarmak from './media/dish-beshbarmak.jpg?w=720;1200;1774&format=avif;webp;jpg&as=picture'
import plov from './media/dish-plov.jpg?w=420;839&format=avif;webp;jpg&as=picture'
import kuurdak from './media/dish-kuurdak.jpg?w=420;840&format=avif;webp;jpg&as=picture'
import mezze from './media/dish-mezze.jpg?w=420;696&format=avif;webp;jpg&as=picture'
import desserts from './media/dish-desserts.jpg?w=420;840&format=avif;webp;jpg&as=picture'
import roomTeddy from './media/room-teddy.jpg?w=480;816&format=avif;webp;jpg&as=picture'
import roomFacade from './media/room-facade.jpg?w=480;960;1200&format=avif;webp;jpg&as=picture'
import roomTerrace from './media/room-terrace.jpg?w=480;1024&format=avif;webp;jpg&as=picture'
import roomHall from './media/room-hall.jpg?w=480;957&format=avif;webp;jpg&as=picture'
import roomSofas from './media/room-sofas.jpg?w=480;678&format=avif;webp;jpg&as=picture'
import chef from './media/chef.jpg?w=480;800&format=avif;webp;jpg&as=picture'

export { heroFirst, hallWide, hallTall, roomTeddy, roomFacade, roomTerrace, roomHall, roomSofas, chef }

export const dishPics: Record<string, Picture> = { beshbarmak, plov, kuurdak, mezze, desserts }
