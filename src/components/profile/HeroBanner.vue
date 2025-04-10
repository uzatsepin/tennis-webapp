<template>
  <div class="relative mb-6" style="z-index: 0">
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-32 -mx-4 rounded-b-3xl"
    ></div>

    <div class="relative pt-4 px-1 z-10">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <button
            @click="onBack"
            class="mr-3 text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Icon icon="mdi:arrow-left" class="h-6 w-6" />
          </button>
          <div class="text-white">
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <p class="text-blue-200 text-sm">{{ subtitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  title: string;
  subtitle: string;
}>();

const emit = defineEmits<{
  (e: "back"): void;
}>();

const onBack = () => emit("back");
</script>
