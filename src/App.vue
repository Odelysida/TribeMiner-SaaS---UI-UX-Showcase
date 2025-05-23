<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { useMiningStore } from './stores/miningStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const miningStore = useMiningStore()

onMounted(() => {
  // Load stored authentication state
  authStore.loadStoredAuth()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-dark text-white">
    <!-- Navigation - Only show if user is authenticated -->
    <nav v-if="authStore.isAuthenticated" class="glass-card border-b border-white/10 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Desktop Navigation -->
          <div class="flex items-center">
            <RouterLink 
              :to="authStore.user?.role === 'admin' ? '/admin' : '/app'" 
              class="text-2xl font-bold gradient-text"
            >
              TribeMiner
            </RouterLink>
            <div class="hidden md:block ml-10" v-if="authStore.user?.role === 'customer'">
              <div class="flex items-baseline space-x-1">
                <RouterLink
                  to="/app/dashboard"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-chart-line mr-2"></i>Dashboard
                </RouterLink>
                <RouterLink
                  to="/app/mining"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-hammer mr-2"></i>Mining
                </RouterLink>
                <RouterLink
                  to="/app/wallet"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-wallet mr-2"></i>Wallet
                </RouterLink>
                <RouterLink
                  to="/app/chat"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-comments mr-2"></i>Chat
                </RouterLink>
              </div>
            </div>
            <div class="hidden md:block ml-10" v-if="authStore.user?.role === 'admin'">
              <div class="flex items-baseline space-x-1">
                <RouterLink
                  to="/admin/dashboard"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-chart-line mr-2"></i>Dashboard
                </RouterLink>
                <RouterLink
                  to="/admin/users"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-users mr-2"></i>Users
                </RouterLink>
                <RouterLink
                  to="/admin/logs"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-file-alt mr-2"></i>Logs
                </RouterLink>
                <RouterLink
                  to="/admin/settings"
                  class="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
                >
                  <i class="fas fa-cog mr-2"></i>Settings
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- User Info and Actions -->
          <div class="flex items-center space-x-4">
            <!-- Mining Status (for customers only) -->
            <div v-if="authStore.user?.role === 'customer'" class="flex items-center space-x-2">
              <div 
                class="status-dot"
                :class="{
                  'status-connected': miningStore.isConnected && !miningStore.isMining,
                  'status-mining': miningStore.isMining,
                  'status-disconnected': !miningStore.isConnected
                }"
              ></div>
              <span class="text-sm text-gray-400">
                {{ miningStore.isMining ? 'Mining' : miningStore.isConnected ? 'Connected' : 'Disconnected' }}
              </span>
            </div>

            <!-- User Info -->
            <div class="flex items-center space-x-3">
              <div class="bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <div class="flex items-center space-x-2">
                  <i class="fas fa-user text-primary-400"></i>
                  <span class="text-sm text-gray-300">{{ authStore.user?.username }}</span>
                  <span class="text-xs text-gray-500 px-2 py-1 bg-white/10 rounded-full">
                    {{ authStore.user?.role }}
                  </span>
                </div>
              </div>
              
              <!-- Logout Button -->
              <button
                @click="authStore.logout"
                class="text-gray-400 hover:text-white transition-colors duration-200 p-2"
                title="Logout"
              >
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden border-t border-white/10" v-if="authStore.user?.role === 'customer'">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <RouterLink
              to="/app/dashboard"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-chart-line mr-2"></i>Dashboard
            </RouterLink>
            <RouterLink
              to="/app/mining"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-hammer mr-2"></i>Mining
            </RouterLink>
            <RouterLink
              to="/app/wallet"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-wallet mr-2"></i>Wallet
            </RouterLink>
            <RouterLink
              to="/app/chat"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-comments mr-2"></i>Chat
            </RouterLink>
          </div>
        </div>
        
        <!-- Admin Mobile Navigation -->
        <div class="md:hidden border-t border-white/10" v-if="authStore.user?.role === 'admin'">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <RouterLink
              to="/admin/dashboard"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-chart-line mr-2"></i>Dashboard
            </RouterLink>
            <RouterLink
              to="/admin/users"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-users mr-2"></i>Users
            </RouterLink>
            <RouterLink
              to="/admin/logs"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-file-alt mr-2"></i>Logs
            </RouterLink>
            <RouterLink
              to="/admin/settings"
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300"
            >
              <i class="fas fa-cog mr-2"></i>Settings
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="relative">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-connected {
  background-color: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.status-mining {
  background-color: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
  animation: pulse 2s infinite;
}

.status-disconnected {
  background-color: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
