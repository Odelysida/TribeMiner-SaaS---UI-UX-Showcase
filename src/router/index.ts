import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Public routes
const publicRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue')
  }
]

// Customer area routes
const customerRoutes = [
  {
    path: '/app',
    component: () => import('../layouts/CustomerLayout.vue'),
    meta: { requiresAuth: true, role: 'customer' },
    children: [
      {
        path: '',
        redirect: '/app/dashboard'
      },
      {
        path: 'dashboard',
        name: 'CustomerDashboard',
        component: () => import('../views/customer/Dashboard.vue')
      },
      {
        path: 'mining',
        name: 'Mining',
        component: () => import('../views/customer/Mining.vue')
      },
      {
        path: 'wallet',
        name: 'Wallet',
        component: () => import('../views/customer/Wallet.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/customer/Profile.vue')
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/customer/Chat.vue')
      }
    ]
  }
]

// Admin area routes
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/admin/UserManagement.vue')
      },
      {
        path: 'logs',
        name: 'ServerLogs',
        component: () => import('../views/admin/ServerLogs.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/admin/Settings.vue')
      }
    ]
  }
]

const routes = [...publicRoutes, ...customerRoutes, ...adminRoutes]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Redirect based on user role
    if (authStore.user?.role === 'admin') {
      next('/admin')
    } else {
      next('/app')
    }
  } else {
    next()
  }
}) 