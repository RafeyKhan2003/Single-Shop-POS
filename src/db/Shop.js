import { Schema } from './db'

class ShopDB {
  constructor() {
    this.Shop = Schema('Shop', {
      name: { type: String },
      address: { type: String },
      phone: { type: String },
      email: { type: String },
      mail: {
        type: Object,
        default: { company_emails: 'ftaccountants@gmail.com,pixxtechlhr@gmail.com' },
      },
    })
  }

  /**
   * Update shop details
   * @param {Object} shop - The shop object containing name, address, phone, and email.
   */
  updateShop(shop) {
    let s = this.Shop.findOne() || {}
    if (s.name) {
      s.update({
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        email: shop.email,
        mail: shop.mail,
      }).save()
      return true
    }
    let sh = this.Shop.create({
      name: shop.name,
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
      mail: shop.mail,
    }).save()

    return !!sh
  }

  /**
   * Get shop details
   * @returns {Object} - The shop data
   */
  getShop() {
    return this.Shop.findOne() || { mail: {} }
  }
}

export default new ShopDB()
