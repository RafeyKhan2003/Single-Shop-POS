<template>
  <div class="row q-col-gutter-md">
    <!-- Left Side: Service Form -->
    <div class="col-4">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit Service' : 'Add Service' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveService">
            <q-input v-model="service.name" label="Service Name" required />
            <q-input v-model.number="service.price" label="Price" type="number" required />

            <q-btn
              type="submit"
              color="primary"
              class="q-mt-md"
              :label="isEditing ? 'Update Service' : 'Add Service'"
              :loading="loading"
            />
            <q-btn
              v-if="isEditing"
              class="q-mt-md q-ml-sm"
              color="negative"
              label="Cancel"
              @click="resetForm"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <!-- Right Side: Service List -->
    <div class="col-8">
      <q-card>
        <q-card-section>
          <div class="text-h6">Service List</div>
        </q-card-section>

        <q-table
          :rows="services"
          :columns="columns"
          row-key="id"
          flat
          bordered
          dense
          hide-pagination
          :v-model:pagination="{ rowsPerPage: 0 }"
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn size="sm" color="info" icon="edit" @click="editService(props.row)" dense />
              <q-btn
                size="sm"
                color="negative"
                icon="delete"
                class="q-ml-sm"
                @click="confirmDelete(props.row)"
                dense
              />
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      service: { id: null, name: '', price: '' },
      services: [],
      isEditing: false,
      loading: false,
      columns: [
        { name: 'name', label: 'Service Name', align: 'left', field: 'name' },
        {
          name: 'price',
          label: 'Price',
          align: 'right',
          field: 'price',
          format: (val) => `£${val.toFixed(2)}`,
        },
        { name: 'actions', label: 'Actions', align: 'center' },
      ],
    }
  },
  mounted() {
    this.loadServices()
  },
  methods: {
    async loadServices() {
      this.services = await window.posApi.getServices()
    },
    async saveService() {
      this.loading = true
      try {
        if (this.isEditing) {
          await window.posApi.updateService({ ...this.service })
        } else {
          await window.posApi.createService({ ...this.service })
        }
        this.$q.notify({
          color: 'positive',
          message: 'Service Saved',
        })
        this.resetForm()
        this.loadServices()
      } catch (error) {
        console.error('Error saving service:', error)
      }
      this.loading = false
    },
    editService(service) {
      this.service = { ...service }
      this.isEditing = true
    },
    resetForm() {
      this.service = { id: null, name: '', price: '' }
      this.isEditing = false
    },
    confirmDelete(service) {
      this.$q
        .dialog({
          title: 'Confirm',
          message: `Are you sure you want to delete ${service.name}?`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          await window.posApi.removeService({ ...service })
          this.loadServices()
        })
    },
  },
}
</script>
