<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  async created() {
    console.log('created')
    console.log(await window.shopApi.createProduct())
  },
})
</script>
