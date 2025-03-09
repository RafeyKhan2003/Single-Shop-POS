// import path from 'node:path'
// import fs from 'node:fs'
// import { fileURLToPath } from 'node:url'
import { contextBridge } from 'electron'
import dbLocal from 'db-local'
// const dbLocal = require('db-local')

// const currentDir = fileURLToPath(new URL('.', import.meta.url))

/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

let date = new Date()
date = date.toISOString().split('T')[0]

const suffix = `-temp-${date}`

const { Schema } = new dbLocal({ path: './databases' })

const Shop = Schema(`Shop`, {
  name: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
})

const GenProduct = Schema(`GenProducts`, {
  name: { type: String },
  type: { type: String, default: 'Parts' },
  condition: { type: String, default: 'New' },
})

const existingGenProducts = GenProduct.find()
if (!existingGenProducts.length) {
  ;[
    { name: 'Bike', type: 'Bike', condition: 'New' },
    { name: 'Bike', type: 'Bike', condition: 'Used' },
    { name: 'Helmet', type: 'Helmet', condition: 'New' },
    { name: 'Helmet', type: 'Helmet', condition: 'Used' },
    { name: 'Part', type: 'Parts', condition: 'New' },
    { name: 'Part', type: 'Parts', condition: 'Used' },
  ].forEach((p) => GenProduct.create(p).save())
}

const Product = Schema(`Products`, {
  name: { type: String },
  username: { type: String },
  tag: { type: String },
})

// const Sale = Schema(`Sales${suffix}`, {
//   name: { type: String },
//   username: { type: String },
//   tag: { type: String },
// })

const Till = Schema(`Till${suffix}`, {
  till_date: { type: String },
  opening_time: { type: Date },
  closing_time: { type: Date },
  opening_amount: { type: Number },
  closing_amount: { type: Number },
})

contextBridge.exposeInMainWorld('posApi', {
  /**
   * Shop Related
   */

  updateShop: (shop) => {
    console.log(shop)
    let s = Shop.findOne() || {}
    if (s.name) {
      s.update({
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        email: shop.email,
      }).save()
      return true
    }
    let sh = Shop.create({
      name: shop.name,
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
    }).save()

    if (sh) {
      return true
    }
  },
  getShop: () => {
    return Shop.findOne() || {}
  },

  /**
   * Till Related
   */

  openTill: (till) => {
    const t = Till.create({
      till_date: date,
      opening_time: new Date().toDateString(),
      closing_time: '',
      opening_amount: till.opening_amount,
      closing_amount: 0,
    }).save()
    if (t) return true
  },
  getTill: () => {
    let till = Till.findOne() || {}
    if (till.till_date !== date) {
      return {}
    }
    return till
  },
  updateTill: (till) => {
    let t = Till.findOne() || {}
    t.update({
      closing_time: till.closing_time || '',
      closing_amount: till.closing_amount || 0,
    }).save()
    return true
  },

  /**
   * General Products Related
   */
  createGenProduct: async (product) => {
    const pr = GenProduct.create({
      name: product.name,
      type: product.type,
      condition: product.condition,
    }).save()
    if (pr) return true
  },
  updateGenProduct: (pr) => {
    const product = GenProduct.findOne({ _id: pr._id })
    if (!product) return false
    product
      .update({
        name: pr.name,
        type: pr.type,
        condition: pr.condition,
      })
      .save()

    return true
  },
  getGenProducts: () => {
    return GenProduct.find()
  },
  removeGenProduct: (pr) => {
    return GenProduct.remove({ _id: pr._id })
  },
  findGenProduct: () => {},

  createProduct: async () => {
    const user = Product.create({
      // _id: 1,
      username: 'Lennart',
      tag: 'Lennart#123',
      bag: { weapons: ['bow', 'katana'] },
    }).save()

    user.save()
    console.log(user)

    console.log('wokirg')
  },
  updateProduct: () => {},
  removeProduct: () => {},
  findProduct: () => {},
  // createProduct: () => {},
  // createProduct: () => {},
  // createProduct: () => {},
  // createProduct: () => {},
})
