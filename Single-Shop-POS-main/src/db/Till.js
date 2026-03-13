import { Schema, suffix } from './db'
import { date } from 'quasar'
import Order from './Order'
import Purchase from './Purchase'
import Workshop from './Workshop'

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
  closeTill() {
    let t = this.Till.findOne() || {}
    t.update({
      closing_time: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A'),
      closing_amount: this.getTillTotal(),
    }).save()
    return true
  }
  getOpeningAmount() {
    const till = this.Till.findOne() || { opening_amount: 0 }
    return till.opening_amount
  }
  getTillTotal() {
    const till = this.Till.findOne() || { opening_amount: 0 }
    const cashSalesTotal = Order.getSalesTotal('Cash')
    const cashPurchaseTotal = Purchase.getPurchasesTotal('Cash')
    const cashWorkshopTotal = Workshop.getWorkshopsTotal('Cash')

    return till.opening_amount + cashSalesTotal + cashWorkshopTotal - cashPurchaseTotal
  }
}

export default new TillDB()
