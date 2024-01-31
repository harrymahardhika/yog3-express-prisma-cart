import { Prisma } from '@prisma/client'
import Service from './Service.js'
import Cart from './Cart.js'

class Order extends Service {
  model = Prisma.ModelName.Order

  async store() {
    const cart = await Cart.displayCart()

    if (cart.products.length === 0) {
      throw new Error('Cart is empty')
    }

    return this.prisma.$transaction(async (transaction) => {
      const order = await transaction.order.create({
        data: {
          date: new Date(),
          number: `ORD/${Math.floor(Math.random() * 1000)}`,
          total: cart.total
        }
      })

      await transaction.orderItem.createMany({
        data: cart.products.map((product) => {
          return {
            order_id: order.id,
            product_id: product.product_id,
            quantity: product.quantity,
            price: product.price,
            total: product.total
          }
        })
      })

      await Cart.empty()
    })
  }

  async find(id) {
    try {
      return await this.prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          order_items: {
            include: {
              product: true
            }
          }
        }
      })
    } catch (err) {
      throw new Error('Not found')
    }
  }
}

export default new Order()
