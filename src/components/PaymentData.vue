<template>
  <q-dialog v-model="modal" persistent>
    <q-card square class="full-width" style="max-width: 95vw !important; height: 95vh">
      <q-form @submit.prevent="savePayments">
        <q-card-section>
          <div class="text-center q-ml-sm text-h5">Payment</div>
          <div class="text-red-8 text-bold q-mt-md">
            Total Bill: {{ this.$currency }}{{ totalBill }} - {{ CurrentTotal }} -
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-y-md column">
            <q-btn
              square
              label="Add Payment Method"
              color="primary"
              @click="addPaymentMethod"
              icon="las la-plus"
            />
            <div
              v-for="(payment, index) in currentPaymentMethods"
              :key="index"
              class="q-mb-md flex q-gutter-md"
            >
              <q-select
                filled
                v-model="payment.payment_method"
                :options="$payment_methods"
                label="Payment Method"
                dense
                style="min-width: 200px"
              />
              <q-input
                filled
                v-model.number="payment.payment_amount"
                type="number"
                :label="'Amount for ' + payment.payment_method"
                dense
                style="min-width: 200px"
                autofocus
              />
              <!-- Part Exchange -->
              <q-input
                filled
                v-model="payment.part_ex_product"
                v-if="payment.payment_method === 'Part Ex'"
                label="Part Exchanged Product"
                dense
                style="min-width: 200px"
                type="text"
                :disable="payment.payment_method !== 'Part Ex'"
              />

              <!-- Show voucher number input if the payment method is Voucher -->

              <q-input
                filled
                v-model="payment.voucher_number"
                v-if="$voucher_methods.includes(payment.payment_method)"
                label="Voucher Number"
                dense
                style="min-width: 200px"
                type="text"
                :disable="!$voucher_methods.includes(payment.payment_method)"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn square label="Cancel" color="negative" @click="cancelPayment" />
          <q-btn
            square
            label="Save"
            icon="las la-save"
            color="green-8"
            type="submit"
            :disable="CurrentTotal !== parseFloat(totalBill)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'PaymentData',
  props: {
    totalBill: {
      type: Number,
      required: true,
    },
    paymentMethods: {
      type: Object,
    },
  },
  emits: ['paymentCompleted'],
  data() {
    return {
      modal: ref(true),
      currentPaymentMethods: ref([
        {
          payment_method: 'Cash',
          payment_amount: 0,
          voucher_number: '',
        },
      ]),
    }
  },
  created() {
    const pms = this.paymentMethods || []
    if (pms.length) {
      this.currentPaymentMethods = JSON.parse(JSON.stringify(this.paymentMethods))
    }
  },
  computed: {
    CurrentTotal() {
      return this.currentPaymentMethods.reduce((total, payment) => {
        return total + (parseFloat(payment.payment_amount) || 0)
      }, 0)
    },
  },
  methods: {
    addPaymentMethod() {
      this.currentPaymentMethods.push({
        payment_method: 'Cash',
        payment_amount: 0,
        voucher_number: '',
      })
    },
    savePayments() {
      if (this.CurrentTotal !== parseFloat(this.totalBill)) {
        this.$q.notify({
          color: 'negative',
          message: 'The total payment amount must equal the total bill!',
        })
        return
      }

      this.currentPaymentMethods = this.currentPaymentMethods.filter((p) => p.payment_amount > 0)

      const hasVouchers = this.currentPaymentMethods.filter((p) =>
        this.$voucher_methods.includes(p.payment_method),
      )
      if (hasVouchers.length) {
        for (let i = 0; i < hasVouchers.length; i++) {
          if (!hasVouchers[i].voucher_number) {
            this.$q.notify({
              color: 'negative',
              message: 'Voucher number cannot be empty',
            })
            return
          }
        }
      }

      const hasPartEx = this.currentPaymentMethods.filter((p) => p.payment_method === 'Part Ex')
      if (hasPartEx.length) {
        for (let i = 0; i < hasPartEx.length; i++) {
          if (!hasPartEx[i].part_ex_product) {
            this.$q.notify({
              color: 'negative',
              message: 'Part Ex Data cannot be empty',
            })
            return
          }
        }
      }

      this.$emit('paymentCompleted', this.currentPaymentMethods)
      // this.modal = false
    },
    cancelPayment() {
      // this.modal = false
      this.$emit('cancelPayment', true)
    },
    handleKeydown(event) {
      // console.log(event)
      if (event.key === 'Escape') {
        event.preventDefault()
        this.cancelPayment()
      }
      if (event.ctrlKey && (event.key === '+' || event.key === '=')) {
        this.addPaymentMethod()
        event.preventDefault()
        // this.cancelPayment()
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>
