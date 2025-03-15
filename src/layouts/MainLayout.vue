<template>
  <div class="bg-dark text-white">
    <q-toolbar>
      <q-btn
        square
        flat
        dense
        round
        icon="las la-bars"
        aria-label="Menu"
        clickable
        :to="{ name: 'menu' }"
        tabindex="-1"
      />

      <q-toolbar-title> Point of Sale </q-toolbar-title>

      <div></div>
    </q-toolbar>
  </div>

  <div class="q-px-md" style="overflow: hidden">
    <div class="q-py-md">
      <router-view />
    </div>
  </div>

  <UpdateShopData
    v-if="shopDataModal"
    @shopUpdated="
      (r) => {
        if (r) {
          this.shopDataModal = false
          this.$router.go()
        }
      }
    "
  ></UpdateShopData>

  <OpenTillData
    v-if="tillDataModal"
    @tillOpened="
      (r) => {
        if (r) {
          this.tillDataModal = false
          this.$router.go()
        }
      }
    "
  />
</template>

<script>
import { defineComponent, ref } from 'vue'
import UpdateShopData from 'components/UpdateShopData.vue'
import OpenTillData from 'components/OpenTillData.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    UpdateShopData,
    OpenTillData,
  },
  data() {
    return {
      shopDataModal: ref(false),
      tillDataModal: ref(false),
      till: window.posApi.getTill(),
    }
  },
  created() {},
  async mounted() {
    if (!this.till.opening_time && this.$route.name != 'menu') {
      this.$router.push({ name: 'menu' })
    }
    if (!this.$shop.name) {
      console.log('Shop not initialized...')
      this.shopDataModal = true
      return
    }
    this.CheckOpenTill()
  },
  methods: {
    CheckOpenTill() {
      if (!this.till.opening_time) {
        console.log('Till not Opened...')
        this.tillDataModal = true
      }
    },
  },
})
</script>
