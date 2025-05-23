import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'

// Initialize database
const db = new Database('./tribeminer.db')

// Create auth instance for database setup
const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer"
      },
      walletAddress: {
        type: "string", 
        required: false
      },
      avatar: {
        type: "string",
        required: false
      },
      miningStats: {
        type: "string", // JSON string
        required: false,
        defaultValue: JSON.stringify({
          totalRewards: 0,
          currentHashRate: 0,
          isActiveMiner: false,
          sessionsCount: 0,
          totalMiningTime: 0
        })
      }
    }
  },
  advanced: {
    generateId: () => uuidv4()
  }
})

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...')
    
    // This will create all the necessary tables
    await auth.$context
    console.log('✅ Database tables created successfully')
    
    // Create demo users
    console.log('👥 Creating demo users...')
    
    // Admin user
    try {
      await auth.api.signUpEmail({
        body: {
          email: 'admin@tribeminer.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin'
        }
      })
      console.log('✅ Admin user created: admin@tribeminer.com / admin123')
    } catch (error) {
      console.log('ℹ️ Admin user already exists')
    }
    
    // Customer user
    try {
      await auth.api.signUpEmail({
        body: {
          email: 'user@tribeminer.com',
          password: 'user123',
          name: 'Demo User',
          role: 'customer'
        }
      })
      console.log('✅ Customer user created: user@tribeminer.com / user123')
    } catch (error) {
      console.log('ℹ️ Customer user already exists')
    }
    
    console.log('🎉 Database initialization complete!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
  } finally {
    db.close()
  }
}

// Run initialization
initializeDatabase() 