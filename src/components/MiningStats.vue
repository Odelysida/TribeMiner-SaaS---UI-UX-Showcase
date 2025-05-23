<script setup lang="ts">
import { useMiningStore } from '../stores/miningStore'

const store = useMiningStore()
</script>

<template>
  <div class="glass-card p-8 rounded-xl">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
      <i class="fas fa-chart-bar text-primary-400 mr-3"></i>
      Pool Statistics
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Active Miners -->
      <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Active Miners</h3>
          <div class="p-2 bg-accent-purple/20 rounded-lg glow-purple">
            <i class="fas fa-users text-accent-purple"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ store.poolStats.activeMiners }}</p>
        <div class="flex items-center mt-3">
          <i class="fas fa-user-plus text-accent-green mr-2"></i>
          <span class="text-accent-green text-sm">+3 new today</span>
        </div>
      </div>

      <!-- Total Hash Rate -->
      <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Total Hash Rate</h3>
          <div class="p-2 bg-primary-500/20 rounded-lg glow-blue">
            <i class="fas fa-bolt text-primary-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ Math.round(store.poolStats.totalHashRate) }}</p>
        <p class="text-gray-400 text-sm mb-2">H/s</p>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-primary-500 to-accent-cyan h-2 rounded-full transition-all duration-1000"
            :style="{ width: Math.min((store.poolStats.totalHashRate / 10000) * 100, 100) + '%' }"
          ></div>
        </div>
      </div>

      <!-- Pool Balance -->
      <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Pool Balance</h3>
          <div class="p-2 bg-accent-teal/20 rounded-lg glow-teal">
            <i class="fas fa-piggy-bank text-accent-teal"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ store.poolStats.poolBalance.toLocaleString() }}</p>
        <p class="text-gray-400 text-sm">AUM</p>
        <div class="flex items-center mt-3">
          <i class="fas fa-arrow-up text-accent-green mr-2"></i>
          <span class="text-accent-green text-sm">+5.2% this hour</span>
        </div>
      </div>
    </div>

    <!-- Pool Performance Chart Placeholder -->
    <div class="mt-8 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
        <i class="fas fa-chart-line text-primary-400 mr-2"></i>
        Pool Performance (24h)
      </h3>
      <div class="h-32 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-accent-teal/20 rounded-lg flex items-center justify-center">
        <div class="text-center">
          <i class="fas fa-chart-area text-4xl text-gray-500 mb-2"></i>
          <p class="text-gray-400">Performance chart coming soon</p>
        </div>
      </div>
    </div>
  </div>
</template> 