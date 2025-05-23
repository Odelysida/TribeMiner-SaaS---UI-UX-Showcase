<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMiningStore } from '../../stores/miningStore'

const miningStore = useMiningStore()

const systemStats = ref({
  uptime: '2d 14h 32m',
  totalUsers: 1247,
  activeUsers: 89,
  totalHashRate: 2847000,
  totalRewards: 156789,
  serverLoad: 67,
  memoryUsage: 78,
  networkTraffic: 234.5
})

const recentActivity = ref([
  {
    id: 1,
    type: 'user_joined',
    message: 'New user registered: CryptoMiner2024',
    timestamp: new Date(Date.now() - 300000),
    icon: 'fas fa-user-plus',
    color: 'text-accent-green'
  },
  {
    id: 2,
    type: 'mining_started',
    message: 'Mining session started by HashMaster',
    timestamp: new Date(Date.now() - 600000),
    icon: 'fas fa-hammer',
    color: 'text-accent-teal'
  },
  {
    id: 3,
    type: 'reward_distributed',
    message: 'Block reward distributed: 1,250 AUM',
    timestamp: new Date(Date.now() - 900000),
    icon: 'fas fa-coins',
    color: 'text-yellow-400'
  },
  {
    id: 4,
    type: 'security_alert',
    message: 'Multiple failed login attempts detected',
    timestamp: new Date(Date.now() - 1200000),
    icon: 'fas fa-shield-alt',
    color: 'text-red-400'
  },
  {
    id: 5,
    type: 'system_update',
    message: 'Pool difficulty adjusted to 2048',
    timestamp: new Date(Date.now() - 1500000),
    icon: 'fas fa-cog',
    color: 'text-primary-400'
  }
])

const quickActions = ref([
  {
    title: 'Broadcast Message',
    description: 'Send announcement to all users',
    icon: 'fas fa-bullhorn',
    color: 'bg-yellow-500/20 text-yellow-300',
    action: () => showBroadcastModal.value = true
  },
  {
    title: 'Pool Settings',
    description: 'Adjust mining pool configuration',
    icon: 'fas fa-sliders-h',
    color: 'bg-primary-500/20 text-primary-300',
    action: () => alert('Pool settings coming soon')
  },
  {
    title: 'Backup System',
    description: 'Create system backup',
    icon: 'fas fa-download',
    color: 'bg-accent-teal/20 text-accent-teal',
    action: () => alert('Backup initiated')
  },
  {
    title: 'Security Scan',
    description: 'Run security diagnostic',
    icon: 'fas fa-search',
    color: 'bg-purple-500/20 text-purple-300',
    action: () => alert('Security scan started')
  }
])

const showBroadcastModal = ref(false)
const broadcastMessage = ref('')
const broadcastType = ref('info')
const statsInterval = ref<number>()

onMounted(() => {
  miningStore.fetchPoolStats()
  
  // Update stats every 30 seconds
  statsInterval.value = window.setInterval(() => {
    updateSystemStats()
    miningStore.fetchPoolStats()
  }, 30000)
})

onUnmounted(() => {
  if (statsInterval.value) {
    clearInterval(statsInterval.value)
  }
})

const updateSystemStats = () => {
  // Simulate real-time stats updates
  systemStats.value.activeUsers = Math.floor(Math.random() * 20) + 80
  systemStats.value.totalHashRate = Math.floor(Math.random() * 500000) + 2500000
  systemStats.value.serverLoad = Math.floor(Math.random() * 30) + 50
  systemStats.value.memoryUsage = Math.floor(Math.random() * 20) + 70
  systemStats.value.networkTraffic = Math.floor(Math.random() * 100) + 200
}

const sendBroadcast = () => {
  if (!broadcastMessage.value.trim()) return
  
  // Simulate sending broadcast
  alert(`Broadcast sent: ${broadcastMessage.value}`)
  
  // Add to recent activity
  recentActivity.value.unshift({
    id: Date.now(),
    type: 'broadcast',
    message: `Admin broadcast: ${broadcastMessage.value.substring(0, 50)}${broadcastMessage.value.length > 50 ? '...' : ''}`,
    timestamp: new Date(),
    icon: 'fas fa-bullhorn',
    color: 'text-yellow-400'
  })
  
  showBroadcastModal.value = false
  broadcastMessage.value = ''
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

const getStatusColor = (value: number, type: 'load' | 'memory') => {
  if (type === 'load' || type === 'memory') {
    if (value >= 90) return 'text-red-400'
    if (value >= 75) return 'text-yellow-400'
    return 'text-accent-green'
  }
  return 'text-primary-400'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p class="text-gray-400">System overview and management controls</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-sm text-gray-400">System Status</p>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            <span class="text-accent-green font-medium">Operational</span>
          </div>
        </div>
      </div>
    </div>

    <!-- System Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Server Uptime -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Server Uptime</h3>
          <div class="p-2 bg-accent-green/20 rounded-lg glow-teal">
            <i class="fas fa-clock text-accent-green"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ systemStats.uptime }}</p>
        <p class="text-gray-400 text-sm">Continuous operation</p>
      </div>

      <!-- Total Users -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Total Users</h3>
          <div class="p-2 bg-primary-500/20 rounded-lg glow-blue">
            <i class="fas fa-users text-primary-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ systemStats.totalUsers.toLocaleString() }}</p>
        <div class="flex items-center">
          <span class="text-accent-green text-sm">{{ systemStats.activeUsers }} active</span>
        </div>
      </div>

      <!-- Total Hash Rate -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Total Hash Rate</h3>
          <div class="p-2 bg-accent-teal/20 rounded-lg glow-teal">
            <i class="fas fa-tachometer-alt text-accent-teal"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ (systemStats.totalHashRate / 1000).toFixed(1) }}K</p>
        <p class="text-gray-400 text-sm">H/s network rate</p>
      </div>

      <!-- Total Rewards -->
      <div class="glass-card p-6 rounded-xl hover-lift animated-bg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Total Rewards</h3>
          <div class="p-2 bg-yellow-500/20 rounded-lg glow-yellow">
            <i class="fas fa-coins text-yellow-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white mb-2">{{ systemStats.totalRewards.toLocaleString() }}</p>
        <p class="text-gray-400 text-sm">AUM distributed</p>
      </div>
    </div>

    <!-- System Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Performance Metrics -->
      <div class="glass-card p-6 rounded-xl">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <i class="fas fa-chart-line text-primary-400 mr-3"></i>
          Performance Metrics
        </h3>
        
        <div class="space-y-6">
          <!-- Server Load -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-300">Server Load</span>
              <span :class="getStatusColor(systemStats.serverLoad, 'load')" class="font-semibold">
                {{ systemStats.serverLoad }}%
              </span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                :class="{
                  'bg-red-500': systemStats.serverLoad >= 90,
                  'bg-yellow-400': systemStats.serverLoad >= 75 && systemStats.serverLoad < 90,
                  'bg-accent-green': systemStats.serverLoad < 75
                }"
                :style="{ width: systemStats.serverLoad + '%' }"
              ></div>
            </div>
          </div>

          <!-- Memory Usage -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-300">Memory Usage</span>
              <span :class="getStatusColor(systemStats.memoryUsage, 'memory')" class="font-semibold">
                {{ systemStats.memoryUsage }}%
              </span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                :class="{
                  'bg-red-500': systemStats.memoryUsage >= 90,
                  'bg-yellow-400': systemStats.memoryUsage >= 75 && systemStats.memoryUsage < 90,
                  'bg-accent-green': systemStats.memoryUsage < 75
                }"
                :style="{ width: systemStats.memoryUsage + '%' }"
              ></div>
            </div>
          </div>

          <!-- Network Traffic -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-300">Network Traffic</span>
              <span class="text-primary-400 font-semibold">{{ systemStats.networkTraffic }} MB/s</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
              <div 
                class="bg-primary-400 h-2 rounded-full transition-all duration-500"
                :style="{ width: Math.min(systemStats.networkTraffic / 5, 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Active Miners -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-300">Active Miners</span>
              <span class="text-accent-teal font-semibold">{{ systemStats.activeUsers }}</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
              <div 
                class="bg-accent-teal h-2 rounded-full transition-all duration-500"
                :style="{ width: (systemStats.activeUsers / 100) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="glass-card p-6 rounded-xl">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <i class="fas fa-history text-primary-400 mr-3"></i>
          Recent Activity
        </h3>
        
        <div class="space-y-4 max-h-80 overflow-y-auto">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <div class="p-2 bg-white/10 rounded-lg">
              <i :class="[activity.icon, activity.color]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm">{{ activity.message }}</p>
              <p class="text-gray-400 text-xs mt-1">{{ formatRelativeTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="glass-card p-6 rounded-xl">
      <h3 class="text-xl font-bold text-white mb-6 flex items-center">
        <i class="fas fa-bolt text-primary-400 mr-3"></i>
        Quick Actions
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="action in quickActions"
          :key="action.title"
          @click="action.action"
          class="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 cursor-pointer hover-lift"
        >
          <div class="flex items-center space-x-3 mb-3">
            <div :class="action.color" class="p-3 rounded-lg">
              <i :class="action.icon" class="text-xl"></i>
            </div>
          </div>
          <h4 class="text-white font-semibold mb-1">{{ action.title }}</h4>
          <p class="text-gray-400 text-sm">{{ action.description }}</p>
        </div>
      </div>
    </div>

    <!-- Pool Statistics Summary -->
    <div class="glass-card p-6 rounded-xl">
      <h3 class="text-xl font-bold text-white mb-6 flex items-center">
        <i class="fas fa-swimming-pool text-primary-400 mr-3"></i>
        Mining Pool Status
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-400 mb-2">{{ miningStore.poolStats.activeMiners }}</div>
          <div class="text-gray-400 text-sm">Active Miners</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-accent-teal mb-2">{{ miningStore.poolStats.totalHashRate.toLocaleString() }}</div>
          <div class="text-gray-400 text-sm">Pool Hash Rate</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-400 mb-2">{{ miningStore.poolStats.blocksFound }}</div>
          <div class="text-gray-400 text-sm">Blocks Found</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-accent-green mb-2">{{ miningStore.poolStats.efficiency }}%</div>
          <div class="text-gray-400 text-sm">Pool Efficiency</div>
        </div>
      </div>
    </div>

    <!-- Broadcast Modal -->
    <div v-if="showBroadcastModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-md w-full rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">Broadcast Message</h2>
          <button @click="showBroadcastModal = false" class="text-gray-400 hover:text-white transition-colors duration-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form @submit.prevent="sendBroadcast" class="space-y-4">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Message Type</label>
            <select
              v-model="broadcastType"
              class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            >
              <option value="info">Information</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Message</label>
            <textarea
              v-model="broadcastMessage"
              rows="4"
              placeholder="Enter your broadcast message..."
              required
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 resize-none"
            ></textarea>
          </div>
          
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 btn-primary text-white py-3 rounded-lg font-medium"
            >
              Send Broadcast
            </button>
            <button
              type="button"
              @click="showBroadcastModal = false"
              class="flex-1 btn-secondary text-white py-3 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 