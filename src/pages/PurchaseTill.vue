<template>
  <div>
    <TopMenu />
  </div>
  <q-select
    square
    dense
    v-model="type"
    filled
    :options="['Purchase', 'Petty Cash', 'Refund']"
    label="Outflow Type"
    autofocus
  />

  <div class="row" style="overflow: hidden">
    <div
      class="col-5 q-pr-sm"
      style="height: 100%; display: flex; flex-direction: column"
      ref="printableDiv"
    >
      <!-- Purchase Products Summary -->
      <q-card square class="q-mt-md no-shadow" style="flex-grow: 1" bordered>
        <q-card-section style="height: 250px; overflow-y: auto">
          <div class="flex justify-between items-center">
            <span class="text-h6">Purchase Products</span>
            <span @click="() => (this.customerModal = true)" class="q-ml-auto cursor-pointer">
              Customer: {{ customer.name }}
            </span>
          </div>

          <!-- Table Header -->
          <div class="cart-header">
            <div>Product Name</div>
            <div>Price ({{ this.$currency }})</div>
            <div>Qty</div>
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
            <div>{{ item.type }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>Total:</strong> {{ this.$currency }}{{ totalAmount }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-7 q-pl-sm q-pt-md">
      <div class="flex flex-wrap justify-between items-center w-full">
        <div class="q-mb-md q-px-xs" style="width: 50%">
          <q-btn square color="primary" style="width: 100%" @click="addProductToCart" tabindex="-1">
            <span> Add </span> <span v-if="type === 'Purchase'"> Product to Purchase </span>
            <span v-if="type === 'Petty Cash'"> Petty Cash </span>
            <span v-if="type === 'Refund'"> Refund </span> (CTRL+1)
            <q-tooltip class="bg-negative" anchor="top middle" self="center middle">
              Press CTRL+1
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="col-6 q-pl-sm q-pt-md">
      <div class="q-gutter-md">
        <q-btn square color="primary" @click="() => (this.customerModal = true)" tabindex="-1">
          Customer
        </q-btn>
        <q-btn square color="primary" @click="() => (this.purchasesModal = true)" tabindex="-1">
          Purchase List
        </q-btn>
      </div>
    </div>
    <div class="q-pl-sm q-pt-md till-counter">
      <div class="q-pa-lg text-center bg-blue-8">
        <div class="text-h3 q-mb-sm">{{ this.$currency }}{{ totalAmount }}</div>
        <div>
          <strong>Current Till: {{ this.$currency }}{{ currentTill }}</strong> - Opening:
          {{ this.$currency }}{{ till.opening_amount }}
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
          Complete Purchase
        </q-btn>
      </div>
    </div>
  </div>

  <!-- Purchase List Modal -->
  <q-dialog v-model="purchasesModal">
    <PurchaseList />
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
        <div class="text-h6">
          <span> Add </span> <span v-if="type === 'Purchase'"> Product to Purchase </span>
          <span v-if="type === 'Petty Cash'"> Petty Cash </span>
          <span v-if="type === 'Refund'"> Refund </span>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input v-model="editProductData.name" label="Description" autofocus />
        <q-input v-model="editProductData.price" label="Price" type="number" />
        <q-input v-model="editProductData.qty" label="Quantity" type="number" />
        <q-select
          v-if="type == 'Purchase'"
          v-model="editProductData.type"
          label="Type"
          :options="['Bike', 'Simple Product']"
        />
        <q-input
          v-model="editProductData.make"
          label="Make"
          type="text"
          v-if="editProductData.type === 'Bike' && type == 'Purchase'"
        />
        <q-input
          v-model="editProductData.model"
          label="Model"
          type="text"
          v-if="editProductData.type === 'Bike' && type == 'Purchase'"
        />
        <q-input
          v-model="editProductData.color"
          label="Color"
          type="text"
          v-if="editProductData.type === 'Bike' && type == 'Purchase'"
        />
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
import TopMenu from 'components/TopMenu.vue'
import PurchaseList from 'src/pages/PurchaseList.vue'

export default {
  components: {
    PaymentData,
    TopMenu,
    PurchaseList,
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
        type: 'Bike',
        make: '',
        model: '',
        color: '',
      },
      currentEditIndex: null,
      paymentDataModal: false,
      purchasesModal: false,
      customerModal: false,
      customer: {
        name: 'Walk-In',
      },
      type: 'Purchase',
    }
  },
  computed: {
    // Compute the total amount in the cart
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    },
  },
  methods: {
    // Add product to cart
    addProductToCart() {
      this.cart.push({ name: '', qty: 1, type: 'Bike', make: '', model: '', color: '' })
      let index = this.cart.length - 1

      if (this.cart[index].price === undefined) {
        this.editProduct(index)
      }
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
    },
    // Save the changes made to the product
    saveProductEdit() {
      this.cart[this.currentEditIndex] = this.editProductData
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
      this.editProductModal = false

      this.cart = this.cart.filter((p) => p.price && p.name && p.qty)
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
      let res = window.posApi.createPurchase({
        cart: JSON.parse(JSON.stringify(this.cart)),
        payments: JSON.parse(JSON.stringify(data)),
        customer: JSON.parse(JSON.stringify(this.customer)),
        type: this.type,
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
