// import { Schema, suffix } from './db'
// import { date } from 'quasar'
import Till from './Till'
import Order from './Order'
import Purchase from './Purchase'
import Workshop from './Workshop'

class ReportDB {
  constructor() {
    this.Report = {}
  }

  getTotalCashSales() {
    const till = Till.getTill() || { opening_amount: 0 }
    const cashSalesTotal = Order.getSalesTotal('Cash')
    const cashPurchaseTotal = Purchase.getPurchasesTotal('Cash')
    const cashWorkshopTotal = Workshop.getWorkshopsTotal('Cash')

    return till.opening_amount + cashSalesTotal + cashWorkshopTotal - cashPurchaseTotal
  }
}

export default new ReportDB()
