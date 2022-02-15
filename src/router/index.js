import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../views/Store.vue'
import AddProductForm from '../views/AddProductForm.vue'
import MyPurchases from '../views/MyPurchases.vue'
import StoreManagement from '../views/StoreManagement.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Store',
    component: Store
  },
  {
    path: '/store',
    name: 'Home',
    component: Store
  },
  {
    path: '/purchases',
    name: 'My Purchases',
    component: MyPurchases,
  },
  {
    path: '/store/management',
    name: 'Store Management',
    component: StoreManagement,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/products/add',
    name: 'Add Product',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AddProductForm.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
