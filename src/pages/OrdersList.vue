<template>
  <q-card square class="full-width">
    <q-card-section>
      <div class="text-center q-ml-sm text-h5">All Orders</div>
    </q-card-section>

    <q-card-section class="no-padding">
      <q-markup-table dense flat bordered square separator="cell">
        <thead>
          <tr class="text-bold bg-secondary text-white">
            <th class="text-left">Order #</th>
            <th class="text-left">Total Amount</th>
            <th class="text-left">Payments</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o">
            <td @click="ViewSlip(o)" class="text-bold cursor-pointer">{{ o.order_id }}</td>
            <td>{{ this.$currency }}{{ o.total_amount }}</td>
            <td>{{ o.payments_string }}</td>
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
      modal: false,
      currentOrder: {},
    }
  },
  created() {
    this.orders = window.posApi.getAllOrders()
  },
  methods: {
    ViewSlip(order) {
      this.currentOrder = order
      this.modal = true
    },
  },
})
</script>
