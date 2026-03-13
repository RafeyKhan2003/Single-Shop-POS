<template>
  <q-select
    square
    dense
    v-model="selectedProduct"
    use-input
    filled
    hide-selected
    fill-input
    input-debounce="300"
    :options="products"
    label="Search Product (Barcode or Name)"
    @update:model-value="emitProduct"
    @filter="searchProducts"
    autofocus
    ref="searchInput"
  />
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProductSearch',
  emits: ['ProductSelected'],
  setup(_, { emit }) {
    const products = ref([])
    const selectedProduct = ref(null)

    const searchProducts = async (val, update) => {
      if (!val) {
        products.value = []
        selectedProduct.value = null
        return
      }

      try {
        const results = await window.posApi.findProducts(val)
        products.value = results || []

        // Auto-select if only one product is found
        if (products.value.length === 1) {
          selectedProduct.value = products.value[0]
          emitProduct()
        }

        update(() => {
          products.value = results
        })
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    const emitProduct = () => {
      if (selectedProduct.value) {
        emit('ProductSelected', selectedProduct.value)
      }
    }

    return {
      products,
      selectedProduct,
      searchProducts,
      emitProduct,
    }
  },
})
</script>
