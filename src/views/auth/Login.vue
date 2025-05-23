<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  const result = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (result.success) {
    // Redirect based on user role
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/app')
    }
  }
}

const demoCredentials = [
  { role: 'Admin', email: 'admin@tribeminer.com', password: 'admin123' },
  { role: 'User', email: 'user@tribeminer.com', password: 'user123' }
]

const fillDemo = (credentials: { email: string; password: string }) => {
  email.value = credentials.email
  password.value = credentials.password
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold gradient-text mb-2">TribeMiner</h1>
        <p class="text-gray-400">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <div class="glass-card p-8 rounded-xl">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg">
            {{ authStore.error }}
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <i v-if="authStore.isLoading" class="fas fa-spinner animate-spin"></i>
            <span>{{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 class="text-sm font-medium text-gray-300 mb-3">Demo Credentials:</h3>
          <div class="space-y-2">
            <div 
              v-for="cred in demoCredentials" 
              :key="cred.role"
              @click="fillDemo(cred)"
              class="flex justify-between items-center p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-colors duration-200"
            >
              <span class="text-sm text-gray-300">{{ cred.role }}</span>
              <span class="text-xs text-gray-400">{{ cred.email }}</span>
            </div>
          </div>
        </div>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Don't have an account?
            <router-link to="/register" class="text-primary-400 hover:text-primary-300 font-medium">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 