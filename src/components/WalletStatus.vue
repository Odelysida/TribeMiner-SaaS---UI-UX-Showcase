<script setup lang="ts">
import { useMiningStore } from '../stores/miningStore'

const store = useMiningStore()
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-4">Wallet Status</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-700 p-4 rounded-lg">
        <h3 class="text-gray-400 mb-2">Address</h3>
        <p class="text-sm font-mono break-all">{{ store.walletAddress || 'Not Connected' }}</p>
      </div>
      <div class="bg-gray-700 p-4 rounded-lg">
        <h3 class="text-gray-400 mb-2">Balance</h3>
        <p class="text-2xl font-bold">{{ store.rewards }} AUM</p>
      </div>
    </div>
  </div>
</template> 