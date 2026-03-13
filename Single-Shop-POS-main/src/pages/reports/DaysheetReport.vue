<template>
  <div class="q-pa-md text-h6 text-bold text-center">
    <q-btn square stack color="secondary" class="" @click="CloseDay"> Close Day </q-btn>
  </div>

  <div class="q-pa-md text-h6 text-bold text-center bg-grey-3">{{ report.shop_name }} Daysheet</div>

  <div class="row q-mt-sm">
    <!-- Left Column for Tables -->
    <div class="col-5">
      <q-markup-table dense flat bordered square separator="cell" class="q-mb-md">
        <tbody>
          <tr class="text-bold bg-secondary text-white">
            <td class="text-center" colspan="2">Daysheet</td>
          </tr>
          <tr class="text-bold">
            <td class="text-left">{{ date.formatDate(report.date, 'D MMMM, YYYY') }}</td>
            <td class="text-center">{{ date.formatDate(report.date, 'dddd') }}</td>
          </tr>
          <tr>
            <td class="text-bold">TS</td>
            <td class="text-center">{{ $currency }}{{ report.total_sales.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">Bank Transfer</td>
            <td class="text-center">{{ $currency }}{{ report.total_bank.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">C4 Refund</td>
            <td class="text-center">{{ $currency }}{{ report.cash_refund.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">C3 Refund</td>
            <td class="text-center">{{ $currency }}{{ report.card_refund.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">Part Ex</td>
            <td class="text-center">{{ $currency }}{{ report.total_part_ex.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">Paypal</td>
            <td class="text-center">{{ $currency }}{{ report.total_paypal.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">Workshop</td>
            <td class="text-center">{{ $currency }}{{ report.service_total.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">Cycle Scheme</td>
            <td class="text-center">{{ $currency }}{{ report.total_cyclescheme.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">Net Sales</td>
            <td class="text-center">{{ $currency }}{{ report.net_sales.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">C3</td>
            <td class="text-center">{{ $currency }}{{ report.card_sales.toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-bold">C4</td>
            <td class="text-center">{{ $currency }}{{ report.cash_sales.toFixed(2) }}</td>
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
            <td class="text-center">{{ $currency }}{{ report.cash_expense.toFixed(2) }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-markup-table dense flat bordered square separator="cell" class="q-mb-md">
        <tbody>
          <tr>
            <td colspan="2" class="text-center text-bold bg-secondary text-white">
              Sales Break Down
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold"></td>
            <td style="width: 40%" class="text-center text-bold">Amount</td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Services</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.service_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Parts New</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.parts_new_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Parts SH</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.parts_used_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Cycle New</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.bikes_new_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Cycle SH</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.bikes_used_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Accessories New</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.accessories_new_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Accessories SH</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.accessories_used_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Helmets New</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.helmets_new_total.toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td style="width: 60%" class="text-bold">Helmets SH</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.helmets_used_total.toFixed(2) }}
            </td>
          </tr>

          <tr>
            <td style="width: 60%" class="text-bold">TS</td>
            <td style="width: 40%" class="text-center">
              {{ $currency }}{{ report.total_sales.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-markup-table dense flat bordered square separator="cell" class="q-mb-md">
        <tbody>
          <tr class="bg-secondary text-white">
            <td style="width: 60%"></td>
            <td class="text-bold text-center">New</td>
            <td class="text-bold text-center">SH</td>
          </tr>
          <tr>
            <td class="text-bold">Bike CP</td>
            <td class="text-center"></td>
            <td class="text-center">{{ report.bike_purchase_count }}</td>
          </tr>
          <tr>
            <td class="text-bold">Bikes Sold</td>
            <td class="text-center">{{ report.new_bike_sold_count }}</td>
            <td class="text-center">{{ report.used_bike_sold_count }}</td>
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
      </q-markup-table>
    </div>

    <!-- Right Column for Tables -->
    <div class="col-7 q-pl-md">
      <q-markup-table dense flat bordered square separator="cell" class="q-mb-md">
        <tbody>
          <tr class="bg-secondary text-white text-bold">
            <td>No.</td>
            <td>Bikes</td>
            <td>Sale Price</td>
            <td>New/SH</td>
            <td>Quantity</td>
            <td>
              Deposits Full <br />
              Pay/Description
            </td>
          </tr>
          <tr v-for="(b, i) in report.sold_bikes" :key="b">
            <td>{{ i + 1 }}</td>
            <td>{{ b.name }}</td>
            <td>{{ $currency }}{{ parseFloat(b.price).toFixed(2) }}</td>
            <td>{{ b.condition }}</td>
            <td>{{ b.qty }}</td>
            <td></td>
          </tr>
          <tr v-for="n of 2" :key="n">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-markup-table dense flat bordered square separator="cell" class="q-mb-md">
        <tbody>
          <tr>
            <td colspan="4" class="text-center bg-secondary text-white text-bold">
              Other C4 Outflow(D)
            </td>
          </tr>
          <tr class="text-bold">
            <td>No.</td>
            <td>Detail/Name</td>
            <td>Amount</td>
            <td>Notes</td>
          </tr>
          <tr v-for="(o, i) in report.outflows" :key="o">
            <td>{{ i + 1 }}</td>
            <td>{{ o.name }}</td>
            <td>{{ $currency }}{{ (o.qty * parseFloat(o.price)).toFixed(2) }}</td>
            <td>{{ o.purchase_type }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-markup-table dense flat bordered square separator="cell" class="q-mb-md">
        <tbody>
          <tr>
            <td colspan="2" class="text-center bg-secondary text-white text-bold">
              Till Closing Amount
            </td>
          </tr>
          <tr>
            <td class="text-bold text-center">Total C4</td>
            <td class="text-center">{{ $currency }}{{ report.total_cash }}</td>
          </tr>
          <tr>
            <td class="text-bold text-center">Opening Amount</td>
            <td class="text-center">{{ $currency }}{{ report.opening_amount }}</td>
          </tr>
          <tr>
            <td class="text-bold text-center">Today's Available C4</td>
            <td class="text-center">{{ $currency }}{{ report.available_cash }}</td>
          </tr>
          <tr>
            <td class="text-bold text-center">Remaining Balance in Till</td>
            <td class="text-center">{{ $currency }}{{ report.available_cash }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'DaysheetReport',
  data() {
    return {
      report: window.posApi.generateDaysheet(),
      date,
    }
  },
  created() {},
  methods: {
    async CloseDay() {
      this.$q.loading.show({
        message: 'Generating reports. Please wait...',
        boxClass: 'bg-grey-2 text-grey-9',
        spinnerColor: 'primary',
      })
      let res = await window.posApi.closeDay()
      this.$q.loading.hide()
      if (res) {
        this.$router.push({ name: 'menu' })
      }
    },
  },
})
</script>
