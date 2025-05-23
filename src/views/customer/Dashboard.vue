<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMiningStore } from '../../stores/miningStore'
import { useAuthStore } from '../../stores/authStore'
import MiningStats from '../../components/MiningStats.vue'

const miningStore = useMiningStore()
const authStore = useAuthStore()
const statsInterval = ref<number>()

onMounted(() => {
  miningStore.fetchPoolStats()
  miningStore.fetchRewards()
  
  // Update stats every 10 seconds
  statsInterval.value = window.setInterval(() => {
    miningStore.fetchPoolStats()
    miningStore.fetchRewards()
  }, 10000)
})

onUnmounted(() => {
  if (statsInterval.value) {
    clearInterval(statsInterval.value)
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">
          Welcome back, {{ authStore.user?.username }}!
        </h1>
        <p class="text-gray-400">Monitor your AUM token mining operations</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-sm text-gray-400">Mining Status</p>
          <div class="flex items-center space-x-2">
            <div 
              class="status-dot"
              :class="{
                'status-mining': miningStore.isMining,
                'status-connected': miningStore.isConnected && !miningStore.isMining,
                'status-disconnected': !miningStore.isConnected
              }"
            ></div>
            <span class="text-white font-medium">
              {{ miningStore.isMining ? 'Mining Active' : miningStore.isConnected ? 'Ready' : 'Disconnected' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="miningStore.error" class="glass-card border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-4 rounded-xl hover-lift">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
          <span class="text-red-200">{{ miningStore.error }}</span>
        </div>
        <button 
          @click="miningStore.error = ''"
          class="text-red-300 hover:text-white transition-colors duration-200"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Hash Rate Card -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Your Hash Rate</h3>
          <div class="p-2 bg-primary-500/20 rounded-lg glow-blue">
            <i class="fas fa-tachometer-alt text-primary-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ Math.round(miningStore.hashRate) }}</p>
        <p class="text-gray-400 text-sm">H/s</p>
        <div v-if="miningStore.isMining" class="flex items-center mt-3">
          <div class="status-dot status-mining mr-2"></div>
          <span class="text-primary-300 text-sm font-medium">Mining Active</span>
        </div>
      </div>

      <!-- Rewards Card -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Total Rewards</h3>
          <div class="p-2 bg-accent-teal/20 rounded-lg glow-teal">
            <i class="fas fa-coins text-accent-teal"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ miningStore.rewards }}</p>
        <p class="text-gray-400 text-sm">AUM</p>
        <div class="flex items-center mt-3">
          <i class="fas fa-trending-up text-accent-green mr-2"></i>
          <span class="text-accent-green text-sm">+12.5% this week</span>
        </div>
      </div>

      <!-- Estimated Earnings -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Est. Daily Earnings</h3>
          <div class="p-2 bg-purple-500/20 rounded-lg glow-purple">
            <i class="fas fa-calculator text-purple-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">
          {{ miningStore.isMining ? (Math.round(miningStore.hashRate * 0.05 * 24)).toLocaleString() : '0' }}
        </p>
        <p class="text-gray-400 text-sm">AUM / day</p>
        <div class="flex items-center mt-3">
          <i class="fas fa-clock text-yellow-400 mr-2"></i>
          <span class="text-yellow-300 text-sm">Based on current hash rate</span>
        </div>
      </div>
    </div>

    <!-- Pool Statistics -->
    <MiningStats class="hover-lift" />

    <!-- Quick Actions -->
    <div class="glass-card p-6 rounded-xl hover-lift">
      <h2 class="text-xl font-bold text-white mb-4 flex items-center">
        <i class="fas fa-bolt text-primary-400 mr-3"></i>
        Quick Actions
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/app/mining"
          class="flex items-center justify-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 hover-lift"
        >
          <i class="fas fa-hammer text-primary-400 text-xl"></i>
          <span class="text-white font-medium">Go to Mining</span>
        </router-link>

        <router-link
          to="/app/wallet"
          class="flex items-center justify-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 hover-lift"
        >
          <i class="fas fa-wallet text-accent-teal text-xl"></i>
          <span class="text-white font-medium">View Wallet</span>
        </router-link>

        <router-link
          to="/app/profile"
          class="flex items-center justify-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 hover-lift"
        >
          <i class="fas fa-user text-purple-400 text-xl"></i>
          <span class="text-white font-medium">Edit Profile</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="glass-card p-6 rounded-xl hover-lift">
      <h2 class="text-xl font-bold text-white mb-4 flex items-center">
        <i class="fas fa-history text-primary-400 mr-3"></i>
        Recent Activity
      </h2>
      
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-accent-green rounded-full"></div>
            <span class="text-white">Mining session started</span>
          </div>
          <span class="text-gray-400 text-sm">2 hours ago</span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-accent-teal rounded-full"></div>
            <span class="text-white">Reward credited: 156.7 AUM</span>
          </div>
          <span class="text-gray-400 text-sm">5 hours ago</span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-primary-400 rounded-full"></div>
            <span class="text-white">Wallet connected</span>
          </div>
          <span class="text-gray-400 text-sm">1 day ago</span>
        </div>
      </div>
    </div>
  </div>
</template> 