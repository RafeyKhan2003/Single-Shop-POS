<template>
  <TopMenu />
  <div>
    <!-- Top Search Bar -->
    <!-- <q-input
      filled
      ref="searchInput"
      v-model="searchQuery"
      label="Search Product (Barcode or Name)"
      dense
      debounce="300"
      @input="searchProduct"
      clearable
      autofocus
    /> -->
    <SearchProduct
      ref="searchRef"
      @ProductSelected="
        (p) => {
          console.log('p', p)
          addProductToCart(p)
        }
      "
    />
  </div>

  <div class="row" style="overflow: hidden">
    <div
      class="col-5 q-pr-sm"
      style="height: 100%; display: flex; flex-direction: column"
      ref="printableDiv"
    >
      <!-- Cart Summary -->
      <q-card square class="q-mt-md no-shadow" style="flex-grow: 1" bordered>
        <q-card-section>
          <div class="flex justify-between items-center">
            <span class="text-h6">Workshop Cart</span>
            <q-badge
              v-if="saveStatus"
              :color="
                saveStatus === 'Saved ✓' ? 'green' : saveStatus === 'Saving...' ? 'blue' : 'red'
              "
              class="q-ml-sm"
            >
              {{ saveStatus }}
            </q-badge>
            <span @click="() => (this.customerModal = true)" class="q-ml-auto cursor-pointer"
              >Customer: {{ customer.name }}</span
            >
          </div>
          <!-- Table Header -->
          <div class="cart-header">
            <div>Product Name</div>
            <div>Price ({{ this.$currency }})</div>
            <div>Qty</div>
            <div>Condition</div>
            <div>Type</div>
          </div>

          <q-separator />
        </q-card-section>
        <q-card-section style="height: 180px; overflow-y: auto; padding-top: 0px">
          <!-- Table Rows -->
          <div
            class="cart-row"
            v-for="(item, index) in cart"
            :key="index"
            @click="editProduct(index)"
            :class="item.product_type == 'Service' ? 'bg-green-1' : ''"
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
      <div class="q-pl-sm q-pt-md">
        <div class="q-gutter-md">
          <q-btn square color="primary" @click="() => (this.customerModal = true)" tabindex="-1">
            Customer
          </q-btn>
          <q-btn square color="primary" @click="() => (this.ordersModal = true)" tabindex="-1">
            Workshops List
          </q-btn>
        </div>
      </div>
    </div>

    <div class="col-7 q-pl-sm q-pt-md">
      <div class="row">
        <div class="col-6 q-pr-xs" style="height: 270px; overflow-y: auto">
          <div class="flex flex-wrap justify-between items-center w-full">
            <div
              v-for="(product, index) in generalProducts"
              :key="index"
              class="q-mb-md q-px-xs full-height"
              style="width: 50%"
            >
              <q-btn
                square
                color="primary"
                style="width: 100%"
                @click="addProductToCart(product)"
                tabindex="-1"
                class="full-height"
              >
                {{ product.name }} ({{ product.condition }})
                <q-tooltip class="bg-negative" anchor="top middle" self="center middle"
                  >Press CTRL+{{ index + 1 }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-6" style="height: 270px; overflow-y: auto">
          <div class="flex flex-wrap justify-between items-center w-full">
            <div
              v-for="(service, index) in services"
              :key="index"
              class="q-mb-md q-px-xs full-height"
              style="width: 50%"
            >
              <q-btn
                square
                color="primary"
                style="width: 100%"
                @click="addProductToCart(service, 'Service')"
                tabindex="-1"
                class="full-height"
              >
                {{ service.name }}
                <q-tooltip class="bg-negative" anchor="top middle" self="center middle">
                  Press F{{ index + 1 }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <TillCounter :totalAmount="totalAmount">
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
      </TillCounter>
    </div>
  </div>

  <!-- Workshops List Modal -->
  <q-dialog
    v-model="ordersModal"
    @hide="
      () => {
        this.$nextTick(() => {
          this.$refs.searchRef.$refs.searchInput.focus()
        })
      }
    "
  >
    <WorkshopsList />
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
            Condition: {{ editProductData.condition }}, Type:
            {{ editProductData.type || editProductData.product_type }}
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

  <!-- Customer Modal -->
  <q-dialog
    v-model="customerModal"
    persistent
    @keydown.enter="CloseCustomerModal"
    @keydown.esc="CloseCustomerModal"
  >
    <q-card square class="full-width">
      <q-card-section>
        <div class="text-h6">Customer Details</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input v-model="customer.name" label="Customer Name" autofocus />
        <q-input v-model="customer.phone" label="Customer Phone" type="text" />
        <q-input v-model="customer.email" label="Customer Email" type="text" />
      </q-card-section>
      <q-card-actions>
        <q-btn
          square
          label="Save"
          color="positive"
          icon="las la-save"
          @click="CloseCustomerModal"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <PaymentData
    v-if="paymentDataModal"
    @paymentCompleted="CompleteWorkshop"
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
import WorkshopsList from 'src/pages/WorkshopsList.vue'
import SearchProduct from 'components/SearchProduct.vue'
import TopMenu from 'components/TopMenu.vue'
import TillCounter from 'components/TillCounter.vue'

export default {
  components: {
    PaymentData,
    WorkshopsList,
    SearchProduct,
    TopMenu,
    TillCounter,
  },
  data() {
    return {
      searchQuery: '',
      generalProducts: window.posApi.getGenProducts(),
      services: window.posApi.getServices(),
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
      customerModal: false,
      customer: {
        name: 'Walk-In',
      },
      saveStatus: '',
      autoSaveTimeout: null,
      saveStatusResetTimeout: null,
    }
  },
  watch: {
    cart: {
      handler() {
        this.debouncedAutoSave()
      },
      deep: true,
    },
    customer: {
      handler() {
        this.debouncedAutoSave()
      },
      deep: true,
    },
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
    addProductToCart(product, product_type = 'Product') {
      let index = this.cart.findIndex(
        (p) =>
          p.name === product.name && p.condition === product.condition && p.type === product.type,
      )
      console.log(index)
      if (index !== -1) {
        this.cart[index].qty++
      } else {
        this.cart.push({ ...product, qty: 1, product_type })
        index = this.cart.length - 1
      }

      if (this.cart[index].price === undefined) {
        this.editProduct(index)
      }

      this.$nextTick(() => {
        this.$refs.searchRef.$refs.searchInput.focus()
      })
    },
    editProduct(index) {
      this.currentEditIndex = index
      this.editProductData = JSON.parse(JSON.stringify(this.cart[index]))
      this.editProductModal = true
    },
    // Close the product edit dialog without saving
    closeEditDialog() {
      this.cart = this.cart.filter((p) => p.price && p.name && p.qty)
      this.editProductModal = false
      this.$nextTick(() => {
        this.$refs.searchRef.$refs.searchInput.focus()
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
        this.$refs.searchRef.$refs.searchInput.focus()
      })
      this.cart = this.cart.filter((p) => p.price && p.name && p.qty)
    },
    // Handle keyboard events for Ctrl+1, Ctrl+2, etc.
    handleKeydown(event) {
      if (this.paymentDataModal == true || this.editProductModal == true) return
      // console.log(event)
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
      if (event.key.includes('F') && event.key.length > 1) {
        event.preventDefault()
        this.addProductToCart(this.services[event.key.match(/\d+/g)?.join('') - 1], 'Service')
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
    CompleteWorkshop(data) {
      console.log(data)
      let res = window.posApi.createWorkshop({
        cart: JSON.parse(JSON.stringify(this.cart)),
        payments: JSON.parse(JSON.stringify(data)),
        customer: JSON.parse(JSON.stringify(this.customer)),
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
    CloseCustomerModal() {
      console.log('closing')
      this.customerModal = false
      this.$nextTick(() => {
        this.$refs.searchRef.$refs.searchInput.focus()
      })
    },
    print(order) {
      this.$Print(this.$PosSlip(order), () => {
        this.$router.go()
      })
    },
    debouncedAutoSave() {
      this.saveStatus = 'Saving...'
      clearTimeout(this.autoSaveTimeout)
      this.autoSaveTimeout = setTimeout(() => {
        this.autoSave()
      }, 3000)
    },
    autoSave() {
      try {
        const result = window.posApi.autoSaveWorkshopDraft({
          cart: JSON.parse(JSON.stringify(this.cart)),
          customer: JSON.parse(JSON.stringify(this.customer)),
        })
        if (result) {
          this.saveStatus = 'Saved ✓'
        } else {
          this.saveStatus = 'Error saving'
        }
      } catch (e) {
        console.error('Auto-save failed:', e)
        this.saveStatus = 'Error saving'
      }
      clearTimeout(this.saveStatusResetTimeout)
      this.saveStatusResetTimeout = setTimeout(() => {
        this.saveStatus = ''
      }, 3000)
    },
    loadDraft() {
      try {
        const draft = window.posApi.getWorkshopDraft()
        if (!draft) return
        if (Array.isArray(draft.cart)) this.cart = draft.cart
        if (draft.customer && typeof draft.customer === 'object') this.customer = draft.customer
      } catch (e) {
        console.error('Draft load failed:', e)
      }
    },
  },
  mounted() {
    this.loadDraft()
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
    clearTimeout(this.autoSaveTimeout)
    clearTimeout(this.saveStatusResetTimeout)
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
  padding: 3px 0;
  text-align: left;
}

.cart-header {
  font-weight: bold;
  border-bottom: 2px solid #ccc;
  padding-bottom: 3px;
}

.cart-row {
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 0.7rem;
}

.cart-row:hover {
  background-color: #f9f9f9;
}
</style>
