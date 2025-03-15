import { currency, shop } from '../boot/init'

export function PosSlip(order, order_type = 'Sale Order') {
  const order_time = order.time_formated || order.time_formated || order.time_formated || ''

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
        .contact,
        .date-time {
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

        .total {
            font-size: 12px;
            font-weight: bold;
            text-align: right;
            margin-top: 5px;
        }

        .payments {
            font-size: 10px;
            margin-top: 5px;
            text-align: right;
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
        <div class="date-time"><strong>Date:</strong> ${order_time}</div>
    </div>

    <div class="divider"></div>

    <div class="customer">
      <div style="font-weight:bold;text-decoration:underline;">${order_type}: ${order.order_id || order.purchase_id || order.workshop_id || ''}</div>
      <div class="customer-name">Customer: ${(order.customer || {}).name || 'Walk-in'}</div>
      <div class="contact">Phone: ${(order.customer || {}).phone || ''} | Email: ${(order.customer || {}).email || ''}</div>
    </div>
            `

  const products = order.products || []
  if (products.length) {
    data += `
    <table class="items-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            `
    ;(order.products || []).forEach((p) => {
      data += `
                      <tr>
                          <td>${p.name} ${p.condition ? `(${p.condition})` : ''}</td>
                          <td>${p.qty}</td>
                          <td>${currency}${parseFloat(p.price).toFixed(2)}</td>
                          <td>${currency}${(parseFloat(p.price) * p.qty).toFixed(2)}</td>
                      </tr>
                    `
    })

    data += `
                  </tbody>
              </table>`
  }

  const services = order.services || []
  if (services.length) {
    data += `<table class="items-table">
        <thead>
            <tr>
                <th>Service</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            `
    ;(order.services || []).forEach((p) => {
      data += `
            <tr>
                <td>${p.name}</td>
                <td>${p.qty}</td>
                <td>${currency}${parseFloat(p.price).toFixed(2)}</td>
                <td>${currency}${(parseFloat(p.price) * p.qty).toFixed(2)}</td>
            </tr>
          `
    })

    data += `
              </tbody>
          </table>`
  }

  data += `<div class="divider"></div>

    <div class="total">Total: ${currency}${order.total_amount.toFixed(2)}</div>

    <div class="payments">
    `
  ;(order.payments || []).forEach((p) => {
    data += `
        <div><strong>${p.payment_method}:</strong> ${currency}${p.payment_amount.toFixed(2)} ${p.voucher_number ? `(<strong>Voucher:</strong> ${p.voucher_number})` : ''}</div>
    `
  })

  data += `
    </div>

    <div class="footer">
        <p>This is a computer-generated slip. No signature is required.</p>
        <p>Thank you for shopping with us!</p>
    </div>
  `

  return data
}
