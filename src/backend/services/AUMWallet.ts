interface Transaction {
  from: string
  to: string
  amount: number
  timestamp: Date
}

export class AUMWallet {
  private static instance: AUMWallet
  private balances: Map<string, number> = new Map()
  private transactions: Transaction[] = []

  private constructor() {}

  static getInstance(): AUMWallet {
    if (!AUMWallet.instance) {
      AUMWallet.instance = new AUMWallet()
    }
    return AUMWallet.instance
  }

  getBalance(address: string): number {
    return this.balances.get(address) || 0
  }

  async transfer(from: string, to: string, amount: number): Promise<boolean> {
    const fromBalance = this.balances.get(from) || 0
    if (fromBalance < amount) return false

    this.balances.set(from, fromBalance - amount)
    this.balances.set(to, (this.balances.get(to) || 0) + amount)

    this.transactions.push({
      from,
      to,
      amount,
      timestamp: new Date()
    })

    return true
  }

  getTransactionHistory(address: string): Transaction[] {
    return this.transactions.filter(tx => 
      tx.from === address || tx.to === address
    )
  }
}

export const aumWallet = AUMWallet.getInstance() 