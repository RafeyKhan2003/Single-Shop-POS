import fs from 'node:fs'

function generateHtml(report) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${report.shop_name} Daysheet - ${report.date}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          font-size: 10px;
        }
          .divsplit{
            width:40%;
            padding: 10px;
            display: inline-block;
            vertical-align: text-top;
          }
        h1 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #000;
          padding: 3px;
          text-align: left;
        }
        th {
          background-color: #000;
          color: #fff;
          font-weight: bold;
        }
        .text-center {
          text-align: center;
        }
        .text-bold {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>${report.shop_name} Daysheet</h1>

      <!-- Daysheet Table -->
      <div>
      <div class='divsplit'>
      <table>
        <thead>
          <tr>
            <th colspan="2">Daysheet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Date</td>
            <td>${report.date}</td>
          </tr>
          <tr>
            <td>Day</td>
            <td>${new Date(report.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
          </tr>
          <tr>
            <td class="text-bold">TS</td>
            <td class="text-center">${report.total_sales}</td>
          </tr>
          <tr>
            <td class="text-bold">Bank Transfer</td>
            <td class="text-center">${report.total_bank}</td>
          </tr>
          <tr>
            <td class="text-bold">C4 Refund</td>
            <td class="text-center">${report.cash_refund}</td>
          </tr>
          <tr>
            <td class="text-bold">C3 Refund</td>
            <td class="text-center">${report.card_refund}</td>
          </tr>
          <tr>
            <td class="text-bold">Part Ex</td>
            <td class="text-center">${report.total_part_ex}</td>
          </tr>
          <tr>
            <td class="text-bold">Paypal</td>
            <td class="text-center">${report.total_paypal}</td>
          </tr>
          <tr>
            <td class="text-bold">Workshop</td>
            <td class="text-center">${report.service_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Cycle Scheme</td>
            <td class="text-center">${report.total_cyclescheme}</td>
          </tr>
          <tr>
            <td class="text-bold">Net Sales</td>
            <td class="text-center">${report.net_sales}</td>
          </tr>
          <tr>
            <td class="text-bold">C3</td>
            <td class="text-center">${report.card_sales}</td>
          </tr>
          <tr>
            <td class="text-bold">C4</td>
            <td class="text-center">${report.cash_sales}</td>
          </tr>
          <tr>
            <td class="text-bold">Env Amt</td>
            <td class="text-center"></td>
          </tr>
          <tr>
            <td class="text-bold">Less/Excess</td>
            <td class="text-center"></td>
          </tr>
          <tr>
            <td class="text-bold">C4 Purchases & Other Exp</td>
            <td class="text-center">${report.cash_expense}</td>
          </tr>
        </tbody>
      </table>

      <!-- Sales Break Down Table -->
      <table>
        <thead>
          <tr>
            <th colspan="2">Sales Break Down</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-bold">Services</td>
            <td class="text-center">${report.service_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Parts New</td>
            <td class="text-center">${report.parts_new_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Parts SH</td>
            <td class="text-center">${report.parts_used_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Cycle New</td>
            <td class="text-center">${report.bikes_new_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Cycle SH</td>
            <td class="text-center">${report.bikes_used_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Accessories New</td>
            <td class="text-center">${report.accessories_new_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Accessories SH</td>
            <td class="text-center">${report.accessories_used_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Helmets New</td>
            <td class="text-center">${report.helmets_new_total}</td>
          </tr>
          <tr>
            <td class="text-bold">Helmets SH</td>
            <td class="text-center">${report.helmets_used_total}</td>
          </tr>
          <tr>
            <td class="text-bold">TS</td>
            <td class="text-center">${report.total_sales}</td>
          </tr>
        </tbody>
      </table>

      <!-- Bike Details Table -->
      <table>
        <thead>
          <tr>
            <th colspan="3">Bike Details</th>
          </tr>
          <tr>
            <th></th>
            <th>New</th>
            <th>SH</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-bold">Bike CP</td>
            <td class="text-center"></td>
            <td class="text-center">${report.bike_purchase_count}</td>
          </tr>
          <tr>
            <td class="text-bold">Bikes Sold</td>
            <td class="text-center">${report.new_bike_sold_count}</td>
            <td class="text-center">${report.used_bike_sold_count}</td>
          </tr>
          <tr>
            <td class="text-bold">Bikes Deposits</td>
            <td class="text-center"></td>
            <td class="text-center"></td>
          </tr>
          <tr>
            <td class="text-bold">Bikes Produced</td>
            <td class="text-center"></td>
            <td class="text-center"></td>
          </tr>
          <tr>
            <td class="text-bold">Production Cost</td>
            <td class="text-center"></td>
            <td class="text-center"></td>
          </tr>
          <tr>
            <td class="text-bold">Bikes Services</td>
            <td class="text-center"></td>
            <td class="text-center"></td>
          </tr>
        </tbody>
      </table>
      </div>

      <div class='divsplit'>
      <!-- Sold Bikes Table -->
      <table>
        <thead>
          <tr>
            <th colspan="6">Sold Bikes</th>
          </tr>
          <tr>
            <th>No.</th>
            <th>Bikes</th>
            <th>Sale Price</th>
            <th>New/SH</th>
            <th>Quantity</th>
            <th>Deposits Full Pay/Description</th>
          </tr>
        </thead>
        <tbody>
          ${report.sold_bikes
            .map(
              (bike, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${bike.name}</td>
              <td>${bike.price}</td>
              <td>${bike.condition}</td>
              <td>${bike.qty}</td>
              <td></td>
            </tr>
          `,
            )
            .join('')}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
        </tbody>
      </table>

      <!-- Other C4 Outflow Table -->
      <table>
        <thead>
          <tr>
            <th colspan="4">Other C4 Outflow(D)</th>
          </tr>
          <tr>
            <th>No.</th>
            <th>Detail/Name</th>
            <th>Amount</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${report.outflows
            .map(
              (outflow, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${outflow.name}</td>
              <td>${outflow.qty * outflow.price}</td>
              <td>${outflow.purchase_type}</td>
            </tr>
          `,
            )
            .join('')}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

        </tbody>
      </table>

      <!-- Till Closing Amount Table -->
      <table>
        <thead>
          <tr>
            <th colspan="2">Till Closing Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-bold">Total C4</td>
            <td class="text-center">${report.total_cash}</td>
          </tr>
          <tr>
            <td class="text-bold">Opening Amount</td>
            <td class="text-center">${report.opening_amount}</td>
          </tr>
          <tr>
            <td class="text-bold">Today's Available C4</td>
            <td class="text-center">${report.available_cash}</td>
          </tr>
          <tr>
            <td class="text-bold">Remaining Balance in Till</td>
            <td class="text-center">${report.available_cash}</td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
    </body>
    </html>
  `
}
export async function CreatePdfFile(report, filePath) {
  const html = generateHtml(report)

  // pdf.create(html).toFile(filePath, (err, res) => {
  //   if (err) {
  //     reject(err) // Reject on error
  //   } else {
  //     resolve(res.filename) // Resolve with file path
  //   }
  // })
  // const container = document.createElement('div')
  // container.innerHTML = html
  // container.style.position = 'absolute'
  // container.style.left = '-9999px' // Hide it off-screen
  // document.body.appendChild(container)

  // try {
  //   // Convert HTML to canvas
  //   html2canvas(container, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png')

  //     // Initialize jsPDF
  //     const pdf = new jsPDF('p', 'mm', 'a4')
  //     const imgWidth = 210 // A4 width in mm
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width

  //     pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  //     pdf.save(filePath)
  //   })

  //   console.log(`PDF saved as ${filePath}`)
  // } catch (error) {
  //   console.error('Error generating PDF:', error)
  // } finally {
  //   // Remove the temporary container
  //   document.body.removeChild(container)
  //   resolve(true)
  // }
  return new Promise((resolve) => {
    fs.writeFile(filePath + '.html', html, 'utf8', (err) => {
      if (err) {
        console.error('Error saving HTML file:', err)
        resolve(err)
      } else {
        console.log(`HTML file saved at: ${filePath}`)
        resolve(filePath)
      }
    })
  })
}
