import express from 'express'
import productRoutes from './app/routes/product.js'
import cartRoutes from './app/routes/cart.js'
import orderRoutes from './app/routes/order.js'

const app = express()
app.use(express.json())

app.use(productRoutes)
app.use(cartRoutes)
app.use(orderRoutes)

export default app
