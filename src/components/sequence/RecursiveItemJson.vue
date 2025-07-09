<template>
  <div class="space-y-3 sm:space-y-4">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl overflow-hidden"
      :class="{
        'border-blue-400/60 shadow-blue-500/20 bg-gradient-to-br from-blue-900/20 to-blue-800/20':
          item.Status === 'RUNNING' && !hasRunningChildren(item),
        'border-green-400/60 shadow-green-500/20 bg-gradient-to-br from-green-900/20 to-green-800/20':
          item.Status === 'FINISHED',
        'border-yellow-400/60 shadow-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-yellow-800/20':
          item.Status === 'CREATED',
        'border-gray-600/50 hover:border-gray-500/70': !['RUNNING', 'FINISHED', 'CREATED'].includes(
          item.Status
        ),
      }"
    >
      <!-- Status Indicator Bar -->
      <div
        class="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        :class="{
          'bg-gradient-to-r from-blue-500 to-blue-400': item.Status === 'RUNNING',
          'bg-gradient-to-r from-green-500 to-green-400': item.Status === 'FINISHED',
          'bg-gradient-to-r from-yellow-500 to-yellow-400': item.Status === 'CREATED',
          'bg-gradient-to-r from-gray-500 to-gray-400': ![
            'RUNNING',
            'FINISHED',
            'CREATED',
          ].includes(item.Status),
        }"
      ></div>

      <div class="p-3 sm:p-4 md:p-6">
        <!-- Header Section with improved visual hierarchy -->
        <div
          class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-4 pb-3 border-b border-gray-700/50"
        >
          <div class="flex-1 min-w-0 overflow-hidden">
            <div class="flex items-start space-x-2 sm:space-x-3 min-w-0">
              <!-- Icon based on item type -->
              <div
                class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-blue-500/20 text-blue-400': item.Status === 'RUNNING',
                  'bg-green-500/20 text-green-400': item.Status === 'FINISHED',
                  'bg-yellow-500/20 text-yellow-400': item.Status === 'CREATED',
                  'bg-gray-500/20 text-gray-400': !['RUNNING', 'FINISHED', 'CREATED'].includes(
                    item.Status
                  ),
                }"
              >
                <svg
                  v-if="item.Name && item.Name.includes('Belichtung')"
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else-if="item.Name && item.Name.includes('Filter')"
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else-if="
                    item.Name && (item.Name.includes('Teleskop') || item.Name.includes('Mount'))
                  "
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <h3
                  class="font-semibold text-white text-sm sm:text-base md:text-lg leading-tight break-words"
                >
                  {{ removeSuffix(item.Name) }}
                </h3>
                <p v-if="getItemDescription(item)" class="text-gray-400 text-xs sm:text-sm mt-1">
                  {{ getItemDescription(item) }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-1 sm:space-x-2 mt-2 sm:mt-0 min-w-0">
            <!-- Progress indicator for exposures -->
            <div v-if="item.ExposureCount" class="text-right mr-1 sm:mr-2 flex-shrink-0">
              <div class="text-xs text-gray-400">Exposures</div>
              <div class="text-xs sm:text-sm font-medium text-white">{{ item.ExposureCount }}</div>
            </div>

            <!-- Status badge with improved styling -->
            <span
              v-if="isTopLevel"
              class="inline-flex items-center px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex-shrink-0 whitespace-nowrap"
              :class="statusColorClasses(item.Status)"
            >
              <span
                v-if="item.Status === 'RUNNING'"
                class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-pulse mr-1 sm:mr-2"
              ></span>
              {{ item.Status }}
            </span>
          </div>
        </div>

        <!-- Enhanced Details Grid with better organization -->
        <div v-if="getDisplayFields(item).length > 0" class="mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            <div
              v-for="[key, value] in getDisplayFields(item)"
              :key="key"
              class="bg-gray-800/50 rounded-lg p-2 sm:p-3 border border-gray-700/50"
            >
              <div class="flex flex-col space-y-1">
                <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">{{
                  key
                }}</span>
                <span class="text-xs sm:text-sm text-white break-all">
                  <template v-if="key === 'CalculatedWaitDuration'">
                    <div class="flex items-center space-x-1 sm:space-x-2">
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="font-medium">{{ formatDuration(value) }}</span>
                    </div>
                  </template>
                  <template v-else-if="key === 'TargetTime'">
                    <div class="flex items-center space-x-1 sm:space-x-2">
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="font-medium">{{ formatDateTime(value) }}</span>
                    </div>
                  </template>
                  <template v-else-if="key === 'Coordinates'">
                    <div class="space-y-1 sm:space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="text-blue-300 font-medium text-xs sm:text-sm">RA:</span>
                        <span class="font-mono text-xs sm:text-sm">{{ formatRA(value) }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-blue-300 font-medium text-xs sm:text-sm">Dec:</span>
                        <span class="font-mono text-xs sm:text-sm">{{ formatDec(value) }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="typeof value === 'object'">
                    <div class="space-y-1">
                      <template v-for="[subKey, subValue] in Object.entries(value)" :key="subKey">
                        <div class="flex items-center justify-between">
                          <span class="text-gray-400 text-xs">{{ subKey }}:</span>
                          <span class="text-white text-xs sm:text-sm">{{ subValue }}</span>
                        </div>
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <span class="font-medium">{{ value }}</span>
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Nested Items with improved visual separation -->
        <div v-if="item.Items?.length" class="space-y-3">
          <div class="flex items-center space-x-2 mb-3">
            <div
              class="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"
            ></div>
            <span class="text-xs text-gray-400 font-medium px-2">NESTED ITEMS</span>
            <div
              class="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"
            ></div>
          </div>

          <div class="ml-2 sm:ml-4 border-l border-gray-700/50 pl-2 sm:pl-4 space-y-3">
            <RecursiveItemState
              v-if="sequenceStore.sequenceIsEditable"
              :items="item.Items"
              :isTopLevel="false"
            />
            <RecursiveItemJson
              v-if="!sequenceStore.sequenceIsEditable"
              :items="item.Items"
              :isTopLevel="false"
            />
          </div>
        </div>

        <!-- Enhanced Triggers Section -->
        <div v-if="item.Triggers?.length" class="mt-4 pt-4 border-t border-gray-700/50">
          <h4
            class="text-xs sm:text-sm font-semibold text-amber-300 mb-3 flex items-center space-x-2"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ $t('components.sequence.triggers') }}</span>
          </h4>
          <div class="space-y-2">
            <div
              v-for="(trigger, tIndex) in item.Triggers"
              :key="tIndex"
              class="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg p-2 sm:p-3 border border-amber-600/30"
            >
              <div class="flex items-center justify-between mb-1 sm:mb-2">
                <h5 class="font-medium text-amber-200 text-xs sm:text-sm">{{ trigger.Name }}</h5>
                <span
                  class="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30"
                >
                  {{ trigger.Status }}
                </span>
              </div>
              <div v-if="trigger.AfterExposures" class="text-xs sm:text-sm text-gray-300">
                <span class="text-amber-400">After:</span> {{ trigger.AfterExposures }} exposures
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Conditions Section -->
        <div v-if="item.Conditions?.length" class="mt-4 pt-4 border-t border-gray-700/50">
          <h4
            class="text-xs sm:text-sm font-semibold text-purple-300 mb-3 flex items-center space-x-2"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ $t('components.sequence.conditions') }}</span>
          </h4>
          <div class="space-y-2">
            <div
              v-for="(condition, cIndex) in item.Conditions"
              :key="cIndex"
              class="bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-lg p-2 sm:p-3 border border-purple-600/30"
            >
              <div class="flex items-center justify-between mb-1 sm:mb-2">
                <h5 class="font-medium text-purple-200 text-xs sm:text-sm">{{ condition.Name }}</h5>
                <span
                  class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                >
                  {{ condition.Status }}
                </span>
              </div>
              <div v-if="condition.Iterations" class="text-xs sm:text-sm text-gray-300">
                <span class="text-purple-400">Progress:</span>
                {{ condition.CompletedIterations || 0 }} / {{ condition.Iterations }} iterations
                <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                  <div
                    class="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                    :style="`width: ${((condition.CompletedIterations || 0) / condition.Iterations) * 100}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
import { useSequenceStore } from '@/store/sequenceStore';
import RecursiveItemState from '@/components/sequence/RecursiveItemState.vue';
import RecursiveItemJson from '@/components/sequence/RecursiveItemJson.vue';

defineProps({
  items: {
    type: Array,
    required: true,
  },
  isTopLevel: {
    type: Boolean,
    default: false,
  },
});

const sequenceStore = useSequenceStore();
const excludedKeys = new Set(['Name', 'Status', 'Conditions', 'Triggers', 'Items']);

function statusColorClasses(status) {
  switch (status) {
    case 'FINISHED':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'RUNNING':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'CREATED':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'SKIPPED':
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    default:
      return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
  }
}

function getItemDescription(item) {
  if (item.Name && item.Name.includes('Belichtung')) {
    return `${item.ExposureTime || 0}s exposure, ${item.ExposureCount || 0} images`;
  }
  if (item.Name && item.Name.includes('Filter')) {
    return `Filter: ${item.Filter || 'None'}`;
  }
  if (item.Name && item.Name.includes('Teleskop')) {
    return 'Telescope control action';
  }
  return null;
}

function removeSuffix(name) {
  if (typeof name !== 'string') return '';
  return name.replace(/_Trigger$|_Container$/, '');
}

function formatDuration(durationString) {
  const [h, m, s] = durationString.split('.')[0].split(':');
  return `${h}h ${m}m ${s}s`;
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatRA(coords) {
  const target = coords.Coordinates || coords;
  return (
    target.RAString || `${target.RAHours ?? 0}h ${target.RAMinutes ?? 0}m ${target.RASeconds ?? 0}s`
  );
}

function formatDec(coords) {
  const target = coords.Coordinates || coords;
  const sign = target.NegativeDec ? 'S' : 'N';
  return (
    target.DecString ||
    `${target.DecDegrees ?? 0}° ${target.DecMinutes ?? 0}' ${target.DecSeconds ?? 0}" ${sign}`
  );
}

function getDisplayFields(item) {
  return Object.entries(item).filter(
    ([key]) =>
      !excludedKeys.has(key) && item[key] !== undefined && item[key] !== null && item[key] !== ''
  );
}

function hasRunningChildren(item) {
  return item.Items?.some((child) => child.Status === 'RUNNING' || hasRunningChildren(child));
}
</script>
