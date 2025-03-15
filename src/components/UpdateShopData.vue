<template>
  <q-dialog v-model="modal" persistent>
    <q-card square class="full-width">
      <q-form @submit.prevent="UpdateShop">
        <q-card-section>
          <div class="text-center q-ml-sm text-h5 text-red-8">Update Shop Data</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-y-md column">
            <q-input filled v-model="shop.name" label="Shop Name" dense required />
            <q-input filled v-model="shop.address" label="Address" dense required />
            <q-input filled v-model="shop.phone" label="Phone" dense required />
            <q-input filled v-model="shop.email" label="Email" dense required />
            <!-- <q-input filled v-model="shop.mail.username" label="SMTP Sending Email" dense />
            <q-input filled v-model="shop.mail.password" label="SMTP Password" dense />
            <q-input filled v-model="shop.mail.server" label="SMTP Server" dense />
            <q-input filled v-model="shop.mail.port" label="SMTP Port" dense /> -->
            <q-input
              filled
              v-model="shop.mail.company_emails"
              label="Reports Receiving Emails"
              hint="Comma separated"
              dense
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn square label="Save" icon="las la-save" color="green-8" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UpdateShopData',
  emits: ['shopUpdated'],
  data() {
    return {
      modal: ref(true),
      shop: ref({
        name: 'asdfs',
        address: 'asdfs',
        phone: 'asdfs',
        email: 'asdfs',
        mail: {},
      }),
    }
  },
  created() {
    if (this.$shop.name) {
      this.shop = JSON.parse(JSON.stringify(this.$shop))
    }
  },
  methods: {
    async UpdateShop() {
      let res = window.posApi.updateShop(JSON.parse(JSON.stringify(this.shop)))

      console.log(res)
      if (res) {
        this.$q.notify({
          message: 'Shop Data Updated',
          color: 'positive',
        })
        this.$emit('shopUpdated', res)
      }
    },
  },
})
</script>
