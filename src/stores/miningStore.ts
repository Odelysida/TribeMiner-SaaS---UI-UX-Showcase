import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

export const useMiningStore = defineStore('mining', () => {
  const isConnected = ref(false)
  const isMining = ref(false)
  const hashRate = ref(0)
  const rewards = ref(0)
  const poolStats = ref({
    activeMiners: 0,
    totalHashRate: 0,
    poolBalance: 0
  })
  const error = ref('')
  const isLoading = ref(false)

  const walletAddress = ref('')
  const isWalletConnected = computed(() => walletAddress.value !== '')

  async function connectWallet(address: string) {
    isLoading.value = true
    error.value = ''
    walletAddress.value = address
    
    try {
      const response = await fetch(`${API_BASE_URL}/pool/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress: address })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success) {
        isConnected.value = true
        error.value = ''
      } else {
        error.value = data.message || 'Failed to connect wallet'
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err)
      error.value = 'Failed to connect to mining pool. Please try again.'
      isConnected.value = false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPoolStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/pool/stats`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      poolStats.value = data
      error.value = ''
    } catch (err) {
      console.error('Failed to fetch pool stats:', err)
      error.value = 'Failed to fetch pool statistics'
    }
  }

  async function fetchRewards() {
    if (!walletAddress.value) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/${walletAddress.value}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      rewards.value = data.rewards
      error.value = ''
    } catch (err) {
      console.error('Failed to fetch rewards:', err)
      error.value = 'Failed to fetch mining rewards'
    }
  }

  // WebSocket connection for real-time updates
  let ws: WebSocket | null = null
  let miningInterval: number | null = null

  function connectWebSocket() {
    if (ws && ws.readyState === WebSocket.OPEN) return
    
    try {
      ws = new WebSocket(`ws://localhost:3000/mining-status`)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        error.value = ''
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.hashRate) {
          hashRate.value = data.hashRate
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        ws = null
        if (isMining.value) {
          // Try to reconnect after 5 seconds if still mining
          setTimeout(connectWebSocket, 5000)
        }
      }

      ws.onerror = (err) => {
        console.error('WebSocket error:', err)
        error.value = 'WebSocket connection failed'
        ws?.close()
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      error.value = 'Failed to establish real-time connection'
    }
  }

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
    
    // Start WebSocket connection
    connectWebSocket()
    
    // Simulate mining with increasing hash rate
    miningInterval = window.setInterval(() => {
      if (isMining.value) {
        // Gradually increase hash rate
        hashRate.value = Math.min(hashRate.value + Math.random() * 100, 2000)
        
        // Send mining update to server via WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'mining_update',
            walletAddress: walletAddress.value,
            hashRate: hashRate.value
          }))
        }
      }
    }, 2000)
    
    console.log('Mining started')
  }

  function stopMining() {
    isMining.value = false
    hashRate.value = 0
    
    // Close WebSocket connection
    if (ws) {
      ws.close()
      ws = null
    }
    
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
    fetchPoolStats,
    fetchRewards,
    startMining,
    stopMining
  }
}) 