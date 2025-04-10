<template>
  <li class="flex items-start py-2 border-b border-gray-100" :class="{ 'border-b-0': isLast }">
    <div class="bg-blue-100 p-2 rounded-lg mr-3">
      <Icon :icon="icon" class="text-blue-900" />
    </div>
    <div class="flex-1">
      <p class="text-sm text-gray-500">{{ title }}</p>
      <p class="font-medium text-gray-900">
        <slot></slot>
      </p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  icon: string;
  title: string;
  isLast?: boolean;
}>();
</script>
