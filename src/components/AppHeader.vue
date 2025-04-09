<template>
  <div class="relative mb-6">
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900"
      :class="[minimal ? 'h-24' : 'h-32 sm:h-40', '-mx-4 rounded-b-3xl']"
    ></div>

    <div class="relative pt-4 px-1">
      <!-- Header Row with Back Button and Actions -->
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center">
          <!-- Back button (shown on non-home pages) -->
          <button
            v-if="showBackButton"
            @click="goBack"
            class="mr-3 text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Icon icon="mdi:arrow-left" class="h-6 w-6" />
          </button>

          <!-- Page title -->
          <div class="text-white">
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <p class="text-blue-200 text-sm">{{ subtitle }}</p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-2">
          <slot name="actions"></slot>
        </div>
      </div>

      <!-- Optional tabs -->
      <div v-if="$slots.tabs" class="mb-4">
        <slot name="tabs"></slot>
      </div>

      <!-- Content slot -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    default: "Тенісний Клуб",
  },
  subtitle: {
    type: String,
    default: "",
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
  minimal: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};
</script>
