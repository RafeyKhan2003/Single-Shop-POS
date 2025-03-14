<template>
  <q-card square class="full-width">
    <q-card-section>
      <div class="text-center q-ml-sm text-h5">All Purchases</div>
      <div>
        <span v-for="p in payments" :key="p"
          >{{ p.payment_method }}: {{ $currency }}{{ p.total_amount }},
        </span>
      </div>
    </q-card-section>

    <q-card-section class="no-padding">
      <q-markup-table dense flat bpurchaseed square separator="cell">
        <thead>
          <tr class="text-bold bg-secondary text-white">
            <th class="text-left">Purchase Time</th>
            <th class="text-left">Purchase #</th>
            <th class="text-left">Total Amount</th>
            <th class="text-left">Payments</th>
            <th class="text-left">Products</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in purchases" :key="o">
            <td @click="ViewSlip(o)" class="text-bold cursor-pointer">{{ o.purchase_time }}</td>
            <td @click="ViewSlip(o)" class="text-bold cursor-pointer">{{ o.purchase_id }}</td>
            <td>{{ this.$currency }}{{ o.total_amount }}</td>
            <td>{{ o.payments_string }}</td>
            <td>{{ o.products_string }}</td>
            <td
              @click="$Print($PosSlip(o, 'Purchase'))"
              class="text-bold cursor-pointer text-center"
            >
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
    <OrderSlip :purchase="currentOrder" />
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
      purchases: [],
      payments: [],
      modal: false,
      currentOrder: {},
    }
  },
  created() {
    this.purchases = window.posApi.getAllOrders()
    this.payments = window.posApi.getSalesTotalPayment()
  },
  methods: {
    ViewSlip(purchase) {
      this.currentOrder = purchase
      this.modal = true
    },
  },
})
</script>
