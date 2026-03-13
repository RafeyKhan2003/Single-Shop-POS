<template>
  <div class="row q-col-gutter-md">
    <!-- Left Side: GenProduct Form -->
    <div class="col-4">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit Gen Product' : 'Add Gen Product' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveGenProduct">
            <q-input v-model="product.name" label="Gen Product Name" required />
            <q-select
              v-model.number="product.type"
              label="Type"
              required
              :options="$product_types"
            />
            <q-select
              v-model.number="product.condition"
              label="Condition"
              :options="['New', 'Used']"
              required
            />

            <q-btn
              type="submit"
              color="primary"
              class="q-mt-md"
              :label="isEditing ? 'Update Gen Product' : 'Add Gen Product'"
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

    <!-- Right Side: GenProduct List -->
    <div class="col-8">
      <q-card>
        <q-card-section>
          <div class="text-h6">Gen Product List</div>
        </q-card-section>

        <q-table
          :rows="products"
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
              <q-btn size="sm" color="info" icon="edit" @click="editGenProduct(props.row)" dense />
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
      product: { id: null, name: '', price: '' },
      products: [],
      isEditing: false,
      loading: false,
      columns: [
        { name: 'name', label: 'Gen Product Name', align: 'left', field: 'name' },
        { name: 'type', label: 'Type', align: 'left', field: 'type' },
        { name: 'condition', label: 'Condition', align: 'left', field: 'condition' },
        { name: 'actions', label: 'Actions', align: 'center' },
      ],
    }
  },
  mounted() {
    this.loadGenProducts()
  },
  methods: {
    async loadGenProducts() {
      this.products = await window.posApi.getGenProducts()
    },
    async saveGenProduct() {
      this.loading = true
      try {
        if (this.isEditing) {
          await window.posApi.updateGenProduct({ ...this.product })
        } else {
          await window.posApi.createGenProduct({ ...this.product })
        }
        this.$q.notify({
          color: 'positive',
          message: 'Gen Product Saved',
        })
        this.resetForm()
        this.loadGenProducts()
      } catch (error) {
        console.error('Error saving product:', error)
      }
      this.loading = false
    },
    editGenProduct(product) {
      this.product = { ...product }
      this.isEditing = true
    },
    resetForm() {
      this.product = { id: null, name: '', price: '' }
      this.isEditing = false
    },
    confirmDelete(product) {
      this.$q
        .dialog({
          title: 'Confirm',
          message: `Are you sure you want to delete ${product.name}?`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          await window.posApi.removeGenProduct({ ...product })
          this.loadGenProducts()
        })
    },
  },
}
</script>
