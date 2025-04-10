<template>
  <div class="flex-1 flex flex-col items-center">
    <div
      class="h-20 w-20 rounded-xl bg-blue-100 flex items-center justify-center mb-3"
      :class="{ 'bg-green-100': isWinner }"
    >
      <span
        :class="['text-2xl font-bold', isWinner ? 'text-green-800' : 'text-blue-900']"
      >
        {{ username.charAt(0).toUpperCase() }}
      </span>
    </div>
    <p class="font-medium text-gray-900 mb-1 text-center">@{{ username }}</p>
    <p class="text-sm text-center">{{ playerName }} {{ playerSurname }}</p>
    <p v-if="isCurrentUser" class="text-xs text-blue-900">Ви</p>
    <div v-if="isWinner" class="mt-2 flex items-center text-green-600">
      <Icon icon="mdi:trophy" class="mr-1" />
      <span class="text-sm font-medium">Переможець</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  username: string;
  isWinner: boolean;
  isCurrentUser: boolean;
  playerName?: string;
  playerSurname?: string;
}>();
</script>
