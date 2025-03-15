<template>
  <div class="row">
    <div class="q-pa-sm col-12">
      <div class="text-h6 text-bold text-red-8">Point of Orders</div>
    </div>
    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn square stack color="secondary" class="full-width q-py-md" :to="{ name: 'pos-till' }">
        <q-icon size="5em" name="las la-shopping-cart" />
        <div>Point of Sale</div>
      </q-btn>
    </div>
    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn square stack color="secondary" class="full-width q-py-md" :to="{ name: 'purchase' }">
        <q-icon size="5em" name="las la-cart-arrow-down" />
        <div>Point of Purchase</div>
      </q-btn>
    </div>

    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn square stack color="secondary" class="full-width q-py-md" :to="{ name: 'workshop' }">
        <q-icon size="5em" name="las la-cart-arrow-down" />
        <div>Point of Workshop</div>
      </q-btn>
    </div>

    <div class="q-pa-sm col-12">
      <div class="text-h6 text-bold text-red-8">Reports</div>
    </div>
    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn
        square
        stack
        color="secondary"
        class="full-width q-py-md"
        :to="{
          name: 'orders-list',
        }"
      >
        <q-icon size="5em" name="las la-warehouse" />
        <div>Orders List</div>
      </q-btn>
    </div>

    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn
        square
        stack
        color="secondary"
        class="full-width q-py-md"
        :to="{
          name: 'purchases-list',
        }"
      >
        <q-icon size="5em" name="las la-arrow-circle-down" />
        <div>Purchases List</div>
      </q-btn>
    </div>

    <div class="q-pa-sm col-12">
      <div class="text-h6 text-bold text-red-8">Settings</div>
    </div>

    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn
        square
        stack
        color="secondary"
        class="full-width q-py-md"
        :to="{
          name: 'services',
        }"
      >
        <q-icon size="5em" name="las la-warehouse" />
        <div>Services</div>
      </q-btn>
    </div>
    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn
        square
        stack
        color="secondary"
        class="full-width q-py-md"
        :to="{
          name: 'gen-products',
        }"
      >
        <q-icon size="5em" name="las la-warehouse" />
        <div>Gen Products</div>
      </q-btn>
    </div>

    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn
        square
        stack
        color="secondary"
        class="full-width q-py-md"
        @click="
          () => {
            this.shopDataModal = true
          }
        "
      >
        <q-icon size="5em" name="las la-cog" />
        <div>Update Shop Data</div>
      </q-btn>
    </div>
  </div>

  <UpdateShopData
    v-if="shopDataModal"
    @shopUpdated="
      (r) => {
        if (r) this.shopDataModal = false
      }
    "
  />
</template>

<script>
import { defineComponent, ref } from 'vue'
import UpdateShopData from 'components/UpdateShopData.vue'

export default defineComponent({
  name: 'MenuPage',
  components: {
    UpdateShopData,
  },
  data() {
    return {
      shopDataModal: ref(false),
    }
  },
})
</script>
