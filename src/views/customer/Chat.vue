<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { MockDataService, type MockChatMessage } from '../../lib/mockData'

const authStore = useAuthStore()

const newMessage = ref('')
const selectedChannel = ref('general')
const isTyping = ref(false)
const typingTimeout = ref<number>()
const isLoading = ref(false)

const messages = ref<MockChatMessage[]>([])

const channels = ref([
  { id: 'general', name: 'General', icon: 'fas fa-comments', color: 'text-primary-400' },
  { id: 'mining', name: 'Mining', icon: 'fas fa-hammer', color: 'text-accent-teal' },
  { id: 'support', name: 'Support', icon: 'fas fa-headset', color: 'text-purple-400' },
  { id: 'announcements', name: 'Announcements', icon: 'fas fa-bullhorn', color: 'text-yellow-400' }
])

const onlineUsers = ref([
  { username: 'alice_miner', status: 'mining', avatar: 'https://ui-avatars.com/api/?name=Alice&background=10b981&color=fff' },
  { username: 'user', status: 'active', avatar: 'https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff' },
  { username: 'charlie_dev', status: 'mining', avatar: 'https://ui-avatars.com/api/?name=Charlie&background=ef4444&color=fff' },
  { username: 'bob_crypto', status: 'away', avatar: 'https://ui-avatars.com/api/?name=Bob&background=f59e0b&color=fff' },
  { username: 'admin', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff' }
])

const messagesContainer = ref<HTMLElement>()

const loadMessages = async () => {
  isLoading.value = true
  try {
    messages.value = await MockDataService.getChatMessages()
  } catch (error) {
    console.error('Failed to load chat messages:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredMessages = computed(() => {
  // For demo purposes, show all messages in general channel
  // In a real app, you'd filter by channel
  return messages.value.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
})

const sendMessage = async () => {
  if (!newMessage.value.trim() || !authStore.user) return

  try {
    const newMsg = await MockDataService.sendChatMessage(authStore.user.id, newMessage.value)
    messages.value.push(newMsg)
    newMessage.value = ''

    // Scroll to bottom
    await nextTick()
    scrollToBottom()

    // Simulate bot responses
    setTimeout(() => {
      const responses = [
        'Welcome to the mining pool!',
        'Great to see new miners joining!',
        'Feel free to ask any questions.',
        'Happy mining!'
      ]
      
      const botMessage = {
        id: Date.now().toString() + '_bot',
        userId: 'bot',
        username: 'TribeBot',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        avatar: 'https://ui-avatars.com/api/?name=Bot&background=6366f1&color=fff'
      }
      
      messages.value.push(botMessage)
      scrollToBottom()
    }, 1000 + Math.random() * 2000)
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'mining': return 'bg-accent-green'
    case 'active': return 'bg-primary-400'
    case 'away': return 'bg-yellow-400'
    default: return 'bg-gray-500'
  }
}

const handleTyping = () => {
  isTyping.value = true
  
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
  
  typingTimeout.value = window.setTimeout(() => {
    isTyping.value = false
  }, 2000)
}

const changeChannel = (channelId: string) => {
  selectedChannel.value = channelId
  nextTick(() => scrollToBottom())
}

onMounted(async () => {
  await loadMessages()
  scrollToBottom()
})
</script>

<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Sidebar -->
    <div class="w-80 glass-card border-r border-white/10 flex flex-col">
      <!-- Channels -->
      <div class="p-4 border-b border-white/10">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
          <i class="fas fa-comments text-primary-400 mr-2"></i>
          Channels
        </h3>
        <div class="space-y-1">
          <div
            v-for="channel in channels"
            :key="channel.id"
            @click="changeChannel(channel.id)"
            class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
            :class="{
              'bg-primary-500/20 text-primary-300': selectedChannel === channel.id,
              'text-gray-300 hover:bg-white/10 hover:text-white': selectedChannel !== channel.id
            }"
          >
            <i :class="[channel.icon, channel.color]"></i>
            <span class="font-medium"># {{ channel.name }}</span>
            <span 
              v-if="filteredMessages.length > 0 && selectedChannel !== channel.id"
              class="ml-auto w-2 h-2 bg-accent-green rounded-full animate-pulse"
            ></span>
          </div>
        </div>
      </div>

      <!-- Online Users -->
      <div class="flex-1 p-4 overflow-y-auto">
        <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Online Users ({{ onlineUsers.length }})
        </h4>
        <div class="space-y-2">
          <!-- Current User -->
          <div class="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
            <div class="relative">
              <img :src="authStore.user?.avatar" :alt="authStore.user?.username" class="w-8 h-8 rounded-full" />
              <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-green rounded-full border-2 border-gray-900"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ authStore.user?.username }} (You)</p>
              <p class="text-xs text-accent-green">Online</p>
            </div>
          </div>

          <!-- Other Users -->
          <div
            v-for="user in onlineUsers"
            :key="user.username"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
          >
            <div class="relative">
              <img :src="user.avatar" :alt="user.username" class="w-8 h-8 rounded-full" />
              <div :class="getStatusColor(user.status)" class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ user.username }}</p>
              <p class="text-xs text-gray-400 capitalize">{{ user.status }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Chat Header -->
      <div class="glass-card border-b border-white/10 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <i :class="[channels.find(c => c.id === selectedChannel)?.icon, channels.find(c => c.id === selectedChannel)?.color, 'text-xl']"></i>
            <div>
              <h2 class="text-xl font-bold text-white"># {{ channels.find(c => c.id === selectedChannel)?.name }}</h2>
              <p class="text-gray-400 text-sm">{{ filteredMessages.length }} messages</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button class="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <i class="fas fa-search"></i>
            </button>
            <button class="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20"
      >
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="flex space-x-3 group"
        >
          <!-- Avatar -->
          <img 
            :src="message.avatar || `https://ui-avatars.com/api/?name=${message.username}&background=6b7280&color=fff`" 
            :alt="message.username"
            class="w-10 h-10 rounded-full flex-shrink-0"
          />
          
          <!-- Message Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-1">
              <span 
                class="font-semibold text-white"
                :class="{
                  'text-primary-400': message.username === authStore.user?.username
                }"
              >
                {{ message.username }}
              </span>
              <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="text-gray-200 break-words">
              {{ message.message }}
            </div>
          </div>
          
          <!-- Message Actions -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-start space-x-1">
            <button class="p-1 text-gray-500 hover:text-white transition-colors duration-200">
              <i class="fas fa-reply text-xs"></i>
            </button>
            <button class="p-1 text-gray-500 hover:text-white transition-colors duration-200">
              <i class="fas fa-heart text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex items-center space-x-2 text-gray-400 text-sm">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <span>Someone is typing...</span>
        </div>
      </div>

      <!-- Message Input -->
      <div class="glass-card border-t border-white/10 p-4">
        <form @submit.prevent="sendMessage" class="flex space-x-3">
          <div class="flex-1 relative">
            <input
              v-model="newMessage"
              @input="handleTyping"
              type="text"
              placeholder="Type a message..."
              class="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 px-4 py-3 pr-12 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <i class="fas fa-smile"></i>
            </button>
          </div>
          <button
            type="submit"
            :disabled="!newMessage.trim()"
            class="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <i class="fas fa-paper-plane"></i>
            <span class="hidden sm:inline">Send</span>
          </button>
        </form>
        
        <!-- Quick Actions -->
        <div class="mt-3 flex items-center space-x-4 text-sm text-gray-400">
          <button class="hover:text-white transition-colors duration-200">
            <i class="fas fa-paperclip mr-1"></i>
            Attach
          </button>
          <button class="hover:text-white transition-colors duration-200">
            <i class="fas fa-gif mr-1"></i>
            GIF
          </button>
          <button class="hover:text-white transition-colors duration-200">
            <i class="fas fa-code mr-1"></i>
            Code
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 