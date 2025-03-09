import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.config.globalProperties.$shop = window.posApi.getShop()
  app.config.globalProperties.$till = window.posApi.getTill()

  app.config.globalProperties.$product_types = ['Bike', 'Helmet', 'Parts', 'Accessories']
  app.config.globalProperties.$payment_methods = [
    'Cash',
    'Card',
    'CycleScheme',
    'Part Ex',
    'Voucher',
  ]
})
