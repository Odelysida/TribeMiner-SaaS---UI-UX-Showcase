// Mock auth client for static deployment
import { ref } from 'vue'

// Define the session type
interface MockSession {
  user: {
    id: string
    email: string
    username: string
  }
}

// Mock session data
const mockSession = ref<MockSession | null>(null)

// Mock auth functions
export const signIn = async (credentials: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock successful sign in
  mockSession.value = {
    user: {
      id: '1',
      email: credentials.email,
      username: credentials.email.split('@')[0]
    }
  }
  
  return { data: mockSession.value, error: null }
}

export const signUp = async (userData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock successful sign up
  mockSession.value = {
    user: {
      id: '1',
      email: userData.email,
      username: userData.username || userData.email.split('@')[0]
    }
  }
  
  return { data: mockSession.value, error: null }
}

export const signOut = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  mockSession.value = null
  return { data: null, error: null }
}

export const useSession = () => {
  return {
    data: mockSession,
    isPending: ref(false),
    error: ref(null)
  }
}

export const updateUser = async (userData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (mockSession.value) {
    mockSession.value.user = { ...mockSession.value.user, ...userData }
  }
  
  return { data: mockSession.value, error: null }
}

// Mock auth client object for compatibility
export const authClient = {
  signIn,
  signUp,
  signOut,
  useSession,
  updateUser
} 