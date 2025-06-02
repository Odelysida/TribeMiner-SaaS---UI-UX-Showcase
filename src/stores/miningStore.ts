import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mock data for testing
const MOCK_POOL_STATS = {
  activeMiners: 42,
  totalHashRate: 15420,
  poolBalance: 2847.56,
  blocksFound: 156,
  efficiency: 98.5
}

const MOCK_REWARDS_DATA = {
  'DEMO_WALLET_ADDRESS': 125.43,
  'TEST_WALLET_1': 89.21,
  'TEST_WALLET_2': 234.67
}

export const useMiningStore = defineStore('mining', () => {
  const isConnected = ref(false)
  const isMining = ref(false)
  const hashRate = ref(0)
  const rewards = ref(0)
  const poolStats = ref({ ...MOCK_POOL_STATS })
  const error = ref('')
  const isLoading = ref(false)

  const walletAddress = ref('')
  const isWalletConnected = computed(() => walletAddress.value !== '')

  async function connectWallet(address: string) {
    isLoading.value = true
    error.value = ''
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    walletAddress.value = address
    isConnected.value = true
    
    // Load mock rewards for this wallet
    rewards.value = MOCK_REWARDS_DATA[address as keyof typeof MOCK_REWARDS_DATA] || 0
    
    isLoading.value = false
  }

  async function fetchPoolStats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Add some randomness to make it feel more realistic
    poolStats.value = {
      activeMiners: MOCK_POOL_STATS.activeMiners + Math.floor(Math.random() * 10 - 5),
      totalHashRate: MOCK_POOL_STATS.totalHashRate + Math.floor(Math.random() * 1000 - 500),
      poolBalance: MOCK_POOL_STATS.poolBalance + Math.random() * 100 - 50,
      blocksFound: MOCK_POOL_STATS.blocksFound + Math.floor(Math.random() * 10 - 5),
      efficiency: MOCK_POOL_STATS.efficiency + Math.random() * 0.5
    }
    error.value = ''
  }

  async function fetchRewards() {
    if (!walletAddress.value) return
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Get mock rewards or default to 0
    rewards.value = MOCK_REWARDS_DATA[walletAddress.value as keyof typeof MOCK_REWARDS_DATA] || 0
    error.value = ''
  }

  // Mock mining simulation
  let miningInterval: number | null = null

  function startMining() {
    if (!isWalletConnected.value) {
      error.value = 'Please connect your wallet first'
      return
    }
    
    if (isMining.value) {
      error.value = 'Mining is already active'
      return
    }

    isMining.value = true
    error.value = ''
    
    // Simulate mining with increasing hash rate
    miningInterval = window.setInterval(() => {
      if (isMining.value) {
        // Gradually increase hash rate with some randomness
        const targetHashRate = 1500 + Math.random() * 500
        const currentRate = hashRate.value
        const increment = (targetHashRate - currentRate) * 0.1 + Math.random() * 50
        hashRate.value = Math.min(currentRate + increment, 2000)
        
        // Occasionally update rewards (simulate finding blocks)
        if (Math.random() < 0.1) { // 10% chance every interval
          rewards.value += Math.random() * 0.5
        }
      }
    }, 2000)
    
    console.log('Mining started (mock mode)')
  }

  function stopMining() {
    isMining.value = false
    hashRate.value = 0
    
    // Clear mining simulation interval
    if (miningInterval) {
      clearInterval(miningInterval)
      miningInterval = null
    }
    
    console.log('Mining stopped')
  }

  function disconnectWallet() {
    stopMining()
    walletAddress.value = ''
    isConnected.value = false
    rewards.value = 0
    error.value = ''
  }

  // Mock server connection methods for compatibility
  async function connectToServer() {
    isLoading.value = true
    error.value = ''
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    isConnected.value = true
    isLoading.value = false
    
    // Start fetching pool stats
    fetchPoolStats()
    
    console.log('Connected to server (mock mode)')
  }

  async function disconnectFromServer() {
    stopMining()
    isConnected.value = false
    error.value = ''
    
    console.log('Disconnected from server')
  }

  async function joinPool() {
    if (!isWalletConnected.value) {
      error.value = 'Please connect your wallet first'
      return
    }
    
    if (!isConnected.value) {
      await connectToServer()
    }
    
    // Simulate joining pool
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Joined mining pool (mock mode)')
  }

  // Auto-update pool stats periodically
  setInterval(() => {
    if (!isLoading.value) {
      fetchPoolStats()
    }
  }, 30000) // Update every 30 seconds

  return {
    isConnected,
    isMining,
    hashRate,
    rewards,
    poolStats,
    walletAddress,
    isWalletConnected,
    error,
    isLoading,
    connectWallet,
    disconnectWallet,
    connectToServer,
    disconnectFromServer,
    joinPool,
    fetchPoolStats,
    fetchRewards,
    startMining,
    stopMining
  }
}) 