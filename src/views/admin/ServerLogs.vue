<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface LogEntry {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'success'
  category: 'system' | 'mining' | 'user' | 'security' | 'api'
  message: string
  details?: any
  userId?: string
  ip?: string
}

const logs = ref<LogEntry[]>([])
const isLive = ref(true)
const selectedLevel = ref<'all' | 'info' | 'warning' | 'error' | 'success'>('all')
const selectedCategory = ref<'all' | 'system' | 'mining' | 'user' | 'security' | 'api'>('all')
const searchQuery = ref('')
const autoScroll = ref(true)
const logsContainer = ref<HTMLElement>()
const logsInterval = ref<number>()

// Generate mock logs
const generateMockLog = (): LogEntry => {
  const levels: LogEntry['level'][] = ['info', 'warning', 'error', 'success']
  const categories: LogEntry['category'][] = ['system', 'mining', 'user', 'security', 'api']
  
  const messages = {
    system: [
      'Server started successfully',
      'Database connection established',
      'WebSocket server listening on port 3001',
      'Scheduled backup completed',
      'Memory usage: 67%'
    ],
    mining: [
      'New mining session started',
      'Pool difficulty adjusted to 1024',
      'Block reward distributed',
      'Mining pool statistics updated',
      'Hash rate optimization completed'
    ],
    user: [
      'User registered successfully',
      'Wallet connection established',
      'User profile updated',
      'Password changed for user',
      'User logout successful'
    ],
    security: [
      'Failed login attempt detected',
      'Security scan completed',
      'Suspicious activity monitored',
      'Rate limit exceeded',
      'JWT token expired'
    ],
    api: [
      'API request processed',
      'Rate limit warning',
      'External API call successful',
      'WebSocket connection established',
      'Cache miss for key'
    ]
  }

  const level = levels[Math.floor(Math.random() * levels.length)]
  const category = categories[Math.floor(Math.random() * categories.length)]
  const message = messages[category][Math.floor(Math.random() * messages[category].length)]

  return {
    id: Date.now().toString() + Math.random(),
    timestamp: new Date(),
    level,
    category,
    message,
    userId: Math.random() > 0.7 ? `user_${Math.floor(Math.random() * 100)}` : undefined,
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`
  }
}

// Initialize with some mock logs
const initializeLogs = () => {
  const initialLogs: LogEntry[] = []
  for (let i = 0; i < 50; i++) {
    const log = generateMockLog()
    log.timestamp = new Date(Date.now() - (50 - i) * 60000) // Space logs 1 minute apart
    initialLogs.push(log)
  }
  logs.value = initialLogs
}

const addNewLog = () => {
  if (isLive.value) {
    logs.value.push(generateMockLog())
    
    // Keep only last 500 logs for performance
    if (logs.value.length > 500) {
      logs.value.shift()
    }
    
    if (autoScroll.value) {
      scrollToBottom()
    }
  }
}

const scrollToBottom = () => {
  if (logsContainer.value) {
    setTimeout(() => {
      logsContainer.value!.scrollTop = logsContainer.value!.scrollHeight
    }, 100)
  }
}

const filteredLogs = ref<LogEntry[]>([])

const updateFilteredLogs = () => {
  filteredLogs.value = logs.value.filter(log => {
    const matchesLevel = selectedLevel.value === 'all' || log.level === selectedLevel.value
    const matchesCategory = selectedCategory.value === 'all' || log.category === selectedCategory.value
    const matchesSearch = searchQuery.value === '' || 
                         log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         log.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesLevel && matchesCategory && matchesSearch
  }).slice(-200) // Show only last 200 filtered logs for performance
}

const toggleLive = () => {
  isLive.value = !isLive.value
}

const clearLogs = () => {
  if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
    logs.value = []
    filteredLogs.value = []
  }
}

const exportLogs = () => {
  const dataStr = JSON.stringify(filteredLogs.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tribeminer-logs-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'success': return 'text-accent-green'
    case 'info': return 'text-primary-400'
    case 'warning': return 'text-yellow-400'
    case 'error': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'success': return 'fas fa-check-circle'
    case 'info': return 'fas fa-info-circle'
    case 'warning': return 'fas fa-exclamation-triangle'
    case 'error': return 'fas fa-times-circle'
    default: return 'fas fa-circle'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'system': return 'fas fa-server'
    case 'mining': return 'fas fa-hammer'
    case 'user': return 'fas fa-user'
    case 'security': return 'fas fa-shield-alt'
    case 'api': return 'fas fa-exchange-alt'
    default: return 'fas fa-file-alt'
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Watch for changes and update filtered logs
const watchFilters = () => {
  updateFilteredLogs()
}

onMounted(() => {
  initializeLogs()
  updateFilteredLogs()
  
  // Add new logs every 3-8 seconds
  logsInterval.value = window.setInterval(() => {
    if (Math.random() > 0.3) { // 70% chance to add a log
      addNewLog()
      updateFilteredLogs()
    }
  }, Math.random() * 5000 + 3000)
})

onUnmounted(() => {
  if (logsInterval.value) {
    clearInterval(logsInterval.value)
  }
})

// Watch filters
const unwatchLevel = ref(selectedLevel.value)
const unwatchCategory = ref(selectedCategory.value)
const unwatchSearch = ref(searchQuery.value)

// Simple reactivity for filters
setInterval(() => {
  if (unwatchLevel.value !== selectedLevel.value || 
      unwatchCategory.value !== selectedCategory.value || 
      unwatchSearch.value !== searchQuery.value) {
    unwatchLevel.value = selectedLevel.value
    unwatchCategory.value = selectedCategory.value
    unwatchSearch.value = searchQuery.value
    updateFilteredLogs()
  }
}, 500)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Server Logs</h1>
        <p class="text-gray-400">Real-time monitoring and system logs</p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <div 
            class="w-3 h-3 rounded-full"
            :class="isLive ? 'bg-accent-green animate-pulse' : 'bg-gray-500'"
          ></div>
          <span class="text-white text-sm font-medium">
            {{ isLive ? 'Live' : 'Paused' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="glass-card p-6 rounded-xl">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-gray-300 text-sm font-medium mb-2">Search Logs</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search messages..."
            class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          />
        </div>

        <!-- Level Filter -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Level</label>
          <select
            v-model="selectedLevel"
            class="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          >
            <option value="all">All Levels</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Category</label>
          <select
            v-model="selectedCategory"
            class="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            <option value="system">System</option>
            <option value="mining">Mining</option>
            <option value="user">User</option>
            <option value="security">Security</option>
            <option value="api">API</option>
          </select>
        </div>

        <!-- Auto Scroll -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Auto Scroll</label>
          <label class="flex items-center">
            <input
              v-model="autoScroll"
              type="checkbox"
              class="mr-2 rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white text-sm">Enable</span>
          </label>
        </div>

        <!-- Actions -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Actions</label>
          <div class="flex space-x-2">
            <button
              @click="toggleLive"
              class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="isLive ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30' : 'bg-accent-green/20 text-accent-green hover:bg-accent-green/30'"
            >
              {{ isLive ? 'Pause' : 'Resume' }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          @click="clearLogs"
          class="btn-secondary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <i class="fas fa-trash"></i>
          <span>Clear</span>
        </button>
        <button
          @click="exportLogs"
          class="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <i class="fas fa-download"></i>
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Logs Display -->
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
        <h3 class="text-white font-semibold">
          Server Logs ({{ filteredLogs.length }} entries)
        </h3>
        <div class="flex items-center space-x-4 text-sm text-gray-400">
          <span>Total: {{ logs.length }}</span>
          <span>Filtered: {{ filteredLogs.length }}</span>
        </div>
      </div>
      
      <div 
        ref="logsContainer"
        class="h-96 overflow-y-auto bg-black/20 font-mono text-sm"
      >
        <div class="p-4 space-y-1">
          <div
            v-for="log in filteredLogs"
            :key="log.id"
            class="flex items-start space-x-3 py-2 px-3 rounded hover:bg-white/5 transition-colors duration-200"
          >
            <!-- Timestamp -->
            <span class="text-gray-500 text-xs whitespace-nowrap">
              {{ formatTime(log.timestamp) }}
            </span>
            
            <!-- Level -->
            <div class="flex items-center space-x-1 min-w-0">
              <i :class="[getLevelIcon(log.level), getLevelColor(log.level), 'text-xs']"></i>
              <span :class="getLevelColor(log.level)" class="text-xs uppercase font-semibold whitespace-nowrap">
                {{ log.level }}
              </span>
            </div>
            
            <!-- Category -->
            <div class="flex items-center space-x-1 min-w-0">
              <i :class="getCategoryIcon(log.category)" class="text-gray-400 text-xs"></i>
              <span class="text-gray-400 text-xs uppercase whitespace-nowrap">
                {{ log.category }}
              </span>
            </div>
            
            <!-- Message -->
            <span class="text-white flex-1">
              {{ log.message }}
            </span>
            
            <!-- User ID -->
            <span v-if="log.userId" class="text-primary-400 text-xs whitespace-nowrap">
              {{ log.userId }}
            </span>
            
            <!-- IP -->
            <span v-if="log.ip" class="text-accent-teal text-xs whitespace-nowrap">
              {{ log.ip }}
            </span>
          </div>
          
          <div v-if="filteredLogs.length === 0" class="text-center py-8 text-gray-400">
            No logs match the current filters
          </div>
        </div>
      </div>
    </div>

    <!-- Log Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="glass-card p-4 rounded-xl">
        <div class="flex items-center space-x-2 mb-2">
          <i class="fas fa-check-circle text-accent-green"></i>
          <span class="text-gray-300 text-sm">Success</span>
        </div>
        <p class="text-2xl font-bold text-white">
          {{ logs.filter(l => l.level === 'success').length }}
        </p>
      </div>
      
      <div class="glass-card p-4 rounded-xl">
        <div class="flex items-center space-x-2 mb-2">
          <i class="fas fa-info-circle text-primary-400"></i>
          <span class="text-gray-300 text-sm">Info</span>
        </div>
        <p class="text-2xl font-bold text-white">
          {{ logs.filter(l => l.level === 'info').length }}
        </p>
      </div>
      
      <div class="glass-card p-4 rounded-xl">
        <div class="flex items-center space-x-2 mb-2">
          <i class="fas fa-exclamation-triangle text-yellow-400"></i>
          <span class="text-gray-300 text-sm">Warning</span>
        </div>
        <p class="text-2xl font-bold text-white">
          {{ logs.filter(l => l.level === 'warning').length }}
        </p>
      </div>
      
      <div class="glass-card p-4 rounded-xl">
        <div class="flex items-center space-x-2 mb-2">
          <i class="fas fa-times-circle text-red-400"></i>
          <span class="text-gray-300 text-sm">Error</span>
        </div>
        <p class="text-2xl font-bold text-white">
          {{ logs.filter(l => l.level === 'error').length }}
        </p>
      </div>
      
      <div class="glass-card p-4 rounded-xl">
        <div class="flex items-center space-x-2 mb-2">
          <i class="fas fa-clock text-gray-400"></i>
          <span class="text-gray-300 text-sm">Last Hour</span>
        </div>
        <p class="text-2xl font-bold text-white">
          {{ logs.filter(l => Date.now() - l.timestamp.getTime() < 3600000).length }}
        </p>
      </div>
    </div>
  </div>
</template> 