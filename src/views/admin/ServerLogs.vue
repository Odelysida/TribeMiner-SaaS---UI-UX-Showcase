<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { MockDataService, type MockServerLog } from '../../lib/mockData'

const logs = ref<MockServerLog[]>([])
const isLive = ref(true)
const selectedLevel = ref<'all' | 'info' | 'warning' | 'error' | 'debug'>('all')
const selectedSource = ref<'all' | 'MiningService' | 'WebSocketHandler' | 'SystemMonitor' | 'ExternalService' | 'DatabaseService' | 'MiningCalculator'>('all')
const searchQuery = ref('')
const autoScroll = ref(true)
const logsContainer = ref<HTMLElement>()
const logsInterval = ref<number>()
const isLoading = ref(false)

const loadLogs = async () => {
  isLoading.value = true
  try {
    logs.value = await MockDataService.getServerLogs()
    updateFilteredLogs()
  } catch (error) {
    console.error('Failed to load server logs:', error)
  } finally {
    isLoading.value = false
  }
}

// Generate additional mock logs for live simulation
const generateMockLog = (): MockServerLog => {
  const levels: MockServerLog['level'][] = ['info', 'warning', 'error', 'debug']
  const sources = ['MiningService', 'WebSocketHandler', 'SystemMonitor', 'ExternalService', 'DatabaseService', 'MiningCalculator']
  
  const messages = {
    MiningService: [
      'Mining pool statistics updated successfully',
      'New block found and validated',
      'Pool difficulty adjusted automatically',
      'Mining rewards distributed to participants',
      'Hash rate calculation completed'
    ],
    WebSocketHandler: [
      'New miner connected successfully',
      'WebSocket connection established',
      'Real-time data stream initiated',
      'Connection timeout handled gracefully',
      'Mining status update broadcasted'
    ],
    SystemMonitor: [
      'High memory usage detected: 85%',
      'CPU usage within normal parameters',
      'Disk space check completed',
      'Network latency monitoring active',
      'System health check passed'
    ],
    ExternalService: [
      'Failed to connect to external API endpoint',
      'Blockchain sync completed successfully',
      'External wallet service responded',
      'API rate limit warning received',
      'Third-party service integration active'
    ],
    DatabaseService: [
      'Database backup completed successfully',
      'Query optimization applied',
      'Connection pool status healthy',
      'Data integrity check passed',
      'Transaction log rotated'
    ],
    MiningCalculator: [
      'Hash rate calculation: 15420 H/s',
      'Difficulty adjustment calculated',
      'Profitability metrics updated',
      'Mining efficiency optimized',
      'Performance benchmarks recorded'
    ]
  }

  const level = levels[Math.floor(Math.random() * levels.length)]
  const source = sources[Math.floor(Math.random() * sources.length)]
  const message = messages[source as keyof typeof messages][Math.floor(Math.random() * messages[source as keyof typeof messages].length)]

  return {
    id: `log_${Date.now()}_${Math.random()}`,
    timestamp: new Date(),
    level,
    source,
    message
  }
}

const addNewLog = () => {
  if (isLive.value) {
    logs.value.push(generateMockLog())
    
    // Keep only last 200 logs for performance
    if (logs.value.length > 200) {
      logs.value.shift()
    }
    
    updateFilteredLogs()
    
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

const filteredLogs = ref<MockServerLog[]>([])

const updateFilteredLogs = () => {
  filteredLogs.value = logs.value.filter(log => {
    const matchesLevel = selectedLevel.value === 'all' || log.level === selectedLevel.value
    const matchesSource = selectedSource.value === 'all' || log.source === selectedSource.value
    const matchesSearch = searchQuery.value === '' || 
                         log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesLevel && matchesSource && matchesSearch
  }).slice(-100) // Show only last 100 filtered logs for performance
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
    case 'info': return 'text-primary-400'
    case 'warning': return 'text-yellow-400'
    case 'error': return 'text-red-400'
    case 'debug': return 'text-gray-400'
    default: return 'text-gray-400'
  }
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'info': return 'fas fa-info-circle'
    case 'warning': return 'fas fa-exclamation-triangle'
    case 'error': return 'fas fa-times-circle'
    case 'debug': return 'fas fa-bug'
    default: return 'fas fa-circle'
  }
}

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'MiningService': return 'fas fa-hammer'
    case 'WebSocketHandler': return 'fas fa-plug'
    case 'SystemMonitor': return 'fas fa-chart-line'
    case 'ExternalService': return 'fas fa-exchange-alt'
    case 'DatabaseService': return 'fas fa-database'
    case 'MiningCalculator': return 'fas fa-calculator'
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

// Watch for filter changes
watch([selectedLevel, selectedSource, searchQuery], () => {
  updateFilteredLogs()
})

onMounted(async () => {
  await loadLogs()
  
  // Start live log simulation
  logsInterval.value = window.setInterval(addNewLog, 5000) // Add new log every 5 seconds
})

onUnmounted(() => {
  if (logsInterval.value) {
    clearInterval(logsInterval.value)
  }
})
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
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <!-- Source Filter -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Source</label>
          <select
            v-model="selectedSource"
            class="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          >
            <option value="all">All Sources</option>
            <option value="MiningService">MiningService</option>
            <option value="WebSocketHandler">WebSocketHandler</option>
            <option value="SystemMonitor">SystemMonitor</option>
            <option value="ExternalService">ExternalService</option>
            <option value="DatabaseService">DatabaseService</option>
            <option value="MiningCalculator">MiningCalculator</option>
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
            
            <!-- Source -->
            <div class="flex items-center space-x-1 min-w-0">
              <i :class="getSourceIcon(log.source)" class="text-gray-400 text-xs"></i>
              <span class="text-gray-400 text-xs uppercase whitespace-nowrap">
                {{ log.source }}
              </span>
            </div>
            
            <!-- Message -->
            <span class="text-white flex-1">
              {{ log.message }}
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