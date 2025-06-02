<script setup lang="ts">
import { ref } from 'vue'
import { useMiningStore } from '../../stores/miningStore'
import { useAuthStore } from '../../stores/authStore'

const miningStore = useMiningStore()
const authStore = useAuthStore()

const transferAmount = ref('')
const transferAddress = ref('')
const isTransferring = ref(false)

const handleTransfer = async () => {
  if (!transferAmount.value || !transferAddress.value) return
  
  isTransferring.value = true
  
  // Simulate transfer delay
  setTimeout(() => {
    // In real app, this would make API call
    console.log(`Transferring ${transferAmount.value} AUM to ${transferAddress.value}`)
    transferAmount.value = ''
    transferAddress.value = ''
    isTransferring.value = false
    
    // Show success message
    alert('Transfer successful!')
  }, 2000)
}

const transactions = ref([
  {
    id: '1',
    type: 'reward',
    amount: 125.50,
    timestamp: new Date(Date.now() - 3600000),
    status: 'completed',
    description: 'Mining reward'
  },
  {
    id: '2',
    type: 'transfer',
    amount: -50.00,
    timestamp: new Date(Date.now() - 7200000),
    status: 'completed',
    description: 'Transfer to 0x742b70151cd3bc5b5fcbae5b9e96fb75ec8c2a20'
  },
  {
    id: '3',
    type: 'reward',
    amount: 89.25,
    timestamp: new Date(Date.now() - 10800000),
    status: 'completed',
    description: 'Mining reward'
  },
  {
    id: '4',
    type: 'transfer',
    amount: -25.00,
    timestamp: new Date(Date.now() - 14400000),
    status: 'pending',
    description: 'Transfer to 0x8ba1f109551bd432803012645hac136c3c16bf6'
  }
])

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'reward': return 'fas fa-plus-circle'
    case 'transfer': return 'fas fa-arrow-right'
    default: return 'fas fa-circle'
  }
}

const getTransactionColor = (type: string, amount: number) => {
  if (type === 'reward' || amount > 0) return 'text-accent-green'
  return 'text-red-400'
}

const copyAddress = async () => {
  if (authStore.user?.walletAddress) {
    try {
      await navigator.clipboard.writeText(authStore.user.walletAddress)
      // You could add a toast notification here
      console.log('Address copied to clipboard')
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Wallet</h1>
      <p class="text-gray-400">Manage your AUM tokens and transactions</p>
    </div>

    <!-- Wallet Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Balance Card -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">AUM Balance</h3>
          <div class="p-2 bg-accent-teal/20 rounded-lg glow-teal">
            <i class="fas fa-coins text-accent-teal"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ miningStore.rewards.toLocaleString() }}</p>
        <p class="text-gray-400 text-sm">Available tokens</p>
        <div class="flex items-center mt-3">
          <i class="fas fa-trending-up text-accent-green mr-2"></i>
          <span class="text-accent-green text-sm">+15.2% this month</span>
        </div>
      </div>

      <!-- Wallet Address Card -->
      <div class="glass-card p-6 rounded-xl hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Wallet Address</h3>
          <div class="p-2 bg-primary-500/20 rounded-lg glow-blue">
            <i class="fas fa-wallet text-primary-400"></i>
          </div>
        </div>
        <p class="text-white font-mono text-sm break-all mb-2">
          {{ authStore.user?.walletAddress || 'Not connected' }}
        </p>
        <button
          v-if="authStore.user?.walletAddress"
          @click="copyAddress"
          class="text-primary-400 hover:text-primary-300 text-sm transition-colors duration-200"
        >
          <i class="fas fa-copy mr-1"></i>
          Copy Address
        </button>
      </div>

      <!-- Mining Earnings Card -->
      <div class="glass-card p-6 rounded-xl hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Mining Earnings</h3>
          <div class="p-2 bg-purple-500/20 rounded-lg glow-purple">
            <i class="fas fa-hammer text-purple-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">
          {{ transactions.filter(t => t.type === 'reward').reduce((sum, t) => sum + t.amount, 0).toLocaleString() }}
        </p>
        <p class="text-gray-400 text-sm">Total mined AUM</p>
        <div class="flex items-center mt-3">
          <i class="fas fa-clock text-yellow-400 mr-2"></i>
          <span class="text-yellow-300 text-sm">Last reward 1h ago</span>
        </div>
      </div>
    </div>

    <!-- Transfer Section -->
    <div class="glass-card p-6 rounded-xl hover-lift">
      <h2 class="text-xl font-bold text-white mb-4 flex items-center">
        <i class="fas fa-paper-plane text-primary-400 mr-3"></i>
        Send AUM Tokens
      </h2>
      
      <form @submit.prevent="handleTransfer" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Recipient Address</label>
          <input
            v-model="transferAddress"
            type="text"
            placeholder="0x..."
            required
            class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          />
        </div>
        
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Amount (AUM)</label>
          <input
            v-model="transferAmount"
            type="number"
            step="0.01"
            min="0.01"
            :max="miningStore.rewards"
            placeholder="0.00"
            required
            class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          />
        </div>
        
        <div class="flex items-end">
          <button
            type="submit"
            :disabled="isTransferring || !transferAmount || !transferAddress || parseFloat(transferAmount) > miningStore.rewards"
            class="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <i v-if="isTransferring" class="fas fa-spinner animate-spin"></i>
            <i v-else class="fas fa-paper-plane"></i>
            <span>{{ isTransferring ? 'Sending...' : 'Send Tokens' }}</span>
          </button>
        </div>
      </form>
      
      <div class="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <div class="flex items-center space-x-2 text-sm text-gray-400">
          <i class="fas fa-info-circle"></i>
          <span>Available balance: {{ miningStore.rewards.toLocaleString() }} AUM</span>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="bg-white/5 border-b border-white/10 p-6">
        <h2 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-history text-primary-400 mr-3"></i>
          Transaction History
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5 border-b border-white/10">
            <tr>
              <th class="text-left p-4 text-gray-300 font-medium">Type</th>
              <th class="text-left p-4 text-gray-300 font-medium">Amount</th>
              <th class="text-left p-4 text-gray-300 font-medium">Description</th>
              <th class="text-left p-4 text-gray-300 font-medium">Date</th>
              <th class="text-left p-4 text-gray-300 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in transactions"
              :key="transaction.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
            >
              <td class="p-4">
                <div class="flex items-center space-x-3">
                  <i 
                    :class="[getTransactionIcon(transaction.type), getTransactionColor(transaction.type, transaction.amount)]"
                  ></i>
                  <span class="text-white capitalize">{{ transaction.type }}</span>
                </div>
              </td>
              <td class="p-4">
                <span 
                  class="font-semibold"
                  :class="getTransactionColor(transaction.type, transaction.amount)"
                >
                  {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount.toLocaleString() }} AUM
                </span>
              </td>
              <td class="p-4">
                <span class="text-gray-300">{{ transaction.description }}</span>
              </td>
              <td class="p-4">
                <span class="text-gray-400 text-sm">{{ formatDate(transaction.timestamp) }}</span>
              </td>
              <td class="p-4">
                <span 
                  class="text-xs px-2 py-1 rounded-full border"
                  :class="{
                    'bg-accent-green/20 text-accent-green border-accent-green/30': transaction.status === 'completed',
                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30': transaction.status === 'pending',
                    'bg-red-500/20 text-red-300 border-red-500/30': transaction.status === 'failed'
                  }"
                >
                  {{ transaction.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Wallet Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-card p-6 rounded-xl hover-lift text-center">
        <div class="mb-4">
          <div class="w-12 h-12 bg-primary-500/20 rounded-full mx-auto flex items-center justify-center glow-blue">
            <i class="fas fa-download text-primary-400 text-xl"></i>
          </div>
        </div>
        <h3 class="text-white font-semibold mb-2">Export Transactions</h3>
        <p class="text-gray-400 text-sm mb-4">Download your transaction history as CSV</p>
        <button class="btn-secondary text-white px-4 py-2 rounded-lg text-sm font-medium">
          Export CSV
        </button>
      </div>

      <div class="glass-card p-6 rounded-xl hover-lift text-center">
        <div class="mb-4">
          <div class="w-12 h-12 bg-accent-teal/20 rounded-full mx-auto flex items-center justify-center glow-teal">
            <i class="fas fa-qrcode text-accent-teal text-xl"></i>
          </div>
        </div>
        <h3 class="text-white font-semibold mb-2">QR Code</h3>
        <p class="text-gray-400 text-sm mb-4">Share your wallet address via QR code</p>
        <button class="btn-secondary text-white px-4 py-2 rounded-lg text-sm font-medium">
          Generate QR
        </button>
      </div>

      <div class="glass-card p-6 rounded-xl hover-lift text-center">
        <div class="mb-4">
          <div class="w-12 h-12 bg-purple-500/20 rounded-full mx-auto flex items-center justify-center glow-purple">
            <i class="fas fa-shield-alt text-purple-400 text-xl"></i>
          </div>
        </div>
        <h3 class="text-white font-semibold mb-2">Security</h3>
        <p class="text-gray-400 text-sm mb-4">Manage wallet security settings</p>
        <button class="btn-secondary text-white px-4 py-2 rounded-lg text-sm font-medium">
          Settings
        </button>
      </div>
    </div>
  </div>
</template> 