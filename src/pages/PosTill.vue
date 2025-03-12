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
      <q-card square class="q-mt-md" style="flex-grow: 1" bordered>
        <q-card-section style="height: 300px; overflow-y: auto">
          <div class="text-h6">Cart</div>

          <!-- Table Header -->
          <div class="cart-header">
            <div>Product Name</div>
            <div>Price ({{ this.$currency }})</div>
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
          <div><strong>Total:</strong> {{ this.$currency }}{{ totalAmount }}</div>
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
            square
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
    <div class="col-6 q-pl-sm q-pt-md">
      <div class="q-gutter-md">
        <q-btn square color="primary" @click="() => (this.ordersModal = true)" tabindex="-1">
          Orders List
        </q-btn>
      </div>
    </div>
    <div class="col-6 q-pl-sm q-pt-md">
      <div class="q-pa-lg text-center bg-blue-8">
        <div class="text-h3 q-mb-sm">{{ this.$currency }}{{ totalAmount }}</div>
        <div>
          Opening: {{ this.$currency }}{{ till.opening_amount }} - Current Till: {{ this.$currency
          }}{{ currentTill }}
        </div>
      </div>
      <div>
        <q-btn
          square
          class="full-width"
          color="green-8"
          @click="OpenPayments"
          tabindex="-1"
          :disable="!this.cart.length"
        >
          Complete Order
        </q-btn>
      </div>
    </div>
  </div>

  <!-- Orders List Modal -->
  <q-dialog
    v-model="ordersModal"
    @hide="
      () => {
        this.$nextTick(() => {
          this.$refs.searchInput.focus()
        })
      }
    "
  >
    <OrdersList />
  </q-dialog>

  <!-- Product Edit Modal -->
  <q-dialog
    v-model="editProductModal"
    persistent
    @keydown.enter="saveProductEdit"
    @keydown.esc="closeEditDialog"
  >
    <q-card square class="full-width">
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
        <q-btn square label="Cancel" color="negative" icon="las la-ban" @click="closeEditDialog" />
        <q-btn square label="Save" color="positive" icon="las la-save" @click="saveProductEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <PaymentData
    v-if="paymentDataModal"
    @paymentCompleted="CompleteOrder"
    :totalBill="totalAmount"
    @cancelPayment="
      () => {
        this.paymentDataModal = false
      }
    "
  />
</template>

<script>
// import { ref } from 'vue'
import PaymentData from 'components/PaymentData.vue'
import OrdersList from 'src/pages/OrdersList.vue'

export default {
  components: {
    PaymentData,
    OrdersList,
  },
  data() {
    return {
      searchQuery: '',
      generalProducts: window.posApi.getGenProducts(),
      currentTill: window.posApi.getTillTotal(),
      till: window.posApi.getTill(),
      cart: [],
      editProductModal: false,
      editProductData: {
        name: '',
        price: 0,
        qty: 1,
      },
      currentEditIndex: null,
      paymentDataModal: false,
      ordersModal: false,
    }
  },
  computed: {
    // Compute the total amount in the cart
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0)
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
      this.editProductModal = true
    },
    // Close the product edit dialog without saving
    closeEditDialog() {
      if (isNaN(this.editProductData.price) || this.editProductData.price === undefined) {
        this.$q.notify({
          message: 'Price is not a number',
          color: 'negative',
        })
        return
      }
      if (isNaN(parseInt(this.editProductData.qty)) || this.editProductData.qty === undefined) {
        this.$q.notify({
          message: 'Quantity is not a number',
          color: 'negative',
        })
        return
      }
      this.editProductModal = false
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
      this.editProductModal = false
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    // Handle keyboard events for Ctrl+1, Ctrl+2, etc.
    handleKeydown(event) {
      if (this.paymentDataModal == true || this.editProductModal == true) return
      if (
        event.ctrlKey &&
        event.key >= 1 &&
        event.key <= this.generalProducts.length &&
        event.key <= 9
      ) {
        event.preventDefault()
        this.addProductToCart(this.generalProducts[event.key - 1])
      }

      if ((event.ctrlKey && event.key == 'm') || (event.ctrlKey && event.key == 'M')) {
        event.preventDefault()
        this.OpenPayments()
      }

      if ((event.ctrlKey && event.key == 'o') || (event.ctrlKey && event.key == 'O')) {
        event.preventDefault()
      }
    },
    OpenPayments() {
      if (!this.cart.length) {
        this.$q.notify({
          message: 'The Cart is empty',
          color: 'warning',
        })
        return
      }
      this.paymentDataModal = true
    },
    CompleteOrder(data) {
      console.log(data)
      let res = window.posApi.createOrder({
        cart: JSON.parse(JSON.stringify(this.cart)),
        payments: JSON.parse(JSON.stringify(data)),
      })
      if (res) {
        this.paymentDataModal = false
        this.print(res)
        return
      }
      this.$q.notify({
        message: 'Cannot complete order',
        color: 'warning',
      })
      return
    },
    print(order) {
      this.$Print(this.$PosSlip(order), () => {
        this.$router.go()
      })
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
