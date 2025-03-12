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
  },
  data() {
    return {}
  },
  computed: {
    orderHtml() {
      return this.$PosSlip(this.order)
    },
  },
})
</script>
