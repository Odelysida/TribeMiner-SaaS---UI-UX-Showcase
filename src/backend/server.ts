import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'
import { auth } from './auth.js'
import { miningService } from './services/MiningService.js'

// Extend Express Request interface for auth
declare global {
  namespace Express {
    interface Request {
      user?: any
      session?: any
    }
  }
}

const app = express()
const server = createServer(app)

// WebSocket server setup
const wss = new WebSocketServer({ 
  server,
  path: '/ws'
})

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Better Auth API endpoints
app.use('/api/auth/*', async (req: Request, res: Response) => {
  try {
    const response = await auth.handler(req)
    
    // Set cookies from BetterAuth response
    if (response.headers.get('set-cookie')) {
      res.setHeader('set-cookie', response.headers.get('set-cookie'))
    }
    
    // Set other headers
    for (const [key, value] of response.headers.entries()) {
      if (key !== 'set-cookie') {
        res.setHeader(key, value)
      }
    }
    
    res.status(response.status)
    
    if (response.body) {
      const body = await response.text()
      res.send(body)
    } else {
      res.end()
    }
  } catch (error) {
    console.error('Auth handler error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Authentication middleware
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>
    })
    
    if (!session) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    req.user = session.user
    req.session = session
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Invalid session' })
  }
}

// Mining endpoints with authentication
app.get('/api/pool/stats', (req: Request, res: Response) => {
  try {
    const stats = miningService.getPoolStats()
    res.json(stats)
  } catch (error) {
    console.error('Error getting pool stats:', error)
    res.status(500).json({ error: 'Failed to get pool statistics' })
  }
})

app.post('/api/mining/start', requireAuth, async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body
    const userId = req.user.id
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' })
    }
    
    const result = await miningService.startMining(userId, walletAddress)
    
    if (result.success) {
      // Broadcast mining start to WebSocket clients
      broadcastToUser(userId, {
        type: 'mining_started',
        data: { hashRate: result.hashRate, userId }
      })
      
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Error starting mining:', error)
    res.status(500).json({ error: 'Failed to start mining' })
  }
})

app.post('/api/mining/stop', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const result = await miningService.stopMining(userId)
    
    if (result.success) {
      // Broadcast mining stop to WebSocket clients
      broadcastToUser(userId, {
        type: 'mining_stopped',
        data: { rewards: result.rewards, userId }
      })
      
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Error stopping mining:', error)
    res.status(500).json({ error: 'Failed to stop mining' })
  }
})

app.get('/api/mining/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const stats = await miningService.getUserMiningStats(userId)
    res.json(stats)
  } catch (error) {
    console.error('Error getting mining stats:', error)
    res.status(500).json({ error: 'Failed to get mining statistics' })
  }
})

app.get('/api/rewards/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    
    // Users can only access their own rewards, unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    const rewards = await miningService.getUserRewards(userId)
    res.json({ rewards })
  } catch (error) {
    console.error('Error getting user rewards:', error)
    res.status(500).json({ error: 'Failed to get user rewards' })
  }
})

// Admin endpoints
app.get('/api/admin/users', requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    
    // Get all active miners
    const activeMiners = miningService.getActiveMiners()
    res.json({ activeMiners })
  } catch (error) {
    console.error('Error getting admin data:', error)
    res.status(500).json({ error: 'Failed to get admin data' })
  }
})

// WebSocket connection handling
const userConnections = new Map<string, WebSocket>()

wss.on('connection', async (ws, req) => {
  console.log('New WebSocket connection')
  
  let userId: string | null = null
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString())
      
      if (data.type === 'auth') {
        // Authenticate WebSocket connection
        try {
          const session = await auth.api.getSession({
            headers: { cookie: data.cookie } as Record<string, string>
          })
          
          if (session) {
            userId = session.user.id
            userConnections.set(userId, ws)
            ws.send(JSON.stringify({ type: 'auth_success', userId }))
            
            // Send current mining status
            const miner = miningService.getMinerByUserId(userId)
            if (miner) {
              ws.send(JSON.stringify({
                type: 'mining_status',
                data: { isActive: miner.isActive, hashRate: miner.hashRate }
              }))
            }
          } else {
            ws.send(JSON.stringify({ type: 'auth_failed' }))
          }
        } catch (error) {
          console.error('WebSocket auth error:', error)
          ws.send(JSON.stringify({ type: 'auth_failed' }))
        }
      } else if (data.type === 'subscribe_pool_stats') {
        // Subscribe to pool statistics updates
        const stats = miningService.getPoolStats()
        ws.send(JSON.stringify({ type: 'pool_stats', data: stats }))
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  })
  
  ws.on('close', () => {
    if (userId) {
      userConnections.delete(userId)
    }
    console.log('WebSocket connection closed')
  })
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

// Broadcast function for sending messages to specific users
function broadcastToUser(userId: string, message: any) {
  const userWs = userConnections.get(userId)
  if (userWs && userWs.readyState === WebSocket.OPEN) {
    userWs.send(JSON.stringify(message))
  }
}

// Broadcast pool stats to all connected clients every 10 seconds
setInterval(() => {
  const stats = miningService.getPoolStats()
  const message = JSON.stringify({ type: 'pool_stats', data: stats })
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}, 10000)

// Broadcast mining updates every 5 seconds
setInterval(() => {
  const activeMiners = miningService.getActiveMiners()
  
  activeMiners.forEach(miner => {
    const userWs = userConnections.get(miner.userId)
    if (userWs && userWs.readyState === WebSocket.OPEN) {
      // Simulate hash rate fluctuation
      const fluctuation = (Math.random() - 0.5) * 50 // ±25 H/s
      const currentHashRate = Math.max(0, miner.hashRate + fluctuation)
      
      userWs.send(JSON.stringify({
        type: 'mining_update',
        data: {
          hashRate: Math.floor(currentHashRate),
          shares: miner.totalShares,
          uptime: Math.floor((Date.now() - miner.startTime.getTime()) / 1000)
        }
      }))
    }
  })
}, 5000)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    activeMiners: miningService.getPoolStats().activeMiners
  })
})

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully...')
  miningService.shutdown()
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down gracefully...')
  miningService.shutdown()
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 TribeMiner Server running on port ${PORT}`)
  console.log(`📊 Pool Stats: ${JSON.stringify(miningService.getPoolStats(), null, 2)}`)
  console.log(`🔗 WebSocket available at ws://localhost:${PORT}/ws`)
}) 