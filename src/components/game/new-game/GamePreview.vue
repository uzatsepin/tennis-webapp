<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-4">
      <Icon icon="mdi:eye" class="mr-2 text-blue-900" />
      Попередній перегляд гри
    </h2>

    <div class="bg-blue-50 p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="text-center">
          <div
            class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold mx-auto mb-2"
          >
            <span class="text-blue-900 font-bold">
              {{ currentUser?.username?.charAt(0).toUpperCase() || "" }}
            </span>
          </div>
          <p class="font-medium text-gray-900">
            {{ truncateText(currentUser?.username, 12) }}
          </p>
        </div>

        <div class="text-gray-500 font-medium">vs</div>

        <div class="text-center">
          <div
            class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold mx-auto mb-2"
          >
            <span class="text-blue-900 font-bold">
              {{ opponent?.username?.charAt(0).toUpperCase() || "" }}
            </span>
          </div>
          <p class="font-medium text-gray-900">
            {{ truncateText(opponent?.username, 12) }}
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center mt-4 text-sm text-gray-600">
        <Icon icon="mdi:calendar" class="mr-1" />
        <span>{{ formattedDateTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface User {
  username?: string;
  [key: string]: any;
}

defineProps<{
  currentUser: User | null;
  opponent: User | null;
  formattedDateTime: string;
}>();

const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
</script>
