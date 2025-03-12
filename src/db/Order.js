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
}

export default new OrderDB()
