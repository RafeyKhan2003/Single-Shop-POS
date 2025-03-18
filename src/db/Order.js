import { Schema, suffix } from './db'
import { date } from 'quasar'

class OrderDB {
  constructor() {
    this.Order = Schema(`Orders${suffix}`, {
      order_id: { type: Number },
      order_time: { type: String },
      total_amount: { type: Number },
      customer: { type: Object },
      products: { type: Array },
      payments: { type: Array },
      part_ex_products: { type: Array },
      time_formated: { type: String },
      date: { type: String },
      time: { type: String },
      order_no: { type: String },
      total_vat: { type: Number },
      sub_total: { type: Number },
    })
  }
  createOrder(order) {
    console.log('backend', order)
    let total_vat = 0

    let order_id = this.getLatestOrderId()
    const total_amount = (order.cart || []).reduce((sum, item) => sum + item.price * item.qty, 0)

    const part_ex_products = []
    ;(order.payments || []).forEach((p) => {
      if (p.payment_method === 'Part Ex') {
        part_ex_products.push({
          product_name: p.part_ex_product,
          amount: p.payment_amount,
        })
      }
    })

    const products = order.cart.map((p) => {
      let price_without_vat = parseFloat(p.price)
      let vat = 0

      if (p.type != 'Helmet' && !(p.type == 'Bike' && p.condition == 'Used')) {
        price_without_vat = parseFloat((p.price / (1 + 0.2)).toFixed(2))
        vat = parseFloat((p.price - price_without_vat).toFixed(2))
        total_vat += vat * p.qty
      }
      return {
        ...p,
        price_without_vat,
        vat,
        total: p.price * p.qty,
      }
    })
    const order_time = date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
    const res = this.Order.create({
      order_id: order_id,
      order_time: order_time,
      total_amount: total_amount,
      part_ex_products: part_ex_products,
      customer: order.customer || {},
      payments: order.payments,
      products: products,
      time_formated: date.formatDate(new Date(order_time), 'DD/MM/YYYY hh:mm A'),
      time: date.formatDate(new Date(order_time), 'hh:mm A'),
      date: date.formatDate(new Date(order_time), 'DD/MM/YYYY'),
      order_no: `Sale Order # ${order_id}`,
      total_vat: total_vat,
      sub_total: total_amount - total_vat,
    }).save()
    if (res) {
      return res
    }
  }
  getOrder() {}
  getAllOrders() {
    return this.Order.find()
  }

  removeOrder(order) {
    return this.Order.remove({ _id: order._id })
  }
  getLatestOrderId() {
    let id = 1
    const lastOrder = this.Order.findOne({}, { sort: { order_id: -1 } })
    if (lastOrder) {
      id = lastOrder.order_id + 1
    }
    return id
  }
  getSalesTotal(payment_type = null) {
    const orders = this.Order.find()

    const total = orders.reduce((sum, order) => {
      const payments = payment_type
        ? order.payments.filter((p) => p.payment_method === payment_type)
        : order.payments
      const orderTotal = payments.reduce(
        (orderSum, payment) => orderSum + payment.payment_amount,
        0,
      )
      return sum + orderTotal
    }, 0)

    return total
  }
  getSalesTotalPayment() {
    const orders = this.Order.find()

    // Use a Map to accumulate totals for each payment method
    const paymentTotals = new Map()

    orders.forEach((order) => {
      order.payments.forEach((payment) => {
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

export default new OrderDB()
