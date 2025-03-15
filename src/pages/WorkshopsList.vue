<template>
  <q-card square class="full-width">
    <q-card-section>
      <div class="text-center q-ml-sm text-h5">All Workshop Jobs</div>
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
            <th class="text-left">Workshop Time</th>
            <th class="text-left">Workshop #</th>
            <th class="text-left">Total Amount</th>
            <th class="text-left">Payments</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in workshops" :key="o">
            <td @click="ViewSlip(o)" class="text-bold cursor-pointer">
              {{ o.time_formated }}
            </td>
            <td @click="ViewSlip(o)" class="text-bold cursor-pointer">{{ o.workshop_id }}</td>
            <td>{{ this.$currency }}{{ o.total_amount }}</td>
            <td>
              {{
                o.payments.map((payment) => `${payment.payment_method}: ${payment.payment_amount}`)
              }}
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
    <OrderSlip :order="currentWorkshop" order_type="Workshop Job" />
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import OrderSlip from 'components/OrderSlip.vue'

export default defineComponent({
  name: 'WorkshopsList',
  components: {
    OrderSlip,
  },
  data() {
    return {
      workshops: [],
      payments: [],
      modal: false,
      currentWorkshop: {},
    }
  },
  created() {
    this.workshops = window.posApi.getAllWorkshops()
    this.payments = window.posApi.getWorkshopsTotalPayment()
  },
  methods: {
    ViewSlip(order) {
      this.currentWorkshop = order
      this.modal = true
    },
  },
})
</script>
