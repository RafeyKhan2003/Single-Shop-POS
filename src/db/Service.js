import { Schema } from './db'

class ServiceDB {
  constructor() {
    this.Service = Schema(`Services`, {
      name: { type: String },
      price: { type: Number },
    })

    const existingServices = this.Service.find()
    if (!existingServices.length) {
      ;[
        { name: 'Standard Service', price: 40 },
        { name: 'General Service', price: 60 },
        { name: 'Full Bike Service', price: 80 },
        { name: 'Brake Service (Per Brake)', price: 10 },
        { name: 'Hydraulic Brake Service', price: 25 },
        { name: 'Gear Service (Per derailleur)', price: 10 },
        { name: 'Headset Fit/Service', price: 20 },
        { name: 'Bottom Bracket Service', price: 20 },
        { name: 'Wheel Axle Service (Front)', price: 15 },
        { name: 'Wheel Axle Service (Rear)', price: 21 },
      ].forEach((p) => this.Service.create(p).save())
    }
  }

  async createService(service) {
    return this.Service.create({
      name: service.name,
      price: service.price,
    }).save()
  }
  updateService(sr) {
    const service = this.Service.findOne({ _id: sr._id })
    if (!service) return false
    service
      .update({
        name: sr.name,
        price: sr.price,
      })
      .save()

    return true
  }
  getServices() {
    return this.Service.find().sort((a, b) => a.name.localeCompare(b.name))
  }
  removeService(service) {
    return this.Service.remove({ _id: service._id })
  }
  findService() {}
}

export default new ServiceDB()
