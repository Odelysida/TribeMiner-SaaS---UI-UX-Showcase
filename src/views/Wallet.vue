<script setup lang="ts">
import { ref } from 'vue'
import { useMiningStore } from '../stores/miningStore'

const store = useMiningStore()
const recipientAddress = ref('')
const transferAmount = ref(0)

const handleTransfer = async () => {
  // Implement transfer logic here
  console.log('Transfer:', {
    to: recipientAddress.value,
    amount: transferAmount.value
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Wallet Status -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">Wallet Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-700 p-4 rounded-lg">
            <h3 class="text-gray-400 mb-2">Wallet Address</h3>
            <p class="text-sm font-mono break-all">{{ store.walletAddress || 'Not Connected' }}</p>
          </div>
          <div class="bg-gray-700 p-4 rounded-lg">
            <h3 class="text-gray-400 mb-2">AUM Balance</h3>
            <p class="text-2xl font-bold">{{ store.rewards }} AUM</p>
          </div>
        </div>
      </div>

      <!-- Transfer Tokens -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">Transfer AUM Tokens</h2>
        <form @submit.prevent="handleTransfer" class="space-y-4">
          <div>
            <label class="block text-gray-400 mb-2">Recipient Address</label>
            <input
              v-model="recipientAddress"
              type="text"
              class="w-full bg-gray-700 rounded-lg p-3 text-white"
              placeholder="Enter recipient address"
            />
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Amount (AUM)</label>
            <input
              v-model="transferAmount"
              type="number"
              min="0"
              step="0.000001"
              class="w-full bg-gray-700 rounded-lg p-3 text-white"
              placeholder="Enter amount to transfer"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Transfer Tokens
          </button>
        </form>
      </div>

      <!-- Transaction History -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Transaction History</h2>
        <div class="space-y-4">
          <!-- Example transaction, replace with actual data -->
          <div class="bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm text-gray-400">To: 0x1234...5678</p>
                <p class="text-sm text-gray-400">Amount: 100 AUM</p>
              </div>
              <span class="text-green-500">Completed</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">2024-03-21 14:30:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 