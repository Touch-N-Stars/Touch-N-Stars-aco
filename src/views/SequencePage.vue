<template>
  <div v-if="!sequenceStore.sequenceIsLoaded" class="pt-2">
    <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
      <p class="text-red-400 font-medium">{{ $t('components.sequence.noSequenceLoaded') }}</p>
    </div>
  </div>
  <div v-else class="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
    <!-- Dashboard Header with Modern Grid Background -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div class="relative z-10 px-6 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Dashboard Title Bar -->
          <div class="mb-8"></div>

          <!-- Control Panel -->
          <div
            class="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
          >
            <controlSequence />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="px-6 pb-8">
      <div class="max-w-7xl mx-auto">
        <transition name="slide-fade">
          <div v-show="currentTab === 'showSequenz'" class="mt-8">
            <infoSequence />
          </div>
        </transition>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <div class="fixed right-6 z-20" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 80px)">
      <div class="flex flex-col space-y-3">
        <FavTargets
          :show-framning="false"
          class="transform transition-all duration-300 hover:scale-105"
        />

        <button
          @click="toggleEdit"
          class="group relative p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          :class="{ 'ring-4 ring-blue-400/50': sequenceStore.sequenceEdit }"
          v-if="sequenceStore.sequenceIsEditable"
        >
          <PencilIcon class="w-6 h-6 text-white" />
          <div
            class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {{ sequenceStore.sequenceEdit ? 'Exit Edit Mode' : 'Enter Edit Mode' }}
          </div>
        </button>
      </div>
    </div>

    <div class="fixed left-6 z-20" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 80px)">
      <infoModal
        :size="'w-8 h-8'"
        :icon-text-colour="'text-white'"
        :message="$t('components.sequence.info_general.message')"
        :link="'https://github.com/Touch-N-Stars/Touch-N-Stars'"
        :linkText="'GitHub'"
      />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import infoSequence from '@/components/sequence/infoSequence.vue';
import infoModal from '@/components/helpers/infoModal.vue';
import controlSequence from '@/components/sequence/controlSequence.vue';
import { useSequenceStore } from '@/store/sequenceStore';
import { ref } from 'vue';
import { PencilIcon } from '@heroicons/vue/24/outline';
import FavTargets from '@/components/favTargets/FavTargets.vue';

const currentTab = ref('showSequenz'); // Standardwert
const sequenceStore = useSequenceStore();

function toggleEdit() {
  sequenceStore.sequenceEdit = !sequenceStore.sequenceEdit;
  if (sequenceStore.sequenceEdit) {
    sequenceStore.stopFetching();
  } else {
    sequenceStore.startFetching();
  }
}
onBeforeUnmount(() => {
  sequenceStore.sequenceEdit = false;
  sequenceStore.startFetching();
});
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.connected-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
}

/* Grid pattern background */
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Enhance existing animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Glassmorphism effect */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
