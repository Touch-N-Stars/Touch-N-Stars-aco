<template>
  <div class="flex items-center">
    <button
      @click="openModal"
      class="group relative p-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <component :is="icon" :class="[size, iconTextColour]" />
      <div
        class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        Information
      </div>
    </button>
  </div>
  <div>
    <!-- Modal Overlay -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div
        class="bg-gray-800 text-white p-4 m-8 rounded-lg max-w-xl max-h-[80vh] min-h-48 overflow-y-auto"
      >
        <div class="flex justify-end items-center">
          <button @click="isModalOpen = false" class="text-white hover:text-gray-300">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div>
          <h2 class="text-xl font-bold mb-4">{{ props.title }}</h2>
          <p>{{ props.message }}</p>
        </div>
        <div class="flex items-center gap-2 mt-4" v-if="link && linkText">
          <GlobeAltIcon class="w-6 h-6" />
          <a :href="link" target="_blank" class="text-cyan-400 hover:underline">
            {{ linkText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { XMarkIcon, InformationCircleIcon, GlobeAltIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  title: { type: String, default: 'Info' },
  message: { type: String, default: '' },
  link: { type: String, default: '' },
  linkText: { type: String, default: '' },
  size: { type: String, default: 'w-6 h-6' },
  iconTextColour: { type: String, default: 'text-blue-500' },
  icon: {
    type: [Object, Function], // Accepts component
    default: InformationCircleIcon,
  },
});

const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}
</script>
<style scoped></style>
