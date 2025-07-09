<template>
  <!-- Modern Settings Modal -->
  <transition name="fade">
    <div
      v-if="showSettingsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 relative shadow-2xl border border-gray-700/50"
      >
        <!-- Enhanced Close Button -->
        <button
          @click="showSettingsModal = false"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Enhanced Modal Header -->
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-100 flex items-center space-x-2">
            <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ $t('components.sequence.monitor.settings.title') }}</span>
          </h3>
          <p class="text-gray-400 text-sm mt-2">Configure monitoring display preferences</p>
        </div>

        <!-- Enhanced Modal Content -->
        <div class="space-y-4">
          <MonitorViewSetting />
        </div>
      </div>
    </div>
  </transition>

  <!-- Main Monitoring Content -->
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
    <!-- Enhanced Monitoring Grid -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Image History Card -->
      <div
        class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-100">Image History</h2>
          <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <SequenceImageHistory />
      </div>

      <!-- Sequence Tree Card -->
      <div
        class="lg:col-span-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-100">Sequence Structure</h2>
          <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <SequenzGraph />
      </div>
    </div>
  </div>

  <!-- Enhanced Floating Settings Button -->
  <button
    type="button"
    class="fixed bottom-6 right-6 z-20 p-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
    @click="showSettingsModal = true"
    aria-label="Open settings"
  >
    <Cog6ToothIcon class="w-6 h-6" />
    <div
      class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      Monitoring Settings
    </div>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import SequenceImageHistory from '@/components/sequence/SequenceImageHistory.vue';
import SequenzGraph from '@/components/sequence/SequenzGraph.vue';
import MonitorViewSetting from '@/components/sequence/MonitorViewSetting.vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

const showSettingsModal = ref(false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
