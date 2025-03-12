<template>
  <div class="row">
    <div class="q-pa-sm col-12 col-sm-4">
      <q-btn square stack color="secondary" class="full-width q-py-md" :to="{ name: 'pos-till' }">
        <q-icon size="5em" name="las la-shopping-cart" />
        <div>Point of Sale</div>
      </q-btn>
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
