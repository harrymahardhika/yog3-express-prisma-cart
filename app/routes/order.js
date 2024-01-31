import { Router } from 'express'
import Order from '../services/Order.js'
import { Prisma } from '@prisma/client'

const router = Router()

router.post('/orders', async (req, res) => {
  try {
    const order = await Order.store()

    res.json({ message: 'Order created successfully', order })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/orders', async (req, res) => {
  const orders = await Order.get()
  res.json(orders)
})

router.get('/orders/:id', async (req, res) => {
  const { id } = req.params
  console.log(Prisma.ModelName.OrderItem)
  try {
    const order = await Order.withRelation('order_items').find(id)
    res.json(order)
  } catch (err) {
    res.status(404).json({ message: 'Order not found' })
  }
})

export default router
