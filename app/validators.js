export const validateAddToCart = (req, res, next) => {
  const { product_id, quantity } = req.body
  if (!product_id) {
    return res.status(422).json({ error: 'Product ID is required' })
  }

  if (!quantity) {
    return res.status(422).json({ error: 'Quantity is required' })
  }

  next()
}
