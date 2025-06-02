<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startMining = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          TribeMiner by BitTribe
        </h1>
        <p class="text-xl text-gray-300 mb-8">
          Join the most efficient AUM token mining pool and maximize your rewards
        </p>
        <button
          @click="startMining"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Start Mining Now
        </button>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gray-800 p-6 rounded-lg">
          <div class="text-blue-500 text-4xl mb-4">
            <i class="fas fa-bolt"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">High Performance</h3>
          <p class="text-gray-400">
            Optimized mining algorithms ensure maximum efficiency and rewards
          </p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg">
          <div class="text-blue-500 text-4xl mb-4">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Secure Mining</h3>
          <p class="text-gray-400">
            Enterprise-grade security protecting your mining operations
          </p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg">
          <div class="text-blue-500 text-4xl mb-4">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Real-time Analytics</h3>
          <p class="text-gray-400">
            Monitor your mining performance with detailed statistics
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 