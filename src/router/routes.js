const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'pos-till', component: () => import('src/pages/PosTill.vue') },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('src/pages/Menu.vue'),
      },
      {
        path: 'orders-list',
        name: 'orders-list',
        component: () => import('src/pages/OrdersList.vue'),
      },
      {
        path: 'purchase',
        name: 'purchase',
        component: () => import('src/pages/PurchasePage.vue'),
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
