import { Schema, suffix } from './db'

class OrderDB {
  constructor() {
    this.Order = Schema(`Orders${suffix}`, {
      order_id: { type: Number },
      order_time: { type: String },
      total_amount: { type: Number },
      products: { type: Array },
      payments: { type: Array },
      part_ex_products: { type: Array },
    })
  }
  createOrder(order) {
    console.log('backend', order)
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
    const res = this.Order.create({
      order_id: order_id,
      order_time: new Date().toDateString(),
      total_amount: total_amount,
      part_ex_products: part_ex_products,
      payments: order.payments,
      products: order.cart,
    }).save()
    if (res) {
      return res
    }
  }
  getOrder() {}
  getAllOrders() {
    const orders = this.Order.find()
    const transformedOrders = orders.map((order) => {
      const paymentsString = order.payments
        .map((payment) => `${payment.payment_method}: ${payment.payment_amount}`)
        .join(' | ')
      return {
        ...order,
        payments_string: paymentsString,
        price: parseFloat(order.price),
      }
    })

    return transformedOrders
  }
  removeOrder(order) {
    console.log(order)
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
