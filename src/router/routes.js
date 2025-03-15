const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'pos-till', component: () => import('src/pages/PosTill.vue') },
      {
        path: 'purchase',
        name: 'purchase',
        component: () => import('src/pages/PurchaseTill.vue'),
      },
      {
        path: 'workshop',
        name: 'workshop',
        component: () => import('src/pages/WorkshopTill.vue'),
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('src/pages/Menu.vue'),
      },
      {
        path: 'gen-products',
        name: 'gen-products',
        component: () => import('src/pages/AllGenProducts.vue'),
      },
      {
        path: 'services',
        name: 'services',
        component: () => import('src/pages/AllServices.vue'),
      },
      {
        path: 'orders-list',
        name: 'orders-list',
        component: () => import('src/pages/OrdersList.vue'),
      },
      {
        path: 'purchases-list',
        name: 'purchases-list',
        component: () => import('src/pages/PurchaseList.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
