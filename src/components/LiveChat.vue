<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const isOpen = ref(false)
const newMessage = ref('')
const messages = ref([
  {
    id: 1,
    type: 'system',
    content: 'Welcome to TribeMiner support! How can we help you today?',
    timestamp: new Date(),
    sender: 'System'
  }
])

const messagesContainer = ref<HTMLElement>()

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: newMessage.value,
    timestamp: new Date(),
    sender: authStore.user?.username || 'User'
  }

  messages.value.push(userMessage)
  const messageContent = newMessage.value
  newMessage.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Simulate bot response
  setTimeout(() => {
    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: getBotResponse(messageContent),
      timestamp: new Date(),
      sender: 'Support Bot'
    }
    messages.value.push(botResponse)
    nextTick(() => scrollToBottom())
  }, 1000)
}

const getBotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('mining') || lowerMessage.includes('mine')) {
    return 'For mining issues, please check your wallet connection and ensure your browser supports WebSocket connections. Our mining pool operates 24/7!'
  } else if (lowerMessage.includes('wallet') || lowerMessage.includes('connect')) {
    return 'To connect your wallet, go to the Mining section and click "Connect Wallet". Make sure you have a compatible Web3 wallet installed.'
  } else if (lowerMessage.includes('reward') || lowerMessage.includes('aum')) {
    return 'Your AUM rewards are automatically credited to your account. You can view them in the Wallet section and withdraw when you reach the minimum threshold.'
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return 'I\'m here to help! You can ask me about mining, wallets, rewards, or any technical issues you\'re experiencing.'
  } else {
    return 'Thank you for your message! Our support team will get back to you shortly. In the meantime, you can check our FAQ or continue mining!'
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

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <!-- Chat Button -->
  <button
    @click="toggleChat"
    class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-button rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 glow-blue"
  >
    <i v-if="!isOpen" class="fas fa-comments text-white text-xl"></i>
    <i v-else class="fas fa-times text-white text-xl"></i>
  </button>

  <!-- Chat Window -->
  <transition name="chat">
    <div
      v-if="isOpen"
      class="fixed bottom-24 right-6 w-80 h-96 glass-card border border-white/10 rounded-xl shadow-2xl z-40 flex flex-col"
    >
      <!-- Header -->
      <div class="p-4 border-b border-white/10 flex items-center space-x-3">
        <div class="w-3 h-3 bg-accent-green rounded-full animate-pulse"></div>
        <div>
          <h3 class="text-white font-semibold">Live Support</h3>
          <p class="text-gray-400 text-xs">Online - Average response time: 2 min</p>
        </div>
      </div>

      <!-- Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-xs rounded-lg p-3 text-sm"
            :class="{
              'bg-primary-500 text-white': message.type === 'user',
              'bg-white/10 text-gray-200': message.type === 'bot' || message.type === 'system'
            }"
          >
            <p>{{ message.content }}</p>
            <div class="flex items-center justify-between mt-2 text-xs opacity-70">
              <span>{{ message.sender }}</span>
              <span>{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-white/10">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 text-sm"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim()"
            class="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors duration-200"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style> 