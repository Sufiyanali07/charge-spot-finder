import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Lazy-loaded components
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const StationList = () => import('../views/StationList.vue')
const StationForm = () => import('../views/StationForm.vue')
const MapView = () => import('../views/MapView.vue')
const Profile = () => import('../views/Profile.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/stations',
    name: 'StationList',
    component: StationList
  },
  {
    path: '/stations/new',
    name: 'AddStation',
    component: StationForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/stations/:id/edit',
    name: 'EditStation',
    component: StationForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'MapView',
    component: MapView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn
  
  // Check for protected routes
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } 
  // Check for guest-only routes (login/register)
  else if (to.matched.some(record => record.meta.guestOnly) && isLoggedIn) {
    next({ name: 'Home' })
  } 
  else {
    next()
  }
})

export default router
