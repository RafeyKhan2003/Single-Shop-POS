import { Schema, suffix } from './db'
import { date } from 'quasar'

class PurchaseDB {
  constructor() {
    this.Purchase = Schema(`Purchases${suffix}`, {
      purchase_id: { type: Number },
      type: { type: String, default: 'Purchase' },
      purchase_time: { type: String },
      customer: { type: Object },
      total_amount: { type: Number },
      products: { type: Array },
      payments: { type: Array },
      time_formated: { type: String },
      date: { type: String },
      time: { type: String },
      order_no: { type: String },
    })
  }
  createPurchase(purchase) {
    console.log('backend', purchase)
    let purchase_id = this.getLatestPurchaseId()
    const total_amount = (purchase.cart || []).reduce((sum, item) => sum + item.price * item.qty, 0)

    const purchase_time = date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
    const res = this.Purchase.create({
      purchase_id: purchase_id,
      purchase_time: purchase_time,
      total_amount: total_amount,
      customer: purchase.customer || {},
      payments: purchase.payments,
      products: purchase.cart,
      type: purchase.type,
      order_no: `Purchase # ${purchase_id}`,
      time_formated: date.formatDate(new Date(purchase_time), 'DD/MM/YYYY hh:mm A'),
      time: date.formatDate(new Date(purchase_time), 'hh:mm A'),
      date: date.formatDate(new Date(purchase_time), 'DD/MM/YYYY'),
    }).save()
    if (res) {
      return res
    }
  }
  getPurchase() {}
  getAllPurchases() {
    const orders = this.Purchase.find()
    const transformedPurchases = orders.map((purchase) => {
      const paymentsString = purchase.payments
        .map((payment) => `${payment.payment_method}: ${payment.payment_amount}`)
        .join(' | ')

      const productsString = purchase.products
        .map((product) =>
          Object.entries(product)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' ,'),
        )
        .join(' | ')

      return {
        ...purchase,
        payments_string: paymentsString,
        products_string: productsString,
        price: parseFloat(purchase.price),
      }
    })

    return transformedPurchases
  }
  removePurchase(purchase) {
    return this.Purchase.remove({ _id: purchase._id })
  }
  getLatestPurchaseId() {
    let id = 1
    const lastPurchase = this.Purchase.findOne({}, { sort: { purchase_id: -1 } })
    if (lastPurchase) {
      id = lastPurchase.purchase_id + 1
    }
    return id
  }
  getPurchasesTotal(payment_type = null) {
    const orders = this.Purchase.find()

    const total = orders.reduce((sum, purchase) => {
      const payments = payment_type
        ? purchase.payments.filter((p) => p.payment_method === payment_type)
        : purchase.payments
      const orderTotal = payments.reduce(
        (orderSum, payment) => orderSum + payment.payment_amount,
        0,
      )
      return sum + orderTotal
    }, 0)

    return total
  }
  getPurchasesTotalPayment() {
    const orders = this.Purchase.find()

    // Use a Map to accumulate totals for each payment method
    const paymentTotals = new Map()

    orders.forEach((purchase) => {
      purchase.payments.forEach((payment) => {
        const { payment_method, payment_amount } = payment

        // If the payment method already exists in the Map, add to its total
        if (paymentTotals.has(payment_method)) {
          paymentTotals.set(payment_method, paymentTotals.get(payment_method) + payment_amount)
        } else {
          // Otherwise, initialize the payment method in the Map
          paymentTotals.set(payment_method, payment_amount)
        }
      })
    })

    // Convert the Map to an array of objects
    const result = Array.from(paymentTotals).map(([method, total]) => ({
      payment_method: method,
      total_amount: total,
    }))

    return result
  }
}

export default new PurchaseDB()
