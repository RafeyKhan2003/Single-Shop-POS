import { Schema, suffix } from './db'
import { date } from 'quasar'

class WorkshopDB {
  constructor() {
    this.Workshop = Schema(`Workshops${suffix}`, {
      workshop_id: { type: Number },
      workshop_time: { type: String },
      customer: { type: Object },
      total_amount: { type: Number, default: 0 },
      products: { type: Array },
      services: { type: Array },
      payments: { type: Array },
      time_formated: { type: String },
      date: { type: String },
      time: { type: String },
      order_no: { type: String },
      total_vat: { type: Number, default: 0 },
      sub_total: { type: Number },
    })

    this.WorkshopDraft = Schema(`WorkshopDraft${suffix}`, {
      draft_id: { type: Number, default: 1 },
      cart: { type: Array },
      customer: { type: Object },
      updated_at: { type: String },
    })
  }
  createWorkshop(workshop) {
    console.log('backend', workshop)
    let workshop_id = this.getLatestWorkshopId()
    const total_amount = (workshop.cart || []).reduce((sum, item) => sum + item.price * item.qty, 0)
    let total_vat = 0

    const products = workshop.cart
      .filter((p) => p.product_type === 'Product')
      .map((p) => {
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

    const services = workshop.cart
      .filter((p) => p.product_type === 'Service')
      .map((p) => {
        let price_without_vat = parseFloat(p.price)
        let vat = 0

        price_without_vat = parseFloat((p.price / (1 + 0.2)).toFixed(2))
        vat = parseFloat((p.price - price_without_vat).toFixed(2))
        total_vat += vat * p.qty

        return {
          ...p,
          price_without_vat,
          vat,
          total: p.price * p.qty,
        }
      })

    const workshop_time = date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
    const res = this.Workshop.create({
      workshop_id: workshop_id,
      workshop_time: workshop_time,
      total_amount: total_amount,
      customer: workshop.customer || {},
      payments: workshop.payments,
      products: products,
      services: services,

      time_formated: date.formatDate(new Date(workshop_time), 'DD/MM/YYYY hh:mm A'),
      time: date.formatDate(new Date(workshop_time), 'hh:mm A'),
      date: date.formatDate(new Date(workshop_time), 'DD/MM/YYYY'),

      order_no: `Workshop # ${workshop_id}`,
      total_vat: total_vat,
      sub_total: total_amount - total_vat,
    }).save()
    if (res) {
      return res
    }
  }
  getWorkshop() {}
  getAllWorkshops() {
    return this.Workshop.find()
  }

  removeWorkshop(workshop) {
    return this.Workshop.remove({ _id: workshop._id })
  }
  getLatestWorkshopId() {
    let id = 1
    const lastWorkshop = this.Workshop.findOne({}, { sort: { workshop_id: -1 } })
    if (lastWorkshop) {
      id = lastWorkshop.workshop_id + 1
    }
    return id
  }
  autoSaveWorkshopDraft(data) {
    try {
      const existing = this.WorkshopDraft.findOne({ draft_id: 1 })
      const draftData = {
        draft_id: 1,
        cart: data.cart || [],
        customer: data.customer || {},
        updated_at: new Date().toISOString(),
      }
      if (existing) {
        Object.assign(existing, draftData)
        existing.save()
      } else {
        this.WorkshopDraft.create(draftData).save()
      }
      return true
    } catch (e) {
      console.error('autoSaveWorkshopDraft error:', e)
      return false
    }
  }
  getWorkshopDraft() {
    return this.WorkshopDraft.findOne({ draft_id: 1 }) || null
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
