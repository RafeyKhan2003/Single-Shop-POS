// const ExcelJS = require('exceljs')
// const fs = require('fs')
import ExcelJS from 'exceljs'
// import fs from 'node:fs'
// Sample sales data
const salesData = [
  {
    order_index: 1,
    total_amount: 100,
    order_date: '2025-11-03 10:00AM',
    products: [
      { product_name: 'Product A', price: 50, quantity: 1 },
      { product_name: 'Product B', price: 50, quantity: 1 },
    ],
    payment_methods: { Cash: 100 },
  },
  {
    order_index: 2,
    total_amount: 200,
    order_date: '2025-11-04 02:30PM',
    products: [{ product_name: 'Product C', price: 100, quantity: 2 }],
    payment_methods: { 'Credit Card': 200 },
  },
]

async function createExcelFile() {
  const workbook = new ExcelJS.Workbook()

  // Create sheets
  const wsProducts = workbook.addWorksheet('Products')
  const wsPayments = workbook.addWorksheet('Payments')
  const wsInvoice = workbook.addWorksheet('Invoice')

  // === 1️⃣ PRODUCTS SHEET ===
  wsProducts.columns = [
    { header: 'Order Index', key: 'order_index', width: 15 },
    { header: 'Product Name', key: 'product_name', width: 20 },
    { header: 'Price', key: 'price', width: 10 },
    { header: 'Quantity', key: 'quantity', width: 10 },
    { header: 'Total Price', key: 'total_price', width: 15 },
  ]

  salesData.forEach((sale) => {
    sale.products.forEach((product) => {
      wsProducts.addRow({
        order_index: sale.order_index,
        product_name: product.product_name,
        price: product.price,
        quantity: product.quantity,
        total_price: product.price * product.quantity,
      })
    })
  })

  // === 2️⃣ PAYMENTS SHEET ===
  wsPayments.columns = [
    { header: 'Order Index', key: 'order_index', width: 15 },
    { header: 'Payment Method', key: 'payment_method', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
  ]

  salesData.forEach((sale) => {
    Object.entries(sale.payment_methods).forEach(([method, amount]) => {
      wsPayments.addRow({
        order_index: sale.order_index,
        payment_method: method,
        amount: amount,
      })
    })
  })

  // === 3️⃣ INVOICE SHEET ===
  wsInvoice.addRow(['Invoice for Order Index:'])
  wsInvoice.addRow(['Enter Order Index Here:', 1]) // User enters Order Index in B2
  wsInvoice.addRow([])

  wsInvoice.addRow(['Products:'])
  wsInvoice.addRow(['Product Name', 'Price', 'Quantity', 'Total Price'])

  // Use VLOOKUP to fetch data from Products sheet
  for (let i = 6; i <= 10; i++) {
    wsInvoice.addRow([
      `=VLOOKUP(B2, Products!A:E, 2, FALSE)`,
      `=VLOOKUP(B2, Products!A:E, 3, FALSE)`,
      `=VLOOKUP(B2, Products!A:E, 4, FALSE)`,
      `=VLOOKUP(B2, Products!A:E, 5, FALSE)`,
    ])
  }

  wsInvoice.addRow([])
  wsInvoice.addRow(['Payments:'])
  wsInvoice.addRow(['Payment Method', 'Amount'])

  // Use VLOOKUP to fetch data from Payments sheet
  wsInvoice.addRow([`=VLOOKUP(B2, Payments!A:C, 2, FALSE)`, `=VLOOKUP(B2, Payments!A:C, 3, FALSE)`])

  // Save the Excel file
  const filePath = 'Sales_Report.xlsx'
  await workbook.xlsx.writeFile(filePath)
  console.log(`✅ Excel file created: ${filePath}`)
}

createExcelFile()
