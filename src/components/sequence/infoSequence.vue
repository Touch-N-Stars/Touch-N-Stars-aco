<template>
  <div class="space-y-6">
    <!-- Sequence Overview Dashboard Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Status Overview Card -->
      <div
        class="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-blue-100">Sequence Status</h3>
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
            <span class="text-gray-300">Total Containers:</span>
            <span class="text-white font-medium">{{ sequenceStore.sequenceInfo.length - 1 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Running:</span>
            <span class="text-blue-400 font-medium">{{ getStatusCount('RUNNING') }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Completed:</span>
            <span class="text-green-400 font-medium">{{ getStatusCount('FINISHED') }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Card -->
      <div
        class="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-purple-100">Progress</h3>
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
            <p class="text-gray-400 text-sm">Overall Progress</p>
          </div>
        </div>
      </div>

      <!-- Current Target Card -->
      <div
        class="bg-gradient-to-br from-green-900/40 to-green-800/40 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-green-100">Current Target</h3>
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
          <p class="text-xl font-bold text-white">{{ getCurrentTarget() || 'No active target' }}</p>
          <p class="text-gray-400 text-sm">{{ getCurrentTargetStatus() }}</p>
        </div>
      </div>
    </div>

    <!-- Global Triggers Card - Enhanced Design -->
    <div
      v-if="globalTriggers.length > 0"
      class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-amber-600/20 to-amber-500/20 px-6 py-4 border-b border-amber-500/20"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="sequenceStore.toggleCollapsedState('GlobalTrigger')"
              class="p-2 rounded-xl hover:bg-amber-500/20 transition-all duration-200 group"
              :title="sequenceStore.isCollapsed('GlobalTrigger') ? 'Expand' : 'Collapse'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:scale-110"
                :class="{ 'rotate-90': sequenceStore.isCollapsed('GlobalTrigger') }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div>
              <h2 class="font-bold text-xl text-amber-100 flex items-center space-x-2">
                <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Global Triggers</span>
              </h2>
              <p class="text-amber-300/80 text-sm">System-wide automation rules</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <div
              class="px-4 py-2 bg-amber-500/20 text-amber-100 font-medium rounded-full text-sm border border-amber-500/30"
            >
              GLOBAL
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!sequenceStore.isCollapsed('GlobalTrigger')"
        class="p-6 transition-all duration-300 ease-in-out"
      >
        <RecursiveItemState
          v-if="sequenceStore.sequenceIsEditable"
          :items="globalTriggers"
          class="space-y-4"
        />
        <RecursiveItemJson
          v-if="!sequenceStore.sequenceIsEditable"
          :items="globalTriggers"
          class="space-y-4"
        />
      </div>
    </div>

    <!-- Main Sequence Containers - Enhanced Card Design -->
    <div class="space-y-6">
      <div
        v-for="(container, containerIndex) in sequenceStore.sequenceInfo.slice(1)"
        :key="containerIndex"
        class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
        :class="{
          'border-blue-500/50 shadow-blue-500/20': container.Status === 'RUNNING',
          'border-green-500/50 shadow-green-500/20': container.Status === 'FINISHED',
          'border-yellow-500/50 shadow-yellow-500/20': container.Status === 'CREATED',
          'border-gray-600/50': !['RUNNING', 'FINISHED', 'CREATED'].includes(container.Status),
        }"
      >
        <!-- Container Header -->
        <div
          class="px-6 py-4 border-b border-gray-700/50"
          :class="{
            'bg-gradient-to-r from-blue-600/10 to-blue-500/10': container.Status === 'RUNNING',
            'bg-gradient-to-r from-green-600/10 to-green-500/10': container.Status === 'FINISHED',
            'bg-gradient-to-r from-yellow-600/10 to-yellow-500/10': container.Status === 'CREATED',
          }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="sequenceStore.toggleCollapsedState(container.Name)"
                class="p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group"
                :title="sequenceStore.isCollapsed(container.Name) ? 'Expand' : 'Collapse'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:scale-110"
                  :class="{ 'rotate-90': sequenceStore.isCollapsed(container.Name) }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div>
                <h2 class="font-bold text-xl text-gray-100 flex items-center space-x-2">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-blue-400 animate-pulse': container.Status === 'RUNNING',
                      'bg-green-400': container.Status === 'FINISHED',
                      'bg-yellow-400': container.Status === 'CREATED',
                      'bg-gray-400': !['RUNNING', 'FINISHED', 'CREATED'].includes(container.Status),
                    }"
                  ></div>
                  <span>{{ container.Name }}</span>
                </h2>
                <p class="text-gray-400 text-sm">{{ getContainerDescription(container.Name) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <!-- Progress indicator for this container -->
              <div v-if="container.Items && container.Items.length" class="text-right">
                <div class="text-xs text-gray-400">
                  {{ getContainerProgress(container) }}% Complete
                </div>
                <div class="w-20 bg-gray-700 rounded-full h-1 mt-1">
                  <div
                    class="h-1 rounded-full transition-all duration-500"
                    :class="
                      statusColor(container.Status)
                        .replace('bg-', 'bg-')
                        .replace(' text-', ' ')
                        .split(' ')[0]
                    "
                    :style="`width: ${getContainerProgress(container)}%`"
                  ></div>
                </div>
              </div>
              <div
                class="px-4 py-2 font-medium rounded-full text-sm border transition-all duration-200"
                :class="statusColor(container.Status) + ' border-current/30'"
              >
                {{ container.Status }}
              </div>
            </div>
          </div>
        </div>

        <!-- Container Content -->
        <div
          v-if="!sequenceStore.isCollapsed(container.Name)"
          class="p-6 transition-all duration-300 ease-in-out"
        >
          <div v-if="container.Items && container.Items.length" class="space-y-4">
            <RecursiveItemState
              v-if="sequenceStore.sequenceIsEditable"
              :items="container.Items"
              :containerIndex="containerIndex"
            />
            <RecursiveItemJson
              v-if="!sequenceStore.sequenceIsEditable"
              :items="container.Items"
              :containerIndex="containerIndex"
            />
          </div>
          <div v-else class="text-center py-8">
            <div class="text-gray-500 text-lg">No items in this container</div>
            <p class="text-gray-600 text-sm mt-2">
              This container is empty or has no configured steps
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue';
import { useSequenceStore } from '@/store/sequenceStore';
import RecursiveItemState from '@/components/sequence/RecursiveItemState.vue';
import RecursiveItemJson from '@/components/sequence/RecursiveItemJson.vue';

const sequenceStore = useSequenceStore();

const globalTriggers = computed(() => {
  // Find the first container with GlobalTriggers
  const containerWithTriggers = sequenceStore.sequenceInfo.find(
    (container) => container.GlobalTriggers && container.GlobalTriggers.length
  );
  return containerWithTriggers?.GlobalTriggers || [];
});

function statusColor(status) {
  switch (status) {
    case 'FINISHED':
      return 'bg-green-500 text-green-100';
    case 'RUNNING':
      return 'bg-blue-500 text-blue-100';
    case 'CREATED':
      return 'bg-yellow-500 text-yellow-100';
    case 'SKIPPED':
      return 'bg-gray-500 text-gray-100';
    default:
      return 'bg-gray-600 text-gray-100';
  }
}

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

function getContainerProgress(container) {
  // Use the new container progress calculation
  return calculateContainerProgress(container);
}

function getContainerDescription(name) {
  const descriptions = {
    Start_Container: 'Initialization and setup procedures',
    Targets_Container: 'Imaging targets and exposures',
    End_Container: 'Cleanup and shutdown procedures',
  };
  return descriptions[name] || 'Sequence container';
}

onBeforeMount(async () => {
  await sequenceStore.getSequenceInfo();

  if (sequenceStore.sequenceInfo) {
    console.log('info', sequenceStore.sequenceInfo);
  }
});
</script>

<style scoped></style>
