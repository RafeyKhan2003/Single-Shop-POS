import { Schema } from './db'

class ProductDB {
  constructor() {
    this.Product = Schema(`Products`, {
      name: { type: String },
      type: { type: String, default: 'Parts' },
      condition: { type: String, default: 'New' },
    })
  }

  async createProduct(product) {
    const pr = this.Product.create({
      name: product.name,
      type: product.type,
      condition: product.condition,
    }).save()
    if (pr) return true
  }
  updateProduct(pr) {
    const product = this.Product.findOne({ _id: pr._id })
    if (!product) return false
    product
      .update({
        name: pr.name,
        type: pr.type,
        condition: pr.condition,
      })
      .save()

    return true
  }
  getProducts() {
    return this.Product.find()
  }
  removeProduct(pr) {
    return this.Product.remove({ _id: pr._id })
  }
  findProduct() {}
}

export default new ProductDB()
