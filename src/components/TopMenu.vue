<template>
  <div class="q-gutter-md q-pb-sm">
    <q-btn class="no-shadow" square color="primary" to="/" tabindex="-1"> POS </q-btn>
    <q-btn class="no-shadow" square color="primary" to="purchase" tabindex="-1"> Purchase </q-btn>
    <q-btn class="no-shadow" square color="primary" to="workshop" tabindex="-1"> Workshop </q-btn>
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
