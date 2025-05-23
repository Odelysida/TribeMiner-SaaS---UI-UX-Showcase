<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useMiningStore } from '../stores/miningStore'
import LiveChat from '../components/LiveChat.vue'

const router = useRouter()
const authStore = useAuthStore()
const miningStore = useMiningStore()

const handleLogout = () => {
  miningStore.stopMining()
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-dark">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 glass-card border-r border-white/10 z-50">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-6 border-b border-white/10">
          <h1 class="text-2xl font-bold gradient-text">TribeMiner</h1>
          <p class="text-gray-400 text-sm">Mining Dashboard</p>
        </div>

        <!-- User Info -->
        <div class="p-4 border-b border-white/10">
          <div class="flex items-center space-x-3">
            <img 
              :src="authStore.user?.avatar" 
              :alt="authStore.user?.username"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <p class="text-white font-medium">{{ authStore.user?.username }}</p>
              <p class="text-gray-400 text-sm">{{ authStore.user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4">
          <div class="space-y-2">
            <RouterLink
              to="/app/dashboard"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-chart-line w-5"></i>
              <span>Dashboard</span>
            </RouterLink>

            <RouterLink
              to="/app/mining"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-hammer w-5"></i>
              <span>Mining</span>
              <div 
                v-if="miningStore.isMining"
                class="ml-auto status-dot status-mining"
              ></div>
            </RouterLink>

            <RouterLink
              to="/app/wallet"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-wallet w-5"></i>
              <span>Wallet</span>
              <span v-if="miningStore.rewards > 0" class="ml-auto text-xs bg-accent-teal/20 text-accent-teal px-2 py-1 rounded-full">
                {{ miningStore.rewards }} AUM
              </span>
            </RouterLink>

            <RouterLink
              to="/app/profile"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-user w-5"></i>
              <span>Profile</span>
            </RouterLink>

            <RouterLink
              to="/app/chat"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-comments w-5"></i>
              <span>Live Chat</span>
              <span class="ml-auto w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
            </RouterLink>
          </div>
        </nav>

        <!-- Logout Button -->
        <div class="p-4 border-t border-white/10">
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-all duration-200"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <main class="p-6">
        <RouterView />
      </main>
    </div>

    <!-- Live Chat Component -->
    <LiveChat />
  </div>
</template> 