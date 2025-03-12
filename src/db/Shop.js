import { Schema } from './db'

class ShopDB {
  constructor() {
    this.Shop = Schema('Shop', {
      name: { type: String },
      address: { type: String },
      phone: { type: String },
      email: { type: String },
    })
  }

  /**
   * Update shop details
   * @param {Object} shop - The shop object containing name, address, phone, and email.
   * @returns {Boolean} - Returns true if successful
   */
  updateShop(shop) {
    let s = this.Shop.findOne() || {}
    if (s.name) {
      s.update({
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        email: shop.email,
      }).save()
      return true
    }
    let sh = this.Shop.create({
      name: shop.name,
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
    }).save()

    return !!sh
  }

  /**
   * Get shop details
   * @returns {Object} - The shop data
   */
  getShop() {
    return this.Shop.findOne() || {}
  }
}

export default new ShopDB()
