import { Router } from 'express'
import Cart from '../services/Cart.js'
import { validateAddToCart } from '../validators.js'

const router = Router()

router.get('/cart', async (req, res) => {
  const cart = await Cart.displayCart()
  res.json(cart)
})

router.post('/cart', validateAddToCart, async (req, res) => {
  const { product_id, quantity } = req.body

  if (!product_id || !quantity) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  const cart = await Cart.addToCart(product_id, quantity)

  res.json({ message: 'Cart created successfully', cart })
})

router.delete('/cart/:id', async (req, res) => {
  const { id } = req.params

  try {
    const cart = await Cart.delete(id)
    res.json({ message: 'Cart deleted successfully' })
  } catch (err) {
    res.status(404).json({ message: 'Cart item not found' })
  }
})

router.delete('/cart', async (req, res) => {
  await Cart.empty()
  res.json({ message: 'Cart emptied successfully' })
})

export default router
