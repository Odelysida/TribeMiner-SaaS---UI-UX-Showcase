import { auth } from '../auth.js'
import { v4 as uuidv4 } from 'uuid'

interface MinerSession {
  id: string
  userId: string
  walletAddress: string
  hashRate: number
  startTime: Date
  lastShareTime: Date
  totalShares: number
  isActive: boolean
}

interface MiningStats {
  totalRewards: number
  currentHashRate: number
  isActiveMiner: boolean
  sessionsCount: number
  totalMiningTime: number // in seconds
}

interface PoolStats {
  activeMiners: number
  totalHashRate: number
  totalRewards: number
  blocksFound: number
  difficulty: number
  efficiency: number
}

class MiningService {
  private miners = new Map<string, MinerSession>()
  private poolStats: PoolStats = {
    activeMiners: 0,
    totalHashRate: 0,
    totalRewards: 1000000, // Starting pool
    blocksFound: 0,
    difficulty: 1024,
    efficiency: 95.2
  }
  private blockInterval: NodeJS.Timeout | null = null
  private difficultyInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startBlockGeneration()
    this.startDifficultyAdjustment()
  }

  async startMining(userId: string, walletAddress: string): Promise<{ success: boolean; message: string; hashRate?: number }> {
    try {
      // Check if user is already mining
      const existingMiner = Array.from(this.miners.values()).find(m => m.userId === userId)
      if (existingMiner && existingMiner.isActive) {
        return { success: false, message: 'Already mining' }
      }

      // Generate realistic hash rate based on user's equipment simulation
      const baseHashRate = Math.random() * 800 + 200 // 200-1000 H/s
      const hashRate = Math.floor(baseHashRate)

      const session: MinerSession = {
        id: uuidv4(),
        userId,
        walletAddress,
        hashRate,
        startTime: new Date(),
        lastShareTime: new Date(),
        totalShares: 0,
        isActive: true
      }

      this.miners.set(session.id, session)
      this.updatePoolStats()

      // Update user mining stats
      await this.updateUserMiningStats(userId, { isActiveMiner: true, currentHashRate: hashRate })

      return { success: true, message: 'Mining started', hashRate }
    } catch (error) {
      console.error('Error starting mining:', error)
      return { success: false, message: 'Failed to start mining' }
    }
  }

  async stopMining(userId: string): Promise<{ success: boolean; message: string; rewards?: number }> {
    try {
      const minerEntry = Array.from(this.miners.entries()).find(([_, m]) => m.userId === userId && m.isActive)
      
      if (!minerEntry) {
        return { success: false, message: 'Not currently mining' }
      }

      const [sessionId, miner] = minerEntry
      miner.isActive = false

      // Calculate session rewards
      const sessionDuration = (Date.now() - miner.startTime.getTime()) / 1000 // seconds
      const rewards = this.calculateRewards(miner.hashRate, sessionDuration, miner.totalShares)

      // Update user stats
      const currentStats = await this.getUserMiningStats(userId)
      await this.updateUserMiningStats(userId, {
        isActiveMiner: false,
        currentHashRate: 0,
        totalRewards: currentStats.totalRewards + rewards,
        sessionsCount: currentStats.sessionsCount + 1,
        totalMiningTime: currentStats.totalMiningTime + sessionDuration
      })

      this.miners.delete(sessionId)
      this.updatePoolStats()

      return { success: true, message: 'Mining stopped', rewards }
    } catch (error) {
      console.error('Error stopping mining:', error)
      return { success: false, message: 'Failed to stop mining' }
    }
  }

  getPoolStats(): PoolStats {
    return { ...this.poolStats }
  }

  async getUserRewards(userId: string): Promise<number> {
    const stats = await this.getUserMiningStats(userId)
    return stats.totalRewards
  }

  async getUserMiningStats(userId: string): Promise<MiningStats> {
    try {
      // Use the database adapter directly
      const context = await auth.$context
      const user = await context.adapter.findMany<any>({
        model: 'user',
        where: [{ field: 'id', value: userId }]
      })

      if (!user || user.length === 0 || !user[0].miningStats) {
        return {
          totalRewards: 0,
          currentHashRate: 0,
          isActiveMiner: false,
          sessionsCount: 0,
          totalMiningTime: 0
        }
      }
      return JSON.parse(user[0].miningStats)
    } catch (error) {
      console.error('Error getting user mining stats:', error)
      return {
        totalRewards: 0,
        currentHashRate: 0,
        isActiveMiner: false,
        sessionsCount: 0,
        totalMiningTime: 0
      }
    }
  }

  private async updateUserMiningStats(userId: string, updates: Partial<MiningStats>): Promise<void> {
    try {
      const currentStats = await this.getUserMiningStats(userId)
      const newStats = { ...currentStats, ...updates }
      
      // Use the database adapter directly
      const context = await auth.$context
      await context.adapter.update<any>({
        model: 'user',
        where: [{ field: 'id', value: userId }],
        update: {
          miningStats: JSON.stringify(newStats)
        }
      })
    } catch (error) {
      console.error('Error updating user mining stats:', error)
    }
  }

  private calculateRewards(hashRate: number, duration: number, shares: number): number {
    // Reward calculation based on hash rate, time, and shares found
    const baseReward = 0.1 // Base reward per second
    const hashMultiplier = hashRate / 1000 // Normalize hash rate
    const timeBonus = Math.min(duration / 3600, 2) // Max 2x bonus for long sessions
    const shareBonus = shares * 5 // Bonus per share
    
    return Math.floor((baseReward * hashMultiplier * duration * timeBonus) + shareBonus)
  }

  private updatePoolStats(): void {
    const activeMiners = Array.from(this.miners.values()).filter(m => m.isActive)
    this.poolStats.activeMiners = activeMiners.length
    this.poolStats.totalHashRate = activeMiners.reduce((sum, m) => sum + m.hashRate, 0)
  }

  private startBlockGeneration(): void {
    this.blockInterval = setInterval(() => {
      this.simulateBlockGeneration()
    }, 30000) // Check for blocks every 30 seconds
  }

  private startDifficultyAdjustment(): void {
    this.difficultyInterval = setInterval(() => {
      this.adjustDifficulty()
    }, 300000) // Adjust difficulty every 5 minutes
  }

  private simulateBlockGeneration(): void {
    const activeMiners = Array.from(this.miners.values()).filter(m => m.isActive)
    
    if (activeMiners.length === 0) return

    // Probability of finding a block based on total pool hash rate
    const probability = Math.min(this.poolStats.totalHashRate / 100000, 0.3) // Max 30% chance
    
    if (Math.random() < probability) {
      this.poolStats.blocksFound++
      const blockReward = 1000 + Math.floor(Math.random() * 500) // 1000-1500 AUM
      
      // Distribute rewards to active miners based on their contribution
      this.distributeBlockReward(blockReward, activeMiners)
      
      console.log(`🎉 Block found! Reward: ${blockReward} AUM distributed to ${activeMiners.length} miners`)
    }
  }

  private async distributeBlockReward(totalReward: number, activeMiners: MinerSession[]): Promise<void> {
    const totalHashRate = activeMiners.reduce((sum, m) => sum + m.hashRate, 0)
    
    for (const miner of activeMiners) {
      const minerShare = (miner.hashRate / totalHashRate) * totalReward
      const reward = Math.floor(minerShare)
      
      // Update miner's shares
      miner.totalShares++
      miner.lastShareTime = new Date()
      
      // Update user rewards
      const currentStats = await this.getUserMiningStats(miner.userId)
      await this.updateUserMiningStats(miner.userId, {
        totalRewards: currentStats.totalRewards + reward
      })
    }
    
    this.poolStats.totalRewards += totalReward
  }

  private adjustDifficulty(): void {
    const targetHashRate = 50000 // Target pool hash rate
    const currentHashRate = this.poolStats.totalHashRate
    
    if (currentHashRate > targetHashRate * 1.2) {
      this.poolStats.difficulty = Math.floor(this.poolStats.difficulty * 1.1)
    } else if (currentHashRate < targetHashRate * 0.8) {
      this.poolStats.difficulty = Math.floor(this.poolStats.difficulty * 0.9)
    }
    
    // Ensure difficulty stays within reasonable bounds
    this.poolStats.difficulty = Math.max(256, Math.min(16384, this.poolStats.difficulty))
    
    console.log(`⚙️ Difficulty adjusted to ${this.poolStats.difficulty}`)
  }

  // WebSocket message handlers
  getActiveMiners(): MinerSession[] {
    return Array.from(this.miners.values()).filter(m => m.isActive)
  }

  getMinerByUserId(userId: string): MinerSession | undefined {
    return Array.from(this.miners.values()).find(m => m.userId === userId && m.isActive)
  }

  // Cleanup
  shutdown(): void {
    if (this.blockInterval) clearInterval(this.blockInterval)
    if (this.difficultyInterval) clearInterval(this.difficultyInterval)
  }
}

export const miningService = new MiningService()
export type { MinerSession, MiningStats, PoolStats } 