import { betterAuth } from "better-auth"
import Database from "better-sqlite3"
import { v4 as uuidv4 } from "uuid"

export const auth = betterAuth({
  database: new Database("./tribeminer.db"),
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
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    generateId: () => uuidv4()
  }
}) 