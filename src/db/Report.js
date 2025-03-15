import { dbPath, suffix, date, reportsPath } from './db'
import fs from 'node:fs'
import path from 'node:path'
// import { date } from 'quasar'
import Till from './Till'
import Order from './Order'
import Purchase from './Purchase'
import Workshop from './Workshop'
import Shop from './Shop'

import { CreatePdfFile } from '../scripts/createDaysheetFile'
import { generateExcel } from '../scripts/createExcelFile'
import { CreateSalesPdfFile } from '../scripts/createInvoice'

import { SendReports } from '../scripts/mailer'

class ReportDB {
  constructor() {
    this.Report = {}
    /**
     * Check and delete previous files.
     */

    // const dbFolder = path.resolve(currentDir, 'databases')
    const deleteFiles = (folderPath) => {
      const till = Till.getTill() || { closing_time: '' }
      // Read all files in the directory
      if (!till.closing_time) {
        //TODO: Send email first and then proceed with delete
      }

      fs.readdir(folderPath, async (err, files) => {
        if (err) {
          console.error('Error reading the directory:', err)
          return
        }

        // Iterate over each file in the directory
        files.forEach((file) => {
          const filePath = path.join(folderPath, file)
          // console.log(filePath)
          // console.log('wokring ', file)
          // Check if the file matches the condition to be deleted
          if (filePath.includes('-temp-') && !filePath.includes(suffix)) {
            // Delete the file if it matches the condition
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting file:', filePath, err)
              } else {
                console.log(`Deleted: ${filePath}`)
              }
            })
          }
        })
      })
    }
    deleteFiles(dbPath)
  }

  getTotalSales(payment_method = null) {
    const salesTotal = Order.getSalesTotal(payment_method)
    const workshopTotal = Workshop.getWorkshopsTotal(payment_method)

    return salesTotal + workshopTotal
  }

  getTotalNetSales(payment_method = null) {
    const salesTotal = Order.getSalesTotal(payment_method)
    const purchaseTotal = Purchase.getPurchasesTotal(payment_method)
    const workshopTotal = Workshop.getWorkshopsTotal(payment_method)

    return salesTotal + workshopTotal - purchaseTotal
  }

  getSales(payment_method = null) {
    if (payment_method) {
      const Sales = Order.getAllOrders().filter((o) =>
        o.payments.includes((p) => p.payment_method === payment_method),
      )
      const Workshops = Workshop.getAllWorkshops().filter((o) =>
        o.payments.includes((p) => p.payment_method === payment_method),
      )

      return Sales.concat(Workshops)
    }

    const Sales = Order.getAllOrders()
    const WorkshopSales = Workshop.getAllWorkshops()

    return Sales.concat(WorkshopSales)
  }

  getTotalSalesByTypeAndCondition(type = null, condition = null) {
    // Fetch all Workshops and Orders from db-local
    const workshops = Workshop.Workshop.find()
    const orders = Order.Order.find()

    return [...workshops, ...orders] // Merge both collections
      .map((entry) => entry.products) // Extract products array from each entry
      .flat() // Flatten into a single array
      .filter(
        (product) =>
          (type ? product.type === type : true) &&
          (condition ? product.condition === condition : true),
      )
      .reduce((sum, product) => sum + product.qty * product.price, 0) // Sum qty * price
  }

  getPurchases(type = null) {
    console.log(type)
    return Purchase.Purchase.find((p) => {
      return type ? p.type === type : true
    })
  }

  getPurchasesTotal(type = null, payment_method = null) {
    console.log(payment_method, type)
    return Purchase.Purchase.find((p) => (p.type ? p.type === type : true))
      .flatMap((p) => p.payments)
      .filter((pay) => (payment_method ? pay.payment_method === payment_method : true))
      .reduce((sum, pay) => sum + pay.payment_amount, 0)
  }

  getAllProductSold(type = null, condition = null) {
    const workshops = Workshop.Workshop.find() || []
    const orders = Order.Order.find() || []

    let products = workshops
      .map(
        (entry) =>
          entry.products?.map((p) => ({
            ...p,
            order_no: entry.order_no, // Fix: Use `entry`
            order_time: entry.order_time,
            order_id: entry.order_id,
            time_formated: entry.time_formated,
            order_type: 'Workshop',
          })) || [],
      )
      .flat()
      .filter(
        (product) =>
          (type ? product.type === type : true) &&
          (condition ? product.condition === condition : true),
      )

    return products.concat(
      orders
        .map(
          (entry) =>
            entry.products?.map((p) => ({
              ...p,
              order_no: entry.order_no, // Fix: Use `entry`
              order_time: entry.order_time,
              order_id: entry.order_id,
              time_formated: entry.time_formated,
              order_type: 'Sale Order',
            })) || [],
        )
        .flat()
        .filter(
          (product) =>
            (type ? product.type === type : true) &&
            (condition ? product.condition === condition : true),
        ),
    )
  }

  getAllProductPurchased(type = null) {
    // Get all purchases
    const purchases = Purchase.getAllPurchases() || [] // Ensure it's an array

    return purchases
      .map(
        (entry) =>
          entry.products?.map((p) => ({
            ...p,
            order_no: entry.order_no, // Fix: Use `entry` instead of undefined `o`
            order_time: entry.order_time,
            order_id: entry.order_id,
            time_formated: entry.time_formated,
            order_type: 'Purchase',
            purchase_type: entry.type,
          })) || [],
      )
      .flat()
      .filter((product) => {
        return type ? product.type === type : true
      })
  }

  getServicesTotal(payment_method = null) {
    return Workshop.getWorkshopsTotal(payment_method)
  }

  getAllServicesSold() {
    const workshops = Workshop.getAllWorkshops() || [] // Ensure it's an array
    let services = []

    workshops.forEach((o) => {
      if (!o.services || !Array.isArray(o.services)) return // Skip if services is undefined

      services = services.concat(
        o.services.map((p) => ({
          ...p,
          order_no: o.order_no || 'N/A',
          order_time: o.workshop_time || 'N/A',
          order_id: o.workshop_id || 'N/A',
          time_formated: o.time_formated || 'N/A',
          order_type: 'Workshop',
        })),
      )
    })

    return services
  }

  generateDaysheet() {
    console.log('Daysheet')
    const shop = Shop.getShop()
    const report = {
      date: date,
      shop_name: shop.name,
      total_sales: this.getTotalSales(),
      total_bank: this.getTotalSales('Bank'),
      cash_refund: this.getPurchasesTotal('Refund', 'Cash'),
      card_refund: this.getPurchasesTotal('Refund', 'Card'),
      total_part_ex: this.getTotalSales('Part Ex'),
      total_paypal: this.getTotalSales('PayPal'),
      total_cyclescheme: this.getTotalSales('CycleScheme') + this.getTotalSales('Voucher'),
      net_sales: this.getTotalNetSales(),
      cash_sales: this.getTotalSales('Cash'),
      card_sales: this.getTotalSales('Card'),
      cash_expense: this.getPurchasesTotal(null, 'Cash'),
      //Sales Break Down
      service_total: this.getServicesTotal(),
      parts_new_total: this.getTotalSalesByTypeAndCondition('Parts', 'New'),
      parts_used_total: this.getTotalSalesByTypeAndCondition('Parts', 'Used'),
      bikes_new_total: this.getTotalSalesByTypeAndCondition('Bike', 'New'),
      bikes_used_total: this.getTotalSalesByTypeAndCondition('Bike', 'Used'),
      accessories_new_total: this.getTotalSalesByTypeAndCondition('Accessories', 'New'),
      accessories_used_total: this.getTotalSalesByTypeAndCondition('Accessories', 'Used'),
      helmets_new_total: this.getTotalSalesByTypeAndCondition('Helmet', 'New'),
      helmets_used_total: this.getTotalSalesByTypeAndCondition('Helmet', 'Used'),

      //Product Count
      bike_purchase_count: this.getAllProductPurchased('Bike').length,
      new_bike_sold_count: this.getAllProductSold('Bike', 'New').length,
      used_bike_sold_count: this.getAllProductSold('Bike', 'Used').length,

      //Bikes Sold
      sold_bikes: this.getAllProductSold('Bike'),
      bikes_sold_amount: this.getTotalSalesByTypeAndCondition('Bike'),

      //Outflows
      outflows: this.getAllProductPurchased(),

      //Daily Calculations
      opening_amount: Till.getOpeningAmount(),
      available_cash: Till.getTillTotal(),
    }

    report.total_cash = report.opening_amount + report.cash_sales + 0

    //TODO: envelope amount

    //TODO: Difference Adjustment

    return report
  }

  async closeDay() {
    const shop = Shop.getShop()
    //Generating Excel an pdf Reports new
    const daysheet = this.generateDaysheet()
    await CreatePdfFile(
      daysheet,
      reportsPath + `/${daysheet.shop_name}-daysheet-${daysheet.date}.pdf`,
    )

    await generateExcel(
      this.getAllServicesSold(),
      reportsPath + `/${daysheet.shop_name}-services-${daysheet.date}.xlxs`,
    )
    await generateExcel(
      this.getAllProductSold(),
      reportsPath + `/${daysheet.shop_name}-sales-products-${daysheet.date}.xlxs`,
    )
    await generateExcel(
      this.getAllProductPurchased('Petty Cash'),
      reportsPath + `/${daysheet.shop_name}-petty-cash-${daysheet.date}.xlxs`,
    )
    await generateExcel(
      this.getAllProductPurchased('Purchase'),
      reportsPath + `/${daysheet.shop_name}-purchases-products-${daysheet.date}.xlxs`,
    )
    await generateExcel(
      this.getAllProductPurchased('Refund'),
      reportsPath + `/${daysheet.shop_name}-refunds-${daysheet.date}.xlxs`,
    )

    await CreateSalesPdfFile(
      shop,
      this.getSales(),
      reportsPath + `/${daysheet.shop_name}-sales-invoices-${daysheet.date}.pdf`,
    )

    //Mailer to send reports
    await SendReports(daysheet.date)

    return true
  }
}

export default new ReportDB()
