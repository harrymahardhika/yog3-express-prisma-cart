import { Prisma } from '@prisma/client'
import Service from './Service.js'

class Product extends Service {
  model = Prisma.ModelName.Product
}

export default new Product()
