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
          <p class="text-gray-400 text-sm mt-2">
            {{ $t('components.sequence.status.configureMonitoringDisplay') }}
          </p>
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
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Sequence Overview Dashboard Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Status Overview Card -->
        <div
          class="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-blue-100">
              {{ $t('components.sequence.status.sequenceStatus') }}
            </h3>
            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-300">
                {{ $t('components.sequence.status.totalContainers') }}:
              </span>
              <span class="text-white font-medium">
                {{ sequenceStore.sequenceInfo.length - 1 }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">{{ $t('components.sequence.status.running') }}:</span>
              <span class="text-blue-400 font-medium">{{ getStatusCount('RUNNING') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">{{ $t('components.sequence.status.completed') }}:</span>
              <span class="text-green-400 font-medium">{{ getStatusCount('FINISHED') }}</span>
            </div>
          </div>
        </div>

        <!-- Progress Card -->
        <div
          class="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-purple-100">
              {{ $t('components.sequence.status.progress') }}
            </h3>
            <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div class="space-y-3">
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
                :style="`width: ${getOverallProgress()}%`"
              ></div>
            </div>
            <div class="text-center">
              <span class="text-2xl font-bold text-white">{{ getOverallProgress() }}%</span>
              <p class="text-gray-400 text-sm">
                {{ $t('components.sequence.status.overallProgress') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Current Target Card -->
        <div
          class="bg-gradient-to-br from-green-900/40 to-green-800/40 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-green-100">
              {{ $t('components.sequence.status.currentTarget') }}
            </h3>
            <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-xl font-bold text-white">
              {{ getCurrentTarget() || $t('components.sequence.status.noActiveTarget') }}
            </p>
            <p class="text-gray-400 text-sm">{{ getCurrentTargetStatus() }}</p>
          </div>
        </div>
      </div>

      <!-- Enhanced Monitoring Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Current Sequence Image Card -->
        <div
          class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-100">
              {{ $t('components.sequence.status.currentImage') }}
            </h2>
            <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <LastSequenceImg />
        </div>

        <!-- Image History Card -->
        <div
          class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-100">
              {{ $t('components.sequence.imageHistory') }}
            </h2>
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
import { useSequenceStore } from '@/store/sequenceStore';
import LastSequenceImg from '@/components/sequence/LastSequenceImg.vue';
import SequenceImageHistory from '@/components/sequence/SequenceImageHistory.vue';
import SequenzGraph from '@/components/sequence/SequenzGraph.vue';
import MonitorViewSetting from '@/components/sequence/MonitorViewSetting.vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

const showSettingsModal = ref(false);
const sequenceStore = useSequenceStore();

function getStatusCount(status) {
  let count = 0;
  sequenceStore.sequenceInfo.slice(1).forEach((container) => {
    if (container.Status === status) count++;
    if (container.Items) {
      count += countItemsWithStatus(container.Items, status);
    }
  });
  return count;
}

function countItemsWithStatus(items, status) {
  let count = 0;
  items.forEach((item) => {
    if (item.Status === status) count++;
    if (item.Items) {
      count += countItemsWithStatus(item.Items, status);
    }
  });
  return count;
}

function getOverallProgress() {
  const containers = sequenceStore.sequenceInfo.slice(1);
  if (containers.length === 0) return 0;

  // Filter out disabled containers
  const activeContainers = containers.filter((container) => container.Status !== 'DISABLED');
  if (activeContainers.length === 0) return 0;

  let totalWeight = 0;
  let completedWeight = 0;

  activeContainers.forEach((container) => {
    totalWeight += 1;

    if (container.Status === 'FINISHED') {
      // Finished containers contribute full weight
      completedWeight += 1;
    } else if (container.Status === 'RUNNING') {
      // Running containers contribute partial weight based on sub-items
      if (container.Items && container.Items.length > 0) {
        const containerProgress = calculateContainerProgress(container);
        completedWeight += containerProgress / 100;
      } else {
        // Running container with no sub-items gets 50% weight
        completedWeight += 0.5;
      }
    } else if (container.Status === 'CREATED') {
      // Created containers contribute 0 weight
      completedWeight += 0;
    }
  });

  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
}

function calculateContainerProgress(container) {
  if (container.Status === 'FINISHED') {
    return 100;
  }

  if (container.Status === 'DISABLED') {
    return 0; // Don't count disabled items
  }

  if (!container.Items || container.Items.length === 0) {
    // Leaf item - base on status
    switch (container.Status) {
      case 'FINISHED':
        return 100;
      case 'RUNNING':
        return 50; // Or calculate based on sub-progress
      case 'CREATED':
        return 0;
      default:
        return 0;
    }
  }

  // Container with sub-items - calculate based on sub-item progress
  const { total, completed } = countItemsProgress(container.Items);
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function countItemsProgress(items) {
  let total = 0;
  let completed = 0;

  items.forEach((item) => {
    // Skip disabled items from progress calculation
    if (item.Status === 'DISABLED') return;

    total++;
    if (item.Status === 'FINISHED') {
      completed++;
    } else if (item.Items && item.Items.length > 0) {
      // For containers with sub-items, calculate weighted progress
      const { total: subTotal, completed: subCompleted } = countItemsProgress(item.Items);
      if (subTotal > 0) {
        // Subtract the 1 we added above and add weighted progress
        total--;
        total += subTotal;
        completed += subCompleted;
      }
    }
  });

  return { total, completed };
}

function getCurrentTarget() {
  const containers = sequenceStore.sequenceInfo.slice(1);
  for (const container of containers) {
    if (container.Target && container.Target.TargetName) {
      return container.Target.TargetName;
    }
    if (container.Items) {
      const target = findTargetInItems(container.Items);
      if (target) return target;
    }
  }
  return null;
}

function findTargetInItems(items) {
  for (const item of items) {
    if (item.Target && item.Target.TargetName) {
      return item.Target.TargetName;
    }
    if (item.Items) {
      const target = findTargetInItems(item.Items);
      if (target) return target;
    }
  }
  return null;
}

function getCurrentTargetStatus() {
  const containers = sequenceStore.sequenceInfo.slice(1);
  for (const container of containers) {
    if (container.Status === 'RUNNING' && container.Target) {
      return 'Currently imaging';
    }
    if (container.Items) {
      const status = findRunningTargetStatus(container.Items);
      if (status) return status;
    }
  }
  return 'Waiting to start';
}

function findRunningTargetStatus(items) {
  for (const item of items) {
    if (item.Status === 'RUNNING' && item.Target) {
      return 'Currently imaging';
    }
    if (item.Items) {
      const status = findRunningTargetStatus(item.Items);
      if (status) return status;
    }
  }
  return null;
}
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
