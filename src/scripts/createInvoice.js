import fs from 'node:fs'

export function generateSalesHTML(shop, sales) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sales Report</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 0;
              background-color: #f8f9fa;
              font-size: 10px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              background: #fff;
          }
          th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
          }
          th {
              background-color: #343a40;
              color: white;
          }
          .bg-info {
              background-color: #17a2b8;
              color: white;
          }
          .bg-warning {
              background-color: #ffc107;
          }
      </style>
  </head>
  <body>
      <h2>${shop.name} - Sales Report</h2>
      ${(sales || [])
        .map(
          (sale) => `
          <table>
              <thead>
                  <tr>
                      <th>Reference/Invoice #</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Customer</th>
                      <th>Shop</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>${sale.order_no}</td>
                      <td>${sale.date}</td>
                      <td>${sale.time}</td>
                      <td>${sale.customer.name}</td>
                      <td>${shop.name}</td>
                  </tr>
                  <tr class="bg-info">
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Tax</th>
                      <th>Total</th>
                  </tr>
                  ${(sale.products || [])
                    .map(
                      (item) => `
                      <tr>
                          <td>${item.name}</td>
                          <td>${item.qty}</td>
                          <td>£${parseFloat(item.price).toFixed(2)}</td>
                          <td>£${parseFloat(item.vat).toFixed(2)}</td>
                          <td>£${parseFloat(item.total).toFixed(2)}</td>
                      </tr>
                  `,
                    )
                    .join('')}
                  ${(sale.services || [])
                    .map(
                      (item) => `
                      <tr>
                          <th>${item.name}</th>
                          <td>${item.qty}</td>
                          <td>£${parseFloat(item.price).toFixed(2)}</td>
                          <td>£${parseFloat(item.vat).toFixed(2)}</td>
                          <td>£${parseFloat(item.total).toFixed(2)}</td>
                      </tr>
                  `,
                    )
                    .join('')}
                  <tr>
                      <td colspan="3"></td>
                      <th>Sub Total</th>
                      <td class="bg-warning">£${parseFloat(sale.sub_total).toFixed(2)}</td>
                  </tr>
                  <tr>
                      <td colspan="3"></td>
                      <th>Tax</th>
                      <td class="bg-warning">£${parseFloat(sale.total_vat).toFixed(2)}</td>
                  </tr>
                  <tr>
                      <td colspan="3"></td>
                      <th>Total Amount</th>
                      <td class="bg-warning">£${parseFloat(sale.total_amount).toFixed(2)}</td>
                  </tr>
                   ${sale.payments
                     .map(
                       (item) => `
                   <tr>
                      <td colspan="3"></td>
                      <th>${item.payment_method}</th>
                      <td class="bg-warning">£${item.payment_amount.toFixed(2)} ${item.voucher_number ? `(${item.voucher_number})` : ''}</td>
                  </tr>
                  `,
                     )
                     .join('')}

              </tbody>
          </table>
      `,
        )
        .join('')}
  </body>
  </html>`
}

export function CreateSalesPdfFile(shop, sales, filePath) {
  console.log('CreateSalesPdfFile')
  return new Promise((resolve, reject) => {
    if (!sales.length) {
      console.warn('Not enough sales')
      reject('Not enough sales')
    }
    const html = generateSalesHTML(shop, sales)
    fs.writeFile(filePath + '.html', html, 'utf8', (err) => {
      if (err) {
        console.error('Error saving HTML file:', err)
        reject(err)
      } else {
        console.log(`HTML file saved at: ${filePath}`)
        resolve(filePath)
      }
    })
  })
}
