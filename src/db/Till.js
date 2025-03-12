import { Schema, suffix, date } from './db'
import Order from './Order'

class TillDB {
  constructor() {
    this.Till = Schema(`Till${suffix}`, {
      till_date: { type: String },
      opening_time: { type: Date },
      closing_time: { type: Date },
      opening_amount: { type: Number },
      closing_amount: { type: Number },
    })
  }
  openTill(till) {
    const t = this.Till.create({
      till_date: date,
      opening_time: new Date().toDateString(),
      closing_time: '',
      opening_amount: till.opening_amount,
      closing_amount: 0,
    }).save()
    if (t) return true
  }

  getTill() {
    let till = this.Till.findOne() || {}
    if (till.till_date !== date) {
      return {}
    }
    return till
  }
  updateTill(till) {
    let t = this.Till.findOne() || {}
    t.update({
      closing_time: till.closing_time || '',
      closing_amount: till.closing_amount || 0,
    }).save()
    return true
  }
  getTillTotal() {
    const till = this.Till.findOne()
    const cashSalesTotal = Order.getSalesTotal('Cash')

    //TODO: Subtract Cash purchase total
    const cashPurchaseTotal = 0

    return till.opening_amount + cashSalesTotal - cashPurchaseTotal
  }
}

export default new TillDB()
