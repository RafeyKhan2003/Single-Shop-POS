<template>
  <q-card square class="full-width">
    <q-card-section>
      <div class="text-center q-ml-sm text-h5">All Orders</div>
      <div>
        <span v-for="p in payments" :key="p"
          >{{ p.payment_method }}: {{ $currency }}{{ p.total_amount }},
        </span>
      </div>
    </q-card-section>

    <q-card-section class="no-padding">
      <q-markup-table dense flat bordered square separator="cell">
        <thead>
          <tr class="text-bold bg-secondary text-white">
            <th class="text-left">Order Time</th>
            <th class="text-left">Order #</th>
            <th class="text-left">Total Amount</th>
            <th class="text-left">Payments</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o">
            <td @click="ViewSlip(o)" class="text-bold cursor-pointer">
              {{ o.time_formated }}
            </td>
            <td @click="ViewSlip(o)" class="text-bold cursor-pointer">{{ o.order_id }}</td>
            <td>{{ this.$currency }}{{ o.total_amount }}</td>
            <td>
              {{ o.payments.map((payment) => `${payment.payment_method}: ${payment.payment_amount}`)
              .join('<br />') }}
            </td>
            <td @click="$Print($PosSlip(o))" class="text-bold cursor-pointer text-center">
              <q-icon name="las la-print" color="blue-8" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
  <q-dialog v-model="modal">
    <!-- <q-card>
      <q-card-section> Testing </q-card-section>
    </q-card> -->
    <OrderSlip :order="currentOrder" />
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import OrderSlip from 'components/OrderSlip.vue'

export default defineComponent({
  name: 'OrdersList',
  components: {
    OrderSlip,
  },
  data() {
    return {
      orders: [],
      payments: [],
      modal: false,
      currentOrder: {},
    }
  },
  created() {
    this.orders = window.posApi.getAllOrders()
    this.payments = window.posApi.getSalesTotalPayment()
  },
  methods: {
    ViewSlip(order) {
      this.currentOrder = order
      this.modal = true
    },
  },
})
</script>
