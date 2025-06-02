// Mock data service for static deployment
export interface MockUser {
  id: string
  username: string
  email: string
  role: 'customer' | 'admin'
  avatar?: string
  walletAddress?: string
  createdAt: Date
  lastLogin: Date
  isActive: boolean
  totalMined: number
  currentHashRate: number
}

export interface MockTransaction {
  id: string
  userId: string
  type: 'mining_reward' | 'withdrawal' | 'deposit'
  amount: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  txHash?: string
}

export interface MockServerLog {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
  source: string
}

export interface MockChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
  avatar?: string
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@tribeminer.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true,
    totalMined: 0,
    currentHashRate: 0
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
    isActive: true,
    totalMined: 125.43,
    currentHashRate: 1250
  },
  {
    id: '3',
    username: 'alice_miner',
    email: 'alice@example.com',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=fff',
    walletAddress: 'TEST_WALLET_1',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 3600000), // 1 hour ago
    isActive: true,
    totalMined: 89.21,
    currentHashRate: 980
  },
  {
    id: '4',
    username: 'bob_crypto',
    email: 'bob@example.com',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=Bob&background=f59e0b&color=fff',
    walletAddress: 'TEST_WALLET_2',
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date(Date.now() - 86400000), // 1 day ago
    isActive: false,
    totalMined: 234.67,
    currentHashRate: 0
  },
  {
    id: '5',
    username: 'charlie_dev',
    email: 'charlie@example.com',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=Charlie&background=ef4444&color=fff',
    walletAddress: 'TEST_WALLET_3',
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date(Date.now() - 7200000), // 2 hours ago
    isActive: true,
    totalMined: 67.89,
    currentHashRate: 1450
  }
]

// Mock Transactions
export const mockTransactions: MockTransaction[] = [
  {
    id: 'tx_1',
    userId: '2',
    type: 'mining_reward',
    amount: 2.5,
    timestamp: new Date(Date.now() - 3600000),
    status: 'completed',
    txHash: '0x1234567890abcdef'
  },
  {
    id: 'tx_2',
    userId: '3',
    type: 'mining_reward',
    amount: 1.8,
    timestamp: new Date(Date.now() - 7200000),
    status: 'completed',
    txHash: '0x2345678901bcdef0'
  },
  {
    id: 'tx_3',
    userId: '4',
    type: 'withdrawal',
    amount: 50.0,
    timestamp: new Date(Date.now() - 86400000),
    status: 'completed',
    txHash: '0x3456789012cdef01'
  },
  {
    id: 'tx_4',
    userId: '2',
    type: 'mining_reward',
    amount: 3.2,
    timestamp: new Date(Date.now() - 10800000),
    status: 'pending'
  },
  {
    id: 'tx_5',
    userId: '5',
    type: 'mining_reward',
    amount: 1.9,
    timestamp: new Date(Date.now() - 14400000),
    status: 'completed',
    txHash: '0x456789013def0123'
  }
]

// Mock Server Logs
export const mockServerLogs: MockServerLog[] = [
  {
    id: 'log_1',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    level: 'info',
    message: 'Mining pool statistics updated successfully',
    source: 'MiningService'
  },
  {
    id: 'log_2',
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    level: 'info',
    message: 'New miner connected: alice_miner',
    source: 'WebSocketHandler'
  },
  {
    id: 'log_3',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    level: 'warning',
    message: 'High memory usage detected: 85%',
    source: 'SystemMonitor'
  },
  {
    id: 'log_4',
    timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
    level: 'error',
    message: 'Failed to connect to external API endpoint',
    source: 'ExternalService'
  },
  {
    id: 'log_5',
    timestamp: new Date(Date.now() - 1500000), // 25 minutes ago
    level: 'info',
    message: 'Database backup completed successfully',
    source: 'DatabaseService'
  },
  {
    id: 'log_6',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    level: 'debug',
    message: 'Hash rate calculation: 15420 H/s',
    source: 'MiningCalculator'
  }
]

// Mock Chat Messages
export const mockChatMessages: MockChatMessage[] = [
  {
    id: 'msg_1',
    userId: '2',
    username: 'user',
    message: 'Hey everyone! Just started mining, excited to be part of the pool!',
    timestamp: new Date(Date.now() - 1800000),
    avatar: 'https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff'
  },
  {
    id: 'msg_2',
    userId: '3',
    username: 'alice_miner',
    message: 'Welcome! The community here is great. What\'s your hash rate?',
    timestamp: new Date(Date.now() - 1500000),
    avatar: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=fff'
  },
  {
    id: 'msg_3',
    userId: '2',
    username: 'user',
    message: 'Currently getting around 1250 H/s. Still optimizing my setup.',
    timestamp: new Date(Date.now() - 1200000),
    avatar: 'https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff'
  },
  {
    id: 'msg_4',
    userId: '5',
    username: 'charlie_dev',
    message: 'That\'s a solid start! I\'m running at 1450 H/s after some tweaks.',
    timestamp: new Date(Date.now() - 900000),
    avatar: 'https://ui-avatars.com/api/?name=Charlie&background=ef4444&color=fff'
  },
  {
    id: 'msg_5',
    userId: '3',
    username: 'alice_miner',
    message: 'Nice! What optimizations did you make?',
    timestamp: new Date(Date.now() - 600000),
    avatar: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=fff'
  },
  {
    id: 'msg_6',
    userId: '5',
    username: 'charlie_dev',
    message: 'Mainly CPU affinity settings and memory allocation. Happy to share the config!',
    timestamp: new Date(Date.now() - 300000),
    avatar: 'https://ui-avatars.com/api/?name=Charlie&background=ef4444&color=fff'
  }
]

// Mock API functions
export class MockDataService {
  static async getUsers(): Promise<MockUser[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...mockUsers]
  }

  static async getUserById(id: string): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockUsers.find(user => user.id === id) || null
  }

  static async updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
      return mockUsers[userIndex]
    }
    return null
  }

  static async deleteUser(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1)
      return true
    }
    return false
  }

  static async getTransactions(): Promise<MockTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...mockTransactions]
  }

  static async getTransactionsByUser(userId: string): Promise<MockTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockTransactions.filter(tx => tx.userId === userId)
  }

  static async getServerLogs(): Promise<MockServerLog[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    return [...mockServerLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  static async getChatMessages(): Promise<MockChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockChatMessages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  static async sendChatMessage(userId: string, message: string): Promise<MockChatMessage> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const user = mockUsers.find(u => u.id === userId)
    const newMessage: MockChatMessage = {
      id: `msg_${Date.now()}`,
      userId,
      username: user?.username || 'Unknown',
      message,
      timestamp: new Date(),
      avatar: user?.avatar
    }
    mockChatMessages.push(newMessage)
    return newMessage
  }

  // System statistics
  static async getSystemStats() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return {
      totalUsers: mockUsers.length,
      activeMiners: mockUsers.filter(u => u.isActive && u.currentHashRate > 0).length,
      totalHashRate: mockUsers.reduce((sum, u) => sum + u.currentHashRate, 0),
      totalMined: mockUsers.reduce((sum, u) => sum + u.totalMined, 0),
      serverUptime: '7 days, 14 hours, 23 minutes',
      memoryUsage: 72,
      cpuUsage: 45,
      networkLatency: 23
    }
  }
} 