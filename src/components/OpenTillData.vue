<template>
  <q-dialog v-model="modal" persistent>
    <q-card class="full-width">
      <q-form @submit.prevent="OpenTill">
        <q-card-section>
          <div class="text-center q-ml-sm text-h5 text-red-8">Open Till - {{ date }}</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-y-md column">
            <q-input
              filled
              v-model="till.opening_amount"
              label="Opening Amount"
              dense
              required
              :rules="[(value) => !isNaN(value) || 'Please enter a valid amount']"
              prefix="£"
              type="text"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Save" icon="las la-save" color="green-8" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'OpenTillData',
  emits: ['tillOpened'],
  data() {
    return {
      modal: ref(true),
      date: date.formatDate(new Date(), 'DD/MM/YYYY'),
      till: ref({
        opening_amount: 0,
      }),
    }
  },
  created() {
    if (this.$till.name) {
      this.till = JSON.parse(JSON.stringify(this.$till))
    }
  },
  methods: {
    async OpenTill() {
      let res = window.posApi.openTill({
        name: this.till.name,
        address: this.till.address,
        phone: this.till.phone,
        email: this.till.email,
      })

      console.log(res)
      if (res) {
        this.$q.notify({
          message: 'Till Opened',
          color: 'positive',
        })
        this.$emit('tillOpened', res)
      }
    },
  },
})
</script>
