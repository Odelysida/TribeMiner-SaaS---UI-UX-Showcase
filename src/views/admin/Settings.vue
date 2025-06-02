<script setup lang="ts">
import { ref } from 'vue'

const settings = ref({
  difficulty: 2048,
  blockReward: 1250,
  minPayout: 10,
  maxMiners: 1000,
  feePercentage: 2.5,
  autoAdjustDifficulty: true,
  poolName: 'TribeMiner Pool',
  poolDescription: 'High-performance AUM token mining pool'
})

// Security Settings
const securitySettings = ref({
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  requireTwoFactor: false,
  allowRegistration: true,
  ipWhitelisting: false,
  bruteForceProtection: true,
  logSecurityEvents: true,
  encryptionLevel: 'AES-256'
})

// System Settings
const systemSettings = ref({
  maintenanceMode: false,
  backupInterval: 24,
  logRetention: 30,
  maxConnections: 10000,
  apiRateLimit: 1000,
  autoRestart: true,
  debugMode: false,
  compressionEnabled: true
})

// Notification Settings
const notificationSettings = ref({
  emailNotifications: true,
  webhookUrl: '',
  alertThresholds: {
    serverLoad: 90,
    memoryUsage: 85,
    diskSpace: 80,
    activeMiners: 50
  },
  notifyOnUserRegistration: false,
  notifyOnBlockFound: true,
  notifyOnSystemError: true
})

const isSaving = ref(false)
const activeTab = ref('pool')

const tabs = [
  { id: 'pool', name: 'Pool Settings', icon: 'fas fa-swimming-pool' },
  { id: 'security', name: 'Security', icon: 'fas fa-shield-alt' },
  { id: 'system', name: 'System', icon: 'fas fa-cog' },
  { id: 'notifications', name: 'Notifications', icon: 'fas fa-bell' }
]

const saveSettings = async () => {
  isSaving.value = true
  
  try {
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('Settings saved successfully!')
  } catch (error) {
    alert('Failed to save settings')
  } finally {
    isSaving.value = false
  }
}

const resetToDefaults = () => {
  if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
    return
  }
  
  // Reset to default values
  settings.value = {
    difficulty: 1024,
    blockReward: 1000,
    minPayout: 5,
    maxMiners: 500,
    feePercentage: 2.0,
    autoAdjustDifficulty: true,
    poolName: 'TribeMiner Pool',
    poolDescription: 'High-performance AUM token mining pool'
  }
  
  securitySettings.value = {
    maxLoginAttempts: 3,
    sessionTimeout: 15,
    requireTwoFactor: false,
    allowRegistration: true,
    ipWhitelisting: false,
    bruteForceProtection: true,
    logSecurityEvents: true,
    encryptionLevel: 'AES-256'
  }
  
  systemSettings.value = {
    maintenanceMode: false,
    backupInterval: 12,
    logRetention: 7,
    maxConnections: 5000,
    apiRateLimit: 500,
    autoRestart: false,
    debugMode: false,
    compressionEnabled: true
  }
  
  notificationSettings.value = {
    emailNotifications: false,
    webhookUrl: '',
    alertThresholds: {
      serverLoad: 80,
      memoryUsage: 75,
      diskSpace: 70,
      activeMiners: 100
    },
    notifyOnUserRegistration: false,
    notifyOnBlockFound: false,
    notifyOnSystemError: true
  }
  
  alert('Settings reset to defaults')
}

const exportConfig = () => {
  const config = {
    pool: settings.value,
    security: securitySettings.value,
    system: systemSettings.value,
    notifications: notificationSettings.value,
    exportDate: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(config, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tribeminer-config-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const importConfig = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target?.result as string)
      
      if (config.pool) settings.value = { ...settings.value, ...config.pool }
      if (config.security) securitySettings.value = { ...securitySettings.value, ...config.security }
      if (config.system) systemSettings.value = { ...systemSettings.value, ...config.system }
      if (config.notifications) notificationSettings.value = { ...notificationSettings.value, ...config.notifications }
      
      alert('Configuration imported successfully!')
    } catch (error) {
      alert('Failed to import configuration: Invalid file format')
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Admin Settings</h1>
        <p class="text-gray-400">Configure system, pool, and security settings</p>
      </div>
      <div class="flex items-center space-x-3">
        <!-- Import Config -->
        <label class="btn-secondary text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center space-x-2">
          <i class="fas fa-upload"></i>
          <span>Import</span>
          <input type="file" accept=".json" @change="importConfig" class="hidden" />
        </label>
        
        <!-- Export Config -->
        <button
          @click="exportConfig"
          class="btn-secondary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <i class="fas fa-download"></i>
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="flex border-b border-white/10">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 flex items-center justify-center space-x-2 p-4 transition-all duration-200"
          :class="{
            'bg-primary-500/20 text-primary-300 border-b-2 border-primary-500': activeTab === tab.id,
            'text-gray-400 hover:text-white hover:bg-white/5': activeTab !== tab.id
          }"
        >
          <i :class="tab.icon"></i>
          <span class="font-medium">{{ tab.name }}</span>
        </button>
      </div>

      <!-- Pool Settings Tab -->
      <div v-if="activeTab === 'pool'" class="p-6">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <i class="fas fa-swimming-pool text-primary-400 mr-3"></i>
          Mining Pool Configuration
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Pool Name</label>
            <input
              v-model="settings.poolName"
              type="text"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Mining Difficulty</label>
            <input
              v-model.number="settings.difficulty"
              type="number"
              min="256"
              max="16384"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Block Reward (AUM)</label>
            <input
              v-model.number="settings.blockReward"
              type="number"
              min="100"
              max="10000"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Minimum Payout (AUM)</label>
            <input
              v-model.number="settings.minPayout"
              type="number"
              min="1"
              max="100"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Max Concurrent Miners</label>
            <input
              v-model.number="settings.maxMiners"
              type="number"
              min="10"
              max="10000"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Pool Fee (%)</label>
            <input
              v-model.number="settings.feePercentage"
              type="number"
              min="0"
              max="10"
              step="0.1"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
        </div>
        
        <div class="mt-6">
          <label class="block text-gray-300 text-sm font-medium mb-2">Pool Description</label>
          <textarea
            v-model="settings.poolDescription"
            rows="3"
            class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 resize-none"
          ></textarea>
        </div>
        
        <div class="mt-6">
          <label class="flex items-center space-x-3">
            <input
              v-model="settings.autoAdjustDifficulty"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Auto-adjust difficulty based on network hash rate</span>
          </label>
        </div>
      </div>

      <!-- Security Settings Tab -->
      <div v-if="activeTab === 'security'" class="p-6">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <i class="fas fa-shield-alt text-primary-400 mr-3"></i>
          Security Configuration
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Max Login Attempts</label>
            <input
              v-model.number="securitySettings.maxLoginAttempts"
              type="number"
              min="1"
              max="10"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Session Timeout (minutes)</label>
            <input
              v-model.number="securitySettings.sessionTimeout"
              type="number"
              min="5"
              max="480"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Encryption Level</label>
            <select
              v-model="securitySettings.encryptionLevel"
              class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            >
              <option value="AES-128">AES-128</option>
              <option value="AES-256">AES-256</option>
              <option value="AES-512">AES-512</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6 space-y-4">
          <label class="flex items-center space-x-3">
            <input
              v-model="securitySettings.requireTwoFactor"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Require two-factor authentication for admins</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="securitySettings.allowRegistration"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Allow new user registration</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="securitySettings.bruteForceProtection"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Enable brute force protection</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="securitySettings.logSecurityEvents"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Log all security events</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="securitySettings.ipWhitelisting"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Enable IP whitelisting for admin access</span>
          </label>
        </div>
      </div>

      <!-- System Settings Tab -->
      <div v-if="activeTab === 'system'" class="p-6">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <i class="fas fa-cog text-primary-400 mr-3"></i>
          System Configuration
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Backup Interval (hours)</label>
            <input
              v-model.number="systemSettings.backupInterval"
              type="number"
              min="1"
              max="168"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Log Retention (days)</label>
            <input
              v-model.number="systemSettings.logRetention"
              type="number"
              min="1"
              max="365"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Max Connections</label>
            <input
              v-model.number="systemSettings.maxConnections"
              type="number"
              min="100"
              max="50000"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">API Rate Limit (req/min)</label>
            <input
              v-model.number="systemSettings.apiRateLimit"
              type="number"
              min="100"
              max="10000"
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
        </div>
        
        <div class="mt-6 space-y-4">
          <label class="flex items-center space-x-3">
            <input
              v-model="systemSettings.maintenanceMode"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Enable maintenance mode</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="systemSettings.autoRestart"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Auto-restart on critical errors</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="systemSettings.debugMode"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Enable debug mode</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="systemSettings.compressionEnabled"
              type="checkbox"
              class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
            />
            <span class="text-white">Enable response compression</span>
          </label>
        </div>
      </div>

      <!-- Notifications Settings Tab -->
      <div v-if="activeTab === 'notifications'" class="p-6">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center">
          <i class="fas fa-bell text-primary-400 mr-3"></i>
          Notification Configuration
        </h3>
        
        <div class="space-y-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Webhook URL</label>
            <input
              v-model="notificationSettings.webhookUrl"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Alert Thresholds</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Server Load (%)</label>
                <input
                  v-model.number="notificationSettings.alertThresholds.serverLoad"
                  type="number"
                  min="50"
                  max="100"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                />
              </div>
              
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Memory Usage (%)</label>
                <input
                  v-model.number="notificationSettings.alertThresholds.memoryUsage"
                  type="number"
                  min="50"
                  max="100"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                />
              </div>
              
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Disk Space (%)</label>
                <input
                  v-model.number="notificationSettings.alertThresholds.diskSpace"
                  type="number"
                  min="50"
                  max="100"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                />
              </div>
              
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Min Active Miners</label>
                <input
                  v-model.number="notificationSettings.alertThresholds.activeMiners"
                  type="number"
                  min="1"
                  max="1000"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Notification Events</h4>
            <div class="space-y-3">
              <label class="flex items-center space-x-3">
                <input
                  v-model="notificationSettings.emailNotifications"
                  type="checkbox"
                  class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
                />
                <span class="text-white">Enable email notifications</span>
              </label>
              
              <label class="flex items-center space-x-3">
                <input
                  v-model="notificationSettings.notifyOnUserRegistration"
                  type="checkbox"
                  class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
                />
                <span class="text-white">Notify on new user registration</span>
              </label>
              
              <label class="flex items-center space-x-3">
                <input
                  v-model="notificationSettings.notifyOnBlockFound"
                  type="checkbox"
                  class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
                />
                <span class="text-white">Notify when blocks are found</span>
              </label>
              
              <label class="flex items-center space-x-3">
                <input
                  v-model="notificationSettings.notifyOnSystemError"
                  type="checkbox"
                  class="rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50"
                />
                <span class="text-white">Notify on system errors</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between">
      <button
        @click="resetToDefaults"
        class="bg-red-600/20 text-red-300 hover:bg-red-600/30 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
      >
        <i class="fas fa-undo"></i>
        <span>Reset to Defaults</span>
      </button>
      
      <div class="flex space-x-3">
        <button
          @click="saveSettings"
          :disabled="isSaving"
          class="btn-primary text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <i v-if="isSaving" class="fas fa-spinner animate-spin"></i>
          <i v-else class="fas fa-save"></i>
          <span>{{ isSaving ? 'Saving...' : 'Save Settings' }}</span>
        </button>
      </div>
    </div>
  </div>
</template> 