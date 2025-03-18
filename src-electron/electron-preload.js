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

import { contextBridge } from 'electron'
import Shop from '../src/db/Shop'
import GenProduct from '../src/db/GenProduct'
import Service from '../src/db/Service'
import Product from '../src/db/Product'

import Till from '../src/db/Till'
import Order from '../src/db/Order'
import Purchase from '../src/db/Purchase'
import Workshop from '../src/db/Workshop'
import Report from '../src/db/Report'

contextBridge.exposeInMainWorld('posApi', {
  /**
   * Shop Related
   */
  updateShop: (shop) => Shop.updateShop(shop),
  getShop: () => Shop.getShop(),

  /**
   * Till Related
   */

  openTill: (till) => Till.openTill(till),
  getTill: () => Till.getTill(),
  updateTill: (till) => Till.updateTill(till),
  getTillTotal: () => Till.getTillTotal(), //check

  /**
   * General Products Related
   */
  createGenProduct: (pr) => GenProduct.createGenProduct(pr),
  updateGenProduct: (pr) => GenProduct.updateGenProduct(pr),
  getGenProducts: () => GenProduct.getGenProducts(),
  removeGenProduct: (pr) => GenProduct.removeGenProduct(pr),
  findGenProduct: () => GenProduct.removeGenProduct(),

  /**
   * Services Related
   */
  createService: (sr) => Service.createService(sr),
  updateService: (sr) => Service.updateService(sr),
  getServices: () => Service.getServices(),
  removeService: (sr) => Service.removeService(sr),
  findService: () => Service.removeService(),

  /**
   *
   * @param {Products} pr
   * @returns
   */
  createProduct: (pr) => Product.createProduct(pr),
  updateProduct: (pr) => Product.updateProduct(pr),
  getProducts: () => Product.getProducts(),
  removeProduct: (pr) => Product.removeProduct(pr),
  findProduct: () => Product.removeProduct(),

  /**
   * Orders Related
   */
  createOrder: (order) => Order.createOrder(order),
  getOrder: (order_id) => Order.getOrder(order_id),
  getAllOrders: () => Order.getAllOrders(),
  removeOrder: (order) => Order.removeOrder(order),
  getSalesTotal: (payment_type) => Order.getSalesTotal(payment_type),
  getSalesTotalPayment: () => Order.getSalesTotalPayment(),

  /**
   * Purchase Related
   */
  createPurchase: (purchase) => Purchase.createPurchase(purchase),
  getPurchase: (purchase_id) => Purchase.getPurchase(purchase_id),
  getAllPurchases: () => Purchase.getAllPurchases(),
  removePurchase: (purchase) => Purchase.removePurchase(purchase),
  getPurchasesTotal: (payment_type) => Purchase.getPurchasesTotal(payment_type),
  getPurchasesTotalPayment: () => Purchase.getPurchasesTotalPayment(),

  /**
   * Workshop Related
   */
  createWorkshop: (workshop) => Workshop.createWorkshop(workshop),
  getWorkshop: (workshop_id) => Workshop.getWorkshop(workshop_id),
  getAllWorkshops: () => Workshop.getAllWorkshops(),
  removeWorkshop: (workshop) => Workshop.removeWorkshop(workshop),
  getWorkshopsTotal: (payment_type) => Workshop.getWorkshopsTotal(payment_type),
  getWorkshopsTotalPayment: () => Workshop.getWorkshopsTotalPayment(),

  /**
   * Reports Related
   */
  getSummary: () => Report.getSummary(),
  generateDaysheet: () => Report.generateDaysheet(),
  // closeDay: async () => {
  //   return await ipcRenderer.invoke('CloseDay')
  // },

  closeDay: () => Report.closeDay(),
})
