<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import type { User } from '../../stores/authStore'

const authStore = useAuthStore()

// Mock user data - in real app this would come from API
const users = ref<(User & { status: 'active' | 'inactive' | 'banned', earnings: number, hashRate: number })[]>([
  {
    id: '1',
    username: 'admin',
    email: 'admin@tribeminer.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    status: 'active',
    earnings: 0,
    hashRate: 0
  },
  {
    id: '2', 
    username: 'user',
    email: 'user@tribeminer.com',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff',
    walletAddress: 'DEMO_WALLET_ADDRESS',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    status: 'active',
    earnings: 1250.75,
    hashRate: 450
  },
  {
    id: '3',
    username: 'alice_miner',
    email: 'alice@example.com',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=fff',
    walletAddress: '0x742b70151cd3bc5b5fcbae5b9e96fb75ec8c2a20',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'active',
    earnings: 890.25,
    hashRate: 320
  },
  {
    id: '4',
    username: 'bob_crypto',
    email: 'bob@example.com', 
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=Bob&background=f59e0b&color=fff',
    walletAddress: '0x8ba1f109551bd432803012645hac136c3c16bf6',
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date(Date.now() - 7200000), // 2 hours ago
    status: 'inactive',
    earnings: 340.50,
    hashRate: 0
  },
  {
    id: '5',
    username: 'charlie_pool',
    email: 'charlie@example.com',
    role: 'customer', 
    avatar: 'https://ui-avatars.com/api/?name=Charlie&background=ef4444&color=fff',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date(Date.now() - 86400000), // 1 day ago
    status: 'banned',
    earnings: 0,
    hashRate: 0
  }
])

const searchQuery = ref('')
const selectedRole = ref<'all' | 'admin' | 'customer'>('all')
const selectedStatus = ref<'all' | 'active' | 'inactive' | 'banned'>('all')
const sortBy = ref<'username' | 'createdAt' | 'earnings' | 'lastLogin'>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

const filteredUsers = computed(() => {
  let filtered = users.value.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value
    const matchesStatus = selectedStatus.value === 'all' || user.status === selectedStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Sort users
  filtered.sort((a, b) => {
    let aVal, bVal
    switch (sortBy.value) {
      case 'username':
        aVal = a.username.toLowerCase()
        bVal = b.username.toLowerCase()
        break
      case 'createdAt':
        aVal = a.createdAt.getTime()
        bVal = b.createdAt.getTime()
        break
      case 'earnings':
        aVal = a.earnings
        bVal = b.earnings
        break
      case 'lastLogin':
        aVal = a.lastLogin.getTime()
        bVal = b.lastLogin.getTime()
        break
      default:
        return 0
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length)
const totalEarnings = computed(() => users.value.reduce((sum, u) => sum + u.earnings, 0))

const selectedUser = ref<User | null>(null)
const showUserModal = ref(false)

const openUserModal = (user: User) => {
  selectedUser.value = user
  showUserModal.value = true
}

const closeUserModal = () => {
  selectedUser.value = null
  showUserModal.value = false
}

const banUser = (userId: string) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    user.status = 'banned'
    user.hashRate = 0
  }
}

const unbanUser = (userId: string) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    user.status = 'active'
  }
}

const deleteUser = (userId: string) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    const index = users.value.findIndex(u => u.id === userId)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-accent-green'
    case 'inactive': return 'text-yellow-400'
    case 'banned': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return 'fas fa-check-circle'
    case 'inactive': return 'fas fa-pause-circle'
    case 'banned': return 'fas fa-ban'
    default: return 'fas fa-question-circle'
  }
}

onMounted(() => {
  // In real app, fetch users from API
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">User Management</h1>
        <p class="text-gray-400">Manage all TribeMiner users and their mining activities</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="glass-card p-6 rounded-xl hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Total Users</h3>
          <div class="p-2 bg-primary-500/20 rounded-lg glow-blue">
            <i class="fas fa-users text-primary-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ totalUsers }}</p>
        <p class="text-gray-400 text-sm">All registered users</p>
      </div>

      <div class="glass-card p-6 rounded-xl hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Active Users</h3>
          <div class="p-2 bg-accent-green/20 rounded-lg glow-teal">
            <i class="fas fa-user-check text-accent-green"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ activeUsers }}</p>
        <p class="text-gray-400 text-sm">Currently active</p>
      </div>

      <div class="glass-card p-6 rounded-xl hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Total Earnings</h3>
          <div class="p-2 bg-accent-teal/20 rounded-lg glow-teal">
            <i class="fas fa-coins text-accent-teal"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ totalEarnings.toLocaleString() }}</p>
        <p class="text-gray-400 text-sm">AUM tokens earned</p>
      </div>

      <div class="glass-card p-6 rounded-xl hover-lift">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-300 font-medium">Mining Rate</h3>
          <div class="p-2 bg-purple-500/20 rounded-lg glow-purple">
            <i class="fas fa-tachometer-alt text-purple-400"></i>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ users.filter(u => u.status === 'active').reduce((sum, u) => sum + u.hashRate, 0) }}</p>
        <p class="text-gray-400 text-sm">Total H/s</p>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="glass-card p-6 rounded-xl">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-gray-300 text-sm font-medium mb-2">Search Users</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by username or email..."
            class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          />
        </div>

        <!-- Role Filter -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Role</label>
          <select
            v-model="selectedRole"
            class="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
          >
            <option value="createdAt">Join Date</option>
            <option value="username">Username</option>
            <option value="earnings">Earnings</option>
            <option value="lastLogin">Last Login</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5 border-b border-white/10">
            <tr>
              <th class="text-left p-4 text-gray-300 font-medium">User</th>
              <th class="text-left p-4 text-gray-300 font-medium">Role</th>
              <th class="text-left p-4 text-gray-300 font-medium">Status</th>
              <th class="text-left p-4 text-gray-300 font-medium">Earnings</th>
              <th class="text-left p-4 text-gray-300 font-medium">Hash Rate</th>
              <th class="text-left p-4 text-gray-300 font-medium">Last Login</th>
              <th class="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
            >
              <td class="p-4">
                <div class="flex items-center space-x-3">
                  <img :src="user.avatar" :alt="user.username" class="w-10 h-10 rounded-full" />
                  <div>
                    <p class="text-white font-medium">{{ user.username }}</p>
                    <p class="text-gray-400 text-sm">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span 
                  class="text-xs px-2 py-1 rounded-full border"
                  :class="user.role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-primary-500/20 text-primary-300 border-primary-500/30'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center space-x-2">
                  <i :class="[getStatusIcon(user.status), getStatusColor(user.status)]"></i>
                  <span :class="getStatusColor(user.status)" class="capitalize font-medium">{{ user.status }}</span>
                </div>
              </td>
              <td class="p-4">
                <span class="text-white font-medium">{{ user.earnings.toLocaleString() }} AUM</span>
              </td>
              <td class="p-4">
                <span class="text-white">{{ user.hashRate }} H/s</span>
              </td>
              <td class="p-4">
                <span class="text-gray-300 text-sm">{{ formatDate(user.lastLogin) }}</span>
              </td>
              <td class="p-4">
                <div class="flex items-center space-x-2">
                  <button
                    @click="openUserModal(user)"
                    class="text-primary-400 hover:text-primary-300 transition-colors duration-200"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <button
                    v-if="user.status === 'active' && user.role !== 'admin'"
                    @click="banUser(user.id)"
                    class="text-red-400 hover:text-red-300 transition-colors duration-200"
                    title="Ban User"
                  >
                    <i class="fas fa-ban"></i>
                  </button>
                  
                  <button
                    v-if="user.status === 'banned'"
                    @click="unbanUser(user.id)"
                    class="text-accent-green hover:text-green-300 transition-colors duration-200"
                    title="Unban User"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  
                  <button
                    v-if="user.role !== 'admin'"
                    @click="deleteUser(user.id)"
                    class="text-red-400 hover:text-red-300 transition-colors duration-200"
                    title="Delete User"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-2xl w-full rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">User Details</h2>
          <button @click="closeUserModal" class="text-gray-400 hover:text-white transition-colors duration-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div v-if="selectedUser" class="space-y-6">
          <!-- User Info -->
          <div class="flex items-center space-x-4">
            <img :src="selectedUser.avatar" :alt="selectedUser.username" class="w-16 h-16 rounded-full" />
            <div>
              <h3 class="text-xl font-semibold text-white">{{ selectedUser.username }}</h3>
              <p class="text-gray-400">{{ selectedUser.email }}</p>
              <div class="flex items-center space-x-2 mt-2">
                <span 
                  class="text-xs px-2 py-1 rounded-full border"
                  :class="selectedUser.role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-primary-500/20 text-primary-300 border-primary-500/30'"
                >
                  {{ selectedUser.role }}
                </span>
                <span 
                  class="text-xs px-2 py-1 rounded-full border capitalize"
                  :class="{
                    'bg-accent-green/20 text-accent-green border-accent-green/30': selectedUser.status === 'active',
                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30': selectedUser.status === 'inactive',
                    'bg-red-500/20 text-red-300 border-red-500/30': selectedUser.status === 'banned'
                  }"
                >
                  {{ selectedUser.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white/5 p-4 rounded-lg">
              <label class="text-gray-400 text-sm">Wallet Address</label>
              <p class="text-white font-mono text-sm">{{ selectedUser.walletAddress || 'Not connected' }}</p>
            </div>
            <div class="bg-white/5 p-4 rounded-lg">
              <label class="text-gray-400 text-sm">Total Earnings</label>
              <p class="text-white font-semibold">{{ selectedUser.earnings?.toLocaleString() || 0 }} AUM</p>
            </div>
            <div class="bg-white/5 p-4 rounded-lg">
              <label class="text-gray-400 text-sm">Join Date</label>
              <p class="text-white">{{ formatDate(selectedUser.createdAt) }}</p>
            </div>
            <div class="bg-white/5 p-4 rounded-lg">
              <label class="text-gray-400 text-sm">Last Login</label>
              <p class="text-white">{{ formatDate(selectedUser.lastLogin) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 