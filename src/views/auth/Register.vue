<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.error = 'Passwords do not match'
    return
  }

  const result = await authStore.register({
    username: username.value,
    email: email.value,
    password: password.value
  })

  if (result.success) {
    // Redirect to customer area for new users
    router.push('/app')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold gradient-text mb-2">TribeMiner</h1>
        <p class="text-gray-400">Create your mining account</p>
      </div>

      <!-- Register Form -->
      <div class="glass-card p-8 rounded-xl">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg">
            {{ authStore.error }}
          </div>

          <!-- Username Field -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Username</label>
            <input
              v-model="username"
              type="text"
              required
              minlength="3"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              placeholder="Choose a username"
            />
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
                minlength="6"
                class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                placeholder="Create a password"
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

          <!-- Confirm Password Field -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <i v-if="authStore.isLoading" class="fas fa-spinner animate-spin"></i>
            <span>{{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}</span>
          </button>
        </form>

        <!-- Terms Notice -->
        <div class="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p class="text-xs text-gray-400 text-center">
            By creating an account, you agree to our 
            <a href="#" class="text-primary-400 hover:text-primary-300">Terms of Service</a> 
            and 
            <a href="#" class="text-primary-400 hover:text-primary-300">Privacy Policy</a>
          </p>
        </div>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Already have an account?
            <router-link to="/login" class="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 