import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
  role: 'customer' | 'admin'
  avatar?: string
  walletAddress?: string
  createdAt: Date
  lastLogin: Date
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isCustomer = computed(() => user.value?.role === 'customer')

  async function login(credentials: { email: string; password: string }) {
    isLoading.value = true
    error.value = ''

    try {
      // For demo purposes, simulate login with predefined users
      const { email, password } = credentials
      
      let mockUser: User
      if (email === 'admin@tribeminer.com' && password === 'admin123') {
        mockUser = {
          id: '1',
          username: 'admin',
          email: 'admin@tribeminer.com',
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff',
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date()
        }
      } else if (email === 'user@tribeminer.com' && password === 'user123') {
        mockUser = {
          id: '2',
          username: 'user',
          email: 'user@tribeminer.com',
          role: 'customer',
          avatar: 'https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff',
          walletAddress: 'DEMO_WALLET_ADDRESS',
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date()
        }
      } else {
        throw new Error('Invalid credentials')
      }

      const mockToken = 'mock_jwt_token_' + Date.now()
      
      user.value = mockUser
      token.value = mockToken
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData: {
    username: string
    email: string
    password: string
  }) {
    isLoading.value = true
    error.value = ''

    try {
      // Simulate registration
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: 'customer',
        avatar: `https://ui-avatars.com/api/?name=${userData.username}&background=8b5cf6&color=fff`,
        createdAt: new Date(),
        lastLogin: new Date()
      }

      const mockToken = 'mock_jwt_token_' + Date.now()
      
      user.value = newUser
      token.value = mockToken
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  function loadStoredAuth() {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to load stored auth:', err)
        logout()
      }
    }
  }

  async function updateProfile(updates: Partial<User>) {
    if (!user.value) return false

    try {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    } catch (err) {
      console.error('Failed to update profile:', err)
      return false
    }
  }

  // Initialize auth state from localStorage
  loadStoredAuth()

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isCustomer,
    login,
    register,
    logout,
    updateProfile,
    loadStoredAuth
  }
}) 