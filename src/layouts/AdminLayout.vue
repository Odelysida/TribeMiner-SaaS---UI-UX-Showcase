<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useMiningStore } from '../stores/miningStore'

const router = useRouter()
const authStore = useAuthStore()
const miningStore = useMiningStore()

const handleLogout = () => {
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
          <p class="text-gray-400 text-sm">Admin Panel</p>
        </div>

        <!-- Admin Info -->
        <div class="p-4 border-b border-white/10">
          <div class="flex items-center space-x-3">
            <img 
              :src="authStore.user?.avatar" 
              :alt="authStore.user?.username"
              class="w-10 h-10 rounded-full border-2 border-red-500/50"
            />
            <div>
              <p class="text-white font-medium">{{ authStore.user?.username }}</p>
              <div class="flex items-center space-x-2">
                <span class="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4">
          <div class="space-y-2">
            <RouterLink
              to="/admin/dashboard"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-tachometer-alt w-5"></i>
              <span>Overview</span>
            </RouterLink>

            <RouterLink
              to="/admin/users"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-users w-5"></i>
              <span>User Management</span>
              <span class="ml-auto text-xs bg-accent-teal/20 text-accent-teal px-2 py-1 rounded-full">
                {{ miningStore.poolStats.activeMiners }}
              </span>
            </RouterLink>

            <RouterLink
              to="/admin/logs"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-file-alt w-5"></i>
              <span>Server Logs</span>
              <span class="ml-auto w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
            </RouterLink>

            <RouterLink
              to="/admin/settings"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              active-class="bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/25"
            >
              <i class="fas fa-cog w-5"></i>
              <span>Settings</span>
            </RouterLink>

            <!-- Quick Mining Control -->
            <div class="mt-6 pt-4 border-t border-white/10">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Controls</h3>
              <button
                @click="miningStore.isConnected ? miningStore.disconnectFromServer() : miningStore.connectToServer()"
                class="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                :class="miningStore.isConnected ? 'text-red-300' : 'text-accent-green'"
              >
                <i :class="miningStore.isConnected ? 'fas fa-stop' : 'fas fa-play'" class="w-5"></i>
                <span>{{ miningStore.isConnected ? 'Stop Server' : 'Start Server' }}</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- Customer View Link -->
        <div class="p-4 border-t border-white/10">
          <router-link
            to="/app"
            class="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-all duration-200 mb-3"
          >
            <i class="fas fa-external-link-alt"></i>
            <span>View Customer Area</span>
          </router-link>
          
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
  </div>
</template> 