<template>
  <div class="q-pl-sm q-pt-md till-counter">
    <div class="q-pa-lg text-center bg-blue-8">
      <div class="text-h3 q-mb-sm">{{ CurrentTotal }}</div>
      <div>
        <strong>Current Till: {{ this.$currency }}{{ summary.current_till }}</strong> <br />
        Cash Sales: {{ this.$currency }}{{ summary.cash_sales }} <br />
        Card Sales: {{ this.$currency }}{{ summary.card_sales }}
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TillCounter',
  props: {
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      summary: window.posApi.getSummary(),
    }
  },
  created() {},
  computed: {
    CurrentTotal() {
      return this.$currency + parseFloat(this.totalAmount || 0).toFixed(2)
    },
  },
})
</script>
