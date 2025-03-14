import { Schema, suffix } from './db'
import { date } from 'quasar'
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
      till_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
      opening_time: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A'),
      closing_time: '',
      opening_amount: till.opening_amount,
      closing_amount: 0,
    }).save()
    if (t) return true
  }

  getTill() {
    let till = this.Till.findOne() || {}
    if (till.till_date !== date.formatDate(new Date(), 'YYYY-MM-DD')) {
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
    const till = this.Till.findOne() || { opening_amount: 0 }
    const cashSalesTotal = Order.getSalesTotal('Cash')

    //TODO: Subtract Cash purchase total
    const cashPurchaseTotal = 0

    return till.opening_amount + cashSalesTotal - cashPurchaseTotal
  }
}

export default new TillDB()
