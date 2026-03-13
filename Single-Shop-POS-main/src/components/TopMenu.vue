<template>
  <div class="q-gutter-md q-pb-sm">
    <q-btn
      class="no-shadow"
      square
      color="primary"
      :to="{
        name: 'purchase',
      }"
      tabindex="-1"
    >
      Purchase/Outflow
    </q-btn>
    <q-btn
      class="no-shadow"
      square
      color="primary"
      :to="{
        name: 'workshop',
      }"
      tabindex="-1"
    >
      Workshop
    </q-btn>
    <q-btn
      class="no-shadow"
      square
      color="primary"
      :to="{
        name: 'daysheet',
      }"
      tabindex="-1"
    >
      Dayhseet
    </q-btn>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TopMenu',
  data() {
    return {}
  },
  created() {},
  methods: {},
})
</script>
