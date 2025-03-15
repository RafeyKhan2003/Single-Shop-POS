import { Schema, suffix } from './db'
import { date } from 'quasar'

class WorkshopDB {
  constructor() {
    this.Workshop = Schema(`Workshops${suffix}`, {
      workshop_id: { type: Number },
      workshop_time: { type: String },
      customer: { type: Object },
      total_amount: { type: Number },
      products: { type: Array },
      services: { type: Array },
      payments: { type: Array },
    })
  }
  createWorkshop(workshop) {
    console.log('backend', workshop)
    let workshop_id = this.getLatestWorkshopId()
    const total_amount = (workshop.cart || []).reduce((sum, item) => sum + item.price * item.qty, 0)

    const res = this.Workshop.create({
      workshop_id: workshop_id,
      workshop_time: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A'),
      total_amount: total_amount,
      customer: workshop.customer || {},
      payments: workshop.payments,
      products: workshop.cart.filter((p) => p.product_type === 'Product'),
      services: workshop.cart.filter((p) => p.product_type === 'Service'),
    }).save()
    if (res) {
      return res
    }
  }
  getWorkshop() {}
  getAllWorkshops() {
    const orders = this.Workshop.find()
    const transformedWorkshops = orders.map((workshop) => {
      const paymentsString = workshop.payments
        .map((payment) => `${payment.payment_method}: ${payment.payment_amount}`)
        .join(' | ')

      const productsString = workshop.products
        .map((product) =>
          Object.entries(product)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' ,'),
        )
        .join(' | ')

      return {
        ...workshop,
        payments_string: paymentsString,
        products_string: productsString,
        price: parseFloat(workshop.price),
        workshop_time_formated: date.formatDate(
          new Date(workshop.workshop_time),
          'DD/MM/YYYY hh:mm A',
        ),
      }
    })

    return transformedWorkshops
  }
  removeWorkshop(workshop) {
    console.log(workshop)
  }
  getLatestWorkshopId() {
    let id = 1
    const lastWorkshop = this.Workshop.findOne({}, { sort: { workshop_id: -1 } })
    if (lastWorkshop) {
      id = lastWorkshop.workshop_id + 1
    }
    return id
  }
  getWorkshopsTotal(payment_type = null) {
    const orders = this.Workshop.find()

    const total = orders.reduce((sum, workshop) => {
      const payments = payment_type
        ? workshop.payments.filter((p) => p.payment_method === payment_type)
        : workshop.payments
      const orderTotal = payments.reduce(
        (orderSum, payment) => orderSum + payment.payment_amount,
        0,
      )
      return sum + orderTotal
    }, 0)

    return total
  }
  getWorkshopsTotalPayment() {
    const orders = this.Workshop.find()

    // Use a Map to accumulate totals for each payment method
    const paymentTotals = new Map()

    orders.forEach((workshop) => {
      workshop.payments.forEach((payment) => {
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

export default new WorkshopDB()
