<template>
  <div class="relative mb-36">
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-32 -mx-4 rounded-b-3xl z-0"
    ></div>

    <div class="relative pt-4 px-1 z-10">
      <div class="flex items-center mb-6">
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

    <div
      class="bg-white rounded-xl shadow-sm p-6 mx-1 absolute -bottom-28 left-0 right-0 z-20"
    >
      <slot></slot>
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
