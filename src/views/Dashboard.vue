<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMiningStore } from '../stores/miningStore'
import MiningStats from '../components/MiningStats.vue'

const store = useMiningStore()
const statsInterval = ref<number>()

onMounted(() => {
  store.fetchPoolStats()
  store.fetchRewards()
  
  // Update stats every 10 seconds
  statsInterval.value = window.setInterval(() => {
    store.fetchPoolStats()
    store.fetchRewards()
  }, 10000)
})

onUnmounted(() => {
  if (statsInterval.value) {
    clearInterval(statsInterval.value)
  }
  store.stopMining()
})
</script>

<template>
  <div class="min-h-screen p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center py-8">
        <h1 class="text-4xl font-bold gradient-text mb-4">Mining Dashboard</h1>
        <p class="text-gray-400 text-lg">Monitor your AUM token mining operations</p>
      </div>

      <!-- Error Alert -->
      <div v-if="store.error" class="glass-card border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-4 rounded-xl mb-8 hover-lift">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
            <span class="text-red-200">{{ store.error }}</span>
          </div>
          <button 
            @click="store.error = ''"
            class="text-red-300 hover:text-white transition-colors duration-200"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Mining Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Hash Rate Card -->
        <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-300 font-medium">Hash Rate</h3>
            <div class="p-2 bg-primary-500/20 rounded-lg glow-blue">
              <i class="fas fa-tachometer-alt text-primary-400"></i>
            </div>
          </div>
          <p class="text-3xl font-bold text-white mb-2">{{ Math.round(store.hashRate) }}</p>
          <p class="text-gray-400 text-sm">H/s</p>
          <div v-if="store.isMining" class="flex items-center mt-3">
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
          <p class="text-3xl font-bold text-white mb-2">{{ store.rewards }}</p>
          <p class="text-gray-400 text-sm">AUM</p>
          <div class="flex items-center mt-3">
            <i class="fas fa-trending-up text-accent-green mr-2"></i>
            <span class="text-accent-green text-sm">+12.5% this week</span>
          </div>
        </div>

        <!-- Connection Status Card -->
        <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-300 font-medium">Connection</h3>
            <div class="p-2 bg-purple-500/20 rounded-lg glow-purple">
              <i class="fas fa-wifi text-purple-400"></i>
            </div>
          </div>
          <p class="text-2xl font-bold mb-2" :class="store.isConnected ? 'text-accent-green' : 'text-red-400'">
            {{ store.isConnected ? 'Connected' : 'Disconnected' }}
          </p>
          <div v-if="store.isConnected && store.isMining" class="flex items-center mt-3">
            <div class="status-dot status-mining mr-2"></div>
            <span class="text-yellow-300 text-sm font-medium mining-pulse">⚡ Mining in Progress</span>
          </div>
        </div>
      </div>

      <!-- Pool Statistics -->
      <MiningStats class="hover-lift" />

      <!-- Mining Controls -->
      <div class="glass-card p-8 rounded-xl hover-lift">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
          <i class="fas fa-cogs text-primary-400 mr-3"></i>
          Mining Controls
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Connect Wallet Button -->
          <button
            v-if="!store.isWalletConnected"
            @click="store.connectWallet('DEMO_WALLET_ADDRESS')"
            :disabled="store.isLoading"
            class="btn-primary text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <i class="fas fa-link"></i>
            <span>{{ store.isLoading ? 'Connecting...' : 'Connect Wallet' }}</span>
          </button>

          <!-- Start Mining Button -->
          <button
            v-if="store.isWalletConnected && !store.isMining"
            @click="store.startMining"
            :disabled="!store.isConnected"
            class="bg-accent-green hover:bg-accent-green/80 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 glow-blue"
          >
            <i class="fas fa-play"></i>
            <span>Start Mining</span>
          </button>

          <!-- Stop Mining Button -->
          <button
            v-if="store.isMining"
            @click="store.stopMining"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <i class="fas fa-stop"></i>
            <span>Stop Mining</span>
          </button>

          <!-- Disconnect Wallet Button -->
          <button
            v-if="store.isWalletConnected"
            @click="store.disconnectWallet"
            class="btn-secondary text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2"
          >
            <i class="fas fa-unlink"></i>
            <span>Disconnect</span>
          </button>
        </div>
        
        <!-- Mining Info Panel -->
        <div v-if="store.isWalletConnected" class="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
          <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
            <i class="fas fa-info-circle text-primary-400 mr-2"></i>
            Wallet Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-400 mb-1">Address</p>
              <p class="text-white font-mono text-sm">{{ store.walletAddress }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400 mb-1">Status</p>
              <div class="flex items-center space-x-2">
                <div 
                  class="status-dot"
                  :class="{
                    'status-mining': store.isMining,
                    'status-connected': store.isConnected && !store.isMining,
                    'status-disconnected': !store.isConnected
                  }"
                ></div>
                <span class="text-white text-sm font-medium">
                  {{ store.isMining ? 'Mining' : store.isConnected ? 'Ready to Mine' : 'Disconnected' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 