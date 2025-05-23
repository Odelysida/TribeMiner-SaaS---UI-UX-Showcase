<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMiningStore } from '../../stores/miningStore'
import MiningStats from '../../components/MiningStats.vue'

const store = useMiningStore()
const statsInterval = ref<number>()

onMounted(() => {
  store.fetchPoolStats()
  store.fetchRewards()
  
  // Update stats every 5 seconds for mining view
  statsInterval.value = window.setInterval(() => {
    store.fetchPoolStats()
    store.fetchRewards()
  }, 5000)
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
    <div class="text-center">
      <h1 class="text-4xl font-bold gradient-text mb-4">AUM Token Mining</h1>
      <p class="text-gray-400 text-lg">Join the cloud lottery pool and start earning AUM tokens</p>
    </div>

    <!-- Error Alert -->
    <div v-if="store.error" class="glass-card border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-4 rounded-xl hover-lift">
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

    <!-- Mining Control Panel -->
    <div class="glass-card p-8 rounded-xl hover-lift">
      <h2 class="text-2xl font-bold text-white mb-6 flex items-center justify-center">
        <i class="fas fa-cogs text-primary-400 mr-3"></i>
        Mining Control Panel
      </h2>
      
      <!-- Connection Status -->
      <div class="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">Connection Status</h3>
            <div class="flex items-center space-x-3">
              <div 
                class="status-dot"
                :class="{
                  'status-mining': store.isMining,
                  'status-connected': store.isConnected && !store.isMining,
                  'status-disconnected': !store.isConnected
                }"
              ></div>
              <span class="text-white font-medium">
                {{ store.isMining ? 'Mining Active' : store.isConnected ? 'Ready to Mine' : 'Disconnected' }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-gray-400 text-sm">Hash Rate</p>
            <p class="text-2xl font-bold text-primary-400">{{ Math.round(store.hashRate) }} H/s</p>
          </div>
        </div>
      </div>

      <!-- Mining Controls -->
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

        <!-- Join Pool Button -->
        <button
          v-if="store.isWalletConnected"
          @click="store.joinPool"
          :disabled="store.isLoading || store.isMining"
          class="btn-secondary text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <i class="fas fa-users"></i>
          <span>{{ store.isLoading ? 'Joining...' : 'Join Pool' }}</span>
        </button>

        <!-- Disconnect Wallet Button -->
        <button
          v-if="store.isWalletConnected && !store.isMining"
          @click="store.disconnectWallet"
          class="btn-secondary text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2"
        >
          <i class="fas fa-unlink"></i>
          <span>Disconnect</span>
        </button>
      </div>
      
      <!-- Wallet Info Panel -->
      <div v-if="store.isWalletConnected" class="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
          <i class="fas fa-info-circle text-primary-400 mr-2"></i>
          Wallet Information
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-400 mb-1">Address</p>
            <p class="text-white font-mono text-sm">{{ store.walletAddress }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400 mb-1">Current Rewards</p>
            <p class="text-white font-semibold">{{ store.rewards }} AUM</p>
          </div>
          <div>
            <p class="text-sm text-gray-400 mb-1">Mining Time</p>
            <p class="text-white font-semibold">
              {{ store.isMining ? 'Active' : 'Inactive' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Mining Stats -->
    <div v-if="store.isMining" class="glass-card p-6 rounded-xl hover-lift mining-pulse">
      <h2 class="text-xl font-bold text-white mb-4 flex items-center">
        <i class="fas fa-chart-line text-accent-green mr-3"></i>
        Live Mining Statistics
        <span class="ml-auto text-sm bg-accent-green/20 text-accent-green px-3 py-1 rounded-full animate-pulse">
          ⚡ Mining Active
        </span>
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Current Hash Rate</span>
            <i class="fas fa-tachometer-alt text-primary-400"></i>
          </div>
          <p class="text-2xl font-bold text-white">{{ Math.round(store.hashRate) }} H/s</p>
        </div>
        
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Shares Submitted</span>
            <i class="fas fa-share text-accent-teal"></i>
          </div>
          <p class="text-2xl font-bold text-white">{{ Math.floor(Date.now() / 10000) % 100 }}</p>
        </div>
        
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Session Rewards</span>
            <i class="fas fa-coins text-accent-green"></i>
          </div>
          <p class="text-2xl font-bold text-white">{{ (store.hashRate * 0.01).toFixed(2) }} AUM</p>
        </div>
        
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Efficiency</span>
            <i class="fas fa-bolt text-yellow-400"></i>
          </div>
          <p class="text-2xl font-bold text-white">{{ Math.min(95 + (store.hashRate / 100), 99).toFixed(1) }}%</p>
        </div>
      </div>
    </div>

    <!-- Pool Statistics -->
    <MiningStats class="hover-lift" />

    <!-- Mining Guidelines -->
    <div class="glass-card p-6 rounded-xl hover-lift">
      <h2 class="text-xl font-bold text-white mb-4 flex items-center">
        <i class="fas fa-lightbulb text-yellow-400 mr-3"></i>
        Mining Guidelines
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold text-white mb-3">Getting Started</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-start space-x-2">
              <i class="fas fa-check text-accent-green mt-1"></i>
              <span>Connect your wallet to join the mining pool</span>
            </li>
            <li class="flex items-start space-x-2">
              <i class="fas fa-check text-accent-green mt-1"></i>
              <span>Ensure stable internet connection for optimal mining</span>
            </li>
            <li class="flex items-start space-x-2">
              <i class="fas fa-check text-accent-green mt-1"></i>
              <span>Keep the browser tab active for continuous mining</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-white mb-3">Optimization Tips</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-start space-x-2">
              <i class="fas fa-star text-yellow-400 mt-1"></i>
              <span>Close unnecessary browser tabs to improve performance</span>
            </li>
            <li class="flex items-start space-x-2">
              <i class="fas fa-star text-yellow-400 mt-1"></i>
              <span>Use a desktop computer for better hash rates</span>
            </li>
            <li class="flex items-start space-x-2">
              <i class="fas fa-star text-yellow-400 mt-1"></i>
              <span>Monitor your rewards regularly in the wallet section</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template> 