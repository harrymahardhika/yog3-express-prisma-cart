import { Router } from 'express'
import Cart from '../services/Cart.js'
import { validateAddToCart } from '../validators.js'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/cart', async (req, res) => {
  const cart = await prisma.cart.findMany()
  const total = cart.reduce((acc, item) => acc + item.total, 0)
  res.json({
    cart,
    total
  })
})

router.post('/cart', validateAddToCart, async (req, res) => {
  const { product_id, quantity } = req.body

  const product = await prisma.product.findUnique({
    where: { id: Number(product_id) }
  })

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  const existingCart = await prisma.cart.findFirst({
    where: { product_id: Number(product_id) }
  })

  let total = product.price * quantity

  if (existingCart) {
    const newQuantity = existingCart.quantity + quantity
    total = product.price * newQuantity
    await prisma.cart.update({
      where: { id: existingCart.id },
      data: { quantity: newQuantity, total }
    })

    return res.json({ message: 'Cart updated successfully' })
  }

  const cart = await prisma.cart.create({
    data: { product_id, quantity, total }
  })

  res.json({ message: 'Cart created successfully', cart })
})

router.delete('/cart/:id', async (req, res) => {
  const { id } = req.params

  try {
    await prisma.cart.delete({
      where: { id: Number(id) }
    })
    res.json({ message: 'Cart deleted successfully' })
  } catch (err) {
    res.status(404).json({ message: 'Cart item not found' })
  }
})

router.delete('/cart', async (req, res) => {
  await prisma.cart.deleteMany()
  res.json({ message: 'Cart emptied successfully' })
})

export default router
