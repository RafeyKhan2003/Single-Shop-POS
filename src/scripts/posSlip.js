import { currency, shop } from '../boot/init'

export function PosSlip(order, order_type = 'Sale Order') {
  let data = `

    <style>


        .header {
            text-align: center;
            margin-bottom: 10px;
        }

        .shop-name {
            font-size: 16px;
            font-weight: bold;
        }

        .address,
        .contact {
            font-size: 10px;
            margin: 2px 0;
        }

        .divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .items-table th,
        .items-table td {
            padding: 5px;
            text-align: left;
        }

        .items-table th {
            border-bottom: 1px solid #000;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 10px;
        }

        @media print {
            body {
                width: 80mm;
                margin: 0;
                padding: 10px;
                border: none;
            }

            .no-print {
                display: none;
            }
        }
    </style>

    <div class="header">
        <div class="shop-name">${shop.name}</div>
        <div class="address">${shop.address}</div>
        <div class="contact">Phone: ${shop.phone} | Email: ${shop.email}</div>
    </div>
    <div class="divider"></div>
    <div class="cutomer">
      <div style="font-weight:bold;text-decoration:underline;">${order_type}</div>
    <div class="customer-name">Customer: ${(order.customer || {}).name || ''}</div>
        <div class="contact">Phone: ${(order.customer || {}).phone || ''} | Email: ${(order.customer || {}).email || ''}</div>
    </div>
    <table class="items-table">
        <thead>
         <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
             </thead>
        <tbody>
            `
  ;(order.products || []).forEach((p) => {
    console.log(p)
    data += `
           <tr>
                <td>${p.name} - ${p.condition}</td>
                <td>${p.qty}</td>
                <td>${currency}${parseFloat(p.price).toFixed(2)}</td>
                <td>${currency}${(parseFloat(p.price) * p.qty).toFixed(2)}</td>
            </tr>
          `
  })

  data += `
        </tbody>
    </table>

    <div class="divider"></div>
    <div class="total">
        <strong>Total: ${currency}${order.total_amount}</strong>
    </div>

    <div class="total" style="margin-top:5px;">
    <small>
        `
  ;(order.payments || []).forEach((p) => {
    data += `
           <strong>${p.payment_method}: ${currency}${p.payment_amount} ${p.voucher_number ? `(${p.voucher_number})` : ''}</strong><br />
          `
  })

  data += `
  </small></div>

    <div class="footer">
        <p>This is a computer-generated slip. No signature is required.</p>
        <p>Thank you for shopping with us!</p>
    </div>

  `

  return data
}
