import { Prisma } from '@prisma/client'
import Service from './Service.js'

class Cart extends Service {
  model = Prisma.ModelName.Cart

  async displayCart() {
    const products = await this.withRelation('product').get()

    return {
      total: products.reduce((acc, curr) => acc + curr.total, 0),
      products
    }
  }

  async addToCart(product_id, quantity) {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(product_id) }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    const existingCart = await this.prisma.cart.findFirst({
      where: { product_id: Number(product_id) }
    })

    if (existingCart) {
      const cart = await this.prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          quantity: Number(existingCart.quantity) + Number(quantity),
          total: Number(product.price) * (Number(existingCart.quantity) + Number(quantity))
        }
      })

      return cart
    }

    const cart = await this.prisma.cart.create({
      data: {
        product: { connect: { id: Number(product_id) } },
        quantity: Number(quantity),
        total: Number(product.price) * Number(quantity)
      }
    })

    return cart
  }

  async empty() {
    return await this.prisma.cart.deleteMany()
  }
}

export default new Cart()
