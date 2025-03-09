<template>
  <div>
    <!-- Top Search Bar -->
    <q-input
      filled
      ref="searchInput"
      v-model="searchQuery"
      label="Search Product (Barcode or Name)"
      dense
      debounce="300"
      @input="searchProduct"
      clearable
      autofocus
    />
  </div>

  <div class="row" style="overflow: hidden">
    <div
      class="col-6 q-pr-sm"
      style="height: 100%; display: flex; flex-direction: column"
      ref="printableDiv"
    >
      <!-- Cart Summary -->
      <q-card class="q-mt-md" style="flex-grow: 1" bordered>
        <q-card-section style="height: 350px; overflow-y: auto">
          <div class="text-h6">Cart</div>

          <!-- Table Header -->
          <div class="cart-header">
            <div>Product Name</div>
            <div>Price (£)</div>
            <div>Qty</div>
            <div>Condition</div>
            <div>Type</div>
          </div>

          <q-separator />

          <!-- Table Rows -->
          <div
            class="cart-row"
            v-for="(item, index) in cart"
            :key="index"
            @click="editProduct(index)"
          >
            <div>
              <strong>{{ item.name }}</strong>
            </div>
            <div>{{ item.price }}</div>
            <div>{{ item.qty }}</div>
            <div>{{ item.condition }}</div>
            <div>{{ item.type }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>Total:</strong> £{{ totalAmount }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-6 q-pl-sm q-pt-md">
      <div class="flex flex-wrap justify-between items-center w-full">
        <div
          v-for="(product, index) in generalProducts"
          :key="index"
          class="q-mb-md q-px-xs"
          style="width: 50%"
        >
          <q-btn
            color="primary"
            style="width: 100%"
            @click="addProductToCart(product)"
            tabindex="-1"
          >
            {{ product.name }} ({{ product.condition }})
            <q-tooltip class="bg-negative" anchor="top middle" self="center middle"
              >Press CTRL+{{ index + 1 }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="col-12 q-pt-md">
      <div class="q-gutter-sm">
        <q-btn color="primary" @click="print()" tabindex="-1"> Print </q-btn>
      </div>
    </div>
  </div>

  <!-- Product Edit Modal -->
  <q-dialog
    v-model="editDialog"
    persistent
    @keydown.enter="saveProductEdit"
    @keydown.esc="closeEditDialog"
  >
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">Edit Product</div>
        <div class="q-pt-xs">
          <small class="text-bold">
            Condition: {{ editProductData.condition }}, Type: {{ editProductData.type }}
          </small>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input v-model="editProductData.name" label="Product Name" autofocus />
        <q-input v-model="editProductData.price" label="Price" type="number" />
        <q-input v-model="editProductData.qty" label="Quantity" type="number" />
      </q-card-section>
      <q-card-actions>
        <q-btn label="Cancel" color="negative" icon="las la-ban" @click="closeEditDialog" />
        <q-btn label="Save" color="positive" icon="las la-save" @click="saveProductEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      generalProducts: window.posApi.getGenProducts(),
      cart: [],
      editDialog: false,
      editProductData: {
        name: '',
        price: 0,
        qty: 1,
      },
      currentEditIndex: null,
    }
  },
  computed: {
    // Compute the total amount in the cart
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)
    },
  },
  methods: {
    // Function to handle search
    searchProduct() {
      // Filtering happens automatically through `filteredProducts` computed property
    },
    // Add product to cart
    addProductToCart(product) {
      let index = this.cart.findIndex(
        (p) =>
          p.name === product.name && p.condition === product.condition && p.type === product.type,
      )
      console.log(index)
      if (index !== -1) {
        this.cart[index].qty++
      } else {
        this.cart.push({ ...product, qty: 1 })
        index = this.cart.length - 1
      }

      if (this.cart[index].price === undefined) {
        this.editProduct(index)
      }

      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    editProduct(index) {
      this.currentEditIndex = index
      this.editProductData = JSON.parse(JSON.stringify(this.cart[index]))
      this.editDialog = true
    },
    // Close the product edit dialog without saving
    closeEditDialog() {
      this.editDialog = false
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    // Save the changes made to the product
    saveProductEdit() {
      const updatedProduct = this.cart[this.currentEditIndex]
      if (isNaN(this.editProductData.price) || this.editProductData.price === undefined) {
        this.$q.notify({
          message: 'Price is not a number',
          color: 'negative',
        })
        return
      }
      if (isNaN(parseInt(this.editProductData.qty)) || this.editProductData.qty === undefined) {
        this.$q.notify({
          message: 'Quatity is not a number',
          color: 'negative',
        })
        return
      }
      updatedProduct.name = this.editProductData.name
      updatedProduct.price = this.editProductData.price
      updatedProduct.qty = parseInt(this.editProductData.qty)
      this.editDialog = false
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    // Handle keyboard events for Ctrl+1, Ctrl+2, etc.
    handleKeydown(event) {
      if (event.ctrlKey && event.key >= 1 && event.key <= this.generalProducts.length) {
        this.addProductToCart(this.generalProducts[event.key - 1])
      }
    },
    print() {
      const printContent = this.$refs.printableDiv.innerHTML
      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow.document.write('<html><head><title>Print</title></head><body>')
      printWindow.document.write(printContent)
      printWindow.document.write('</body></html>')
      printWindow.document.close()

      // printWindow.onafterprint = () => {
      //   printWindow.close()
      // }
      printWindow.print()
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
}
</script>

<style scoped>
body {
  overflow: hidden;
}
.cart-header,
.cart-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 8px 0;
  text-align: left;
}

.cart-header {
  font-weight: bold;
  border-bottom: 2px solid #ccc;
  padding-bottom: 5px;
}

.cart-row {
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.cart-row:hover {
  background-color: #f9f9f9;
}
</style>
