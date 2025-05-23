<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()

const isEditing = ref(false)
const editForm = ref({
  username: '',
  email: '',
  avatar: ''
})

const isSaving = ref(false)
const showChangePassword = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (authStore.user) {
    editForm.value = {
      username: authStore.user.username,
      email: authStore.user.email,
      avatar: authStore.user.avatar || ''
    }
  }
})

const startEditing = () => {
  isEditing.value = true
  if (authStore.user) {
    editForm.value = {
      username: authStore.user.username,
      email: authStore.user.email,
      avatar: authStore.user.avatar || ''
    }
  }
}

const cancelEditing = () => {
  isEditing.value = false
  showChangePassword.value = false
}

const saveProfile = async () => {
  isSaving.value = true
  
  try {
    const success = await authStore.updateProfile({
      username: editForm.value.username,
      email: editForm.value.email,
      avatar: editForm.value.avatar
    })
    
    if (success) {
      isEditing.value = false
      // Show success message
      alert('Profile updated successfully!')
    } else {
      alert('Failed to update profile')
    }
  } catch (error) {
    console.error('Profile update error:', error)
    alert('Failed to update profile')
  } finally {
    isSaving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match')
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    alert('Password must be at least 6 characters')
    return
  }
  
  // In a real app, this would make an API call to change password
  alert('Password changed successfully!')
  showChangePassword.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const generateAvatar = () => {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', '06b6d4']
  const color = colors[Math.floor(Math.random() * colors.length)]
  editForm.value.avatar = `https://ui-avatars.com/api/?name=${editForm.value.username}&background=${color}&color=fff`
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Profile Settings</h1>
      <p class="text-gray-400">Manage your account information and preferences</p>
    </div>

    <!-- Profile Overview -->
    <div class="glass-card p-8 rounded-xl hover-lift">
      <div class="flex items-center space-x-6 mb-6">
        <!-- Avatar -->
        <div class="relative">
          <img 
            :src="isEditing ? editForm.avatar : authStore.user?.avatar" 
            :alt="authStore.user?.username"
            class="w-24 h-24 rounded-full border-4 border-primary-500/30"
          />
          <div v-if="isEditing" class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
            <i class="fas fa-camera text-white text-xl"></i>
          </div>
        </div>
        
        <!-- User Info -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-white mb-1">{{ authStore.user?.username }}</h2>
          <p class="text-gray-400 mb-2">{{ authStore.user?.email }}</p>
          <div class="flex items-center space-x-4 text-sm text-gray-400">
            <span class="flex items-center">
              <i class="fas fa-calendar mr-2"></i>
              Joined {{ formatDate(authStore.user?.createdAt || new Date()) }}
            </span>
            <span class="flex items-center">
              <i class="fas fa-clock mr-2"></i>
              Last active {{ formatDate(authStore.user?.lastLogin || new Date()) }}
            </span>
          </div>
        </div>
        
        <!-- Edit Button -->
        <div>
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="btn-primary text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <i class="fas fa-edit"></i>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-if="isEditing" class="glass-card p-6 rounded-xl">
      <h3 class="text-xl font-bold text-white mb-6 flex items-center">
        <i class="fas fa-user-edit text-primary-400 mr-3"></i>
        Edit Profile Information
      </h3>
      
      <form @submit.prevent="saveProfile" class="space-y-6">
        <!-- Avatar Section -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Avatar</label>
          <div class="flex items-center space-x-4">
            <img :src="editForm.avatar" :alt="editForm.username" class="w-16 h-16 rounded-full" />
            <div class="flex-1">
              <input
                v-model="editForm.avatar"
                type="url"
                placeholder="Avatar URL"
                class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              />
            </div>
            <button
              type="button"
              @click="generateAvatar"
              class="btn-secondary text-white px-4 py-3 rounded-lg font-medium"
            >
              Generate
            </button>
          </div>
        </div>

        <!-- Username -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Username</label>
          <input
            v-model="editForm.username"
            type="text"
            required
            minlength="3"
            class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            placeholder="Your username"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2">Email</label>
          <input
            v-model="editForm.email"
            type="email"
            required
            class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            placeholder="Your email"
          />
        </div>

        <!-- Save/Cancel Buttons -->
        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="isSaving"
            class="btn-primary text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <i v-if="isSaving" class="fas fa-spinner animate-spin"></i>
            <i v-else class="fas fa-save"></i>
            <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
          <button
            type="button"
            @click="cancelEditing"
            class="btn-secondary text-white px-6 py-3 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Account Information -->
    <div class="glass-card p-6 rounded-xl">
      <h3 class="text-xl font-bold text-white mb-6 flex items-center">
        <i class="fas fa-info-circle text-primary-400 mr-3"></i>
        Account Information
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white/5 p-4 rounded-lg">
          <label class="text-gray-400 text-sm">User ID</label>
          <p class="text-white font-mono">{{ authStore.user?.id }}</p>
        </div>
        <div class="bg-white/5 p-4 rounded-lg">
          <label class="text-gray-400 text-sm">Account Type</label>
          <p class="text-white capitalize">{{ authStore.user?.role }}</p>
        </div>
        <div class="bg-white/5 p-4 rounded-lg">
          <label class="text-gray-400 text-sm">Wallet Address</label>
          <p class="text-white font-mono text-sm">{{ authStore.user?.walletAddress || 'Not connected' }}</p>
        </div>
        <div class="bg-white/5 p-4 rounded-lg">
          <label class="text-gray-400 text-sm">Member Since</label>
          <p class="text-white">{{ formatDate(authStore.user?.createdAt || new Date()) }}</p>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="glass-card p-6 rounded-xl">
      <h3 class="text-xl font-bold text-white mb-6 flex items-center">
        <i class="fas fa-shield-alt text-primary-400 mr-3"></i>
        Security Settings
      </h3>
      
      <div class="space-y-4">
        <!-- Change Password -->
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-white font-medium">Password</h4>
              <p class="text-gray-400 text-sm">Change your account password</p>
            </div>
            <button
              @click="showChangePassword = !showChangePassword"
              class="btn-secondary text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {{ showChangePassword ? 'Cancel' : 'Change Password' }}
            </button>
          </div>
          
          <!-- Password Change Form -->
          <div v-if="showChangePassword" class="mt-4 pt-4 border-t border-white/10">
            <form @submit.prevent="changePassword" class="space-y-4">
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                placeholder="Current password"
                required
                class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              />
              <input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="New password"
                required
                minlength="6"
                class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              />
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
                minlength="6"
                class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              />
              <button
                type="submit"
                class="btn-primary text-white px-6 py-3 rounded-lg font-medium"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-white font-medium">Two-Factor Authentication</h4>
              <p class="text-gray-400 text-sm">Add an extra layer of security to your account</p>
            </div>
            <span class="text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/30">
              Coming Soon
            </span>
          </div>
        </div>

        <!-- Login Notifications -->
        <div class="bg-white/5 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-white font-medium">Login Notifications</h4>
              <p class="text-gray-400 text-sm">Get notified of new login attempts</p>
            </div>
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2 rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500/50" />
              <span class="text-white text-sm">Enabled</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="glass-card p-6 rounded-xl border border-red-500/30">
      <h3 class="text-xl font-bold text-red-300 mb-6 flex items-center">
        <i class="fas fa-exclamation-triangle text-red-400 mr-3"></i>
        Danger Zone
      </h3>
      
      <div class="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-red-300 font-medium">Delete Account</h4>
            <p class="text-gray-400 text-sm">Permanently delete your account and all data</p>
          </div>
          <button
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            onclick="alert('Account deletion is not available in demo mode')"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 