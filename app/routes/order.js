import { Router } from 'express'
import Order from '../services/Order.js'
import { Prisma, PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/orders', async (req, res) => {
  try {
    const cartData = await prisma.cart.findMany({
      include: { product: true }
    })

    const total = cartData.reduce((acc, item) => acc + item.total, 0)
    const order = await prisma.order.create({
      data: {
        date: new Date(),
        number: `ORD/${Math.floor(Math.random() * 1000)}`,
        total
      }
    })

    const orderItems = cartData.map((item) => {
      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        total: item.total,
        price: item.product.price
      }
    })

    await prisma.orderItem.createMany({ data: orderItems })

    await prisma.cart.deleteMany()

    res.json({ message: 'Order created successfully', order })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { date: 'desc' }
  })
  res.json(orders)
})

router.get('/orders/:id', async (req, res) => {
  const { id } = req.params
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: Number(id) },
      include: {
        order_items: {
          include: { product: true }
        }
      }
    })
    res.json(order)
  } catch (err) {
    res.status(404).json({ message: 'Order not found' })
  }
})

export default router
