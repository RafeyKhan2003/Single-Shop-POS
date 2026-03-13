<template>
  <q-card>
    <q-card-section>
      <div v-html="orderHtml"></div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OpenTillData',
  props: {
    order: {
      type: Object,
      required: true,
    },
    order_type: {
      type: String,
      // default: 'Sale Order',
    },
  },
  data() {
    console.log(this.order)
    return {}
  },
  computed: {
    orderHtml() {
      console.log(this.order_type)
      return this.$PosSlip(this.order, this.order_type)
    },
  },
})
</script>
