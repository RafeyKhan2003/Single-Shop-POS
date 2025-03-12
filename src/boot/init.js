import { boot } from 'quasar/wrappers'
import { PosSlip } from '../scripts/posSlip'

let currency = '£'

function Print(html, callback, page_size = 'height=600,width=800') {
  const printWindow = window.open('', '', page_size)
  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print</title>
    <style>
     body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            width: 80mm;
            /* Standard POS slip width */
            margin: 0 auto;
            padding: 10px;
            border: 1px solid #000;
        }

    </style>
  </head>
  <body>
  `)
  printWindow.document.write(html)
  printWindow.document.write(`</body>
</html>`)
  printWindow.document.close()

  printWindow.onafterprint = () => {
    if (callback && typeof callback === 'function') {
      callback()
    }
    printWindow.close()
  }

  printWindow.print()
}

const shop = window.posApi.getShop()

export default boot(({ app }) => {
  app.config.globalProperties.$currency = currency
  app.config.globalProperties.$Print = Print
  app.config.globalProperties.$PosSlip = PosSlip

  app.config.globalProperties.$shop = shop

  app.config.globalProperties.$product_types = ['Bike', 'Helmet', 'Parts', 'Accessories']
  app.config.globalProperties.$payment_methods = [
    'Cash',
    'Card',
    'Part Ex',
    'Voucher',
    'CycleScheme',
  ]
  app.config.globalProperties.$voucher_methods = ['Voucher', 'CycleScheme']
})

export { currency, shop }
