<template>
  <span
    class="px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center"
    :class="statusClass"
  >
    <Icon :icon="statusIcon" class="mr-2" />
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { GameStatus } from "@/services/api";

const props = defineProps<{
  status: GameStatus;
}>();

const statusClass = computed(() => {
  switch (props.status) {
    case GameStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case GameStatus.SCHEDULED:
      return "bg-blue-100 text-blue-800";
    case GameStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case GameStatus.CANCELLED:
    case GameStatus.REJECTED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});

const statusText = computed(() => {
  switch (props.status) {
    case GameStatus.PENDING:
      return "очікує";
    case GameStatus.SCHEDULED:
      return "заплановано";
    case GameStatus.COMPLETED:
      return "завершено";
    case GameStatus.CANCELLED:
      return "скасовано";
    case GameStatus.REJECTED:
      return "відхилено";
    default:
      return "чернетка";
  }
});

const statusIcon = computed(() => {
  switch (props.status) {
    case GameStatus.PENDING:
      return "mdi:clock-outline";
    case GameStatus.SCHEDULED:
      return "mdi:calendar-check";
    case GameStatus.COMPLETED:
      return "mdi:check-circle";
    case GameStatus.CANCELLED:
      return "mdi:cancel";
    case GameStatus.REJECTED:
      return "mdi:close-circle";
    default:
      return "mdi:file-document-outline";
  }
});
</script>
