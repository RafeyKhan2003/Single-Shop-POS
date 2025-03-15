import { Schema } from './db'

class GenProductDB {
  constructor() {
    this.GenProduct = Schema(`GenProducts`, {
      name: { type: String },
      type: { type: String, default: 'Parts' },
      condition: { type: String, default: 'New' },
    })

    const existingGenProducts = this.GenProduct.find()
    if (!existingGenProducts.length) {
      ;[
        { name: 'Bike', type: 'Bike', condition: 'New' },
        { name: 'Bike', type: 'Bike', condition: 'Used' },
        { name: 'Helmet', type: 'Helmet', condition: 'New' },
        { name: 'Helmet', type: 'Helmet', condition: 'Used' },
        { name: 'Part', type: 'Parts', condition: 'New' },
        { name: 'Part', type: 'Parts', condition: 'Used' },
        { name: 'Accessories', type: 'Accessories', condition: 'New' },
        { name: 'Accessories', type: 'Accessories', condition: 'Used' },
      ].forEach((p) => this.GenProduct.create(p).save())
    }
  }

  async createGenProduct(product) {
    const pr = this.GenProduct.create({
      name: product.name,
      type: product.type,
      condition: product.condition,
    }).save()
    if (pr) return true
  }
  updateGenProduct(pr) {
    const product = this.GenProduct.findOne({ _id: pr._id })
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
  getGenProducts() {
    return this.GenProduct.find().sort((a, b) => a.name.localeCompare(b.name))
  }
  removeGenProduct(pr) {
    return this.GenProduct.remove({ _id: pr._id })
  }
  findGenProduct() {}
}

export default new GenProductDB()
