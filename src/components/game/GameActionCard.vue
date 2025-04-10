<template>
  <div v-if="shouldShowActions" class="bg-white rounded-xl shadow-sm p-5">
    <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
      <Icon icon="mdi:hand-pointing-right" class="mr-2 text-blue-900" />
      Дії
    </h3>

    <div v-if="isPendingForOpponent" class="space-y-3">
      <p class="text-gray-700 text-sm mb-4">
        Вас запросили на гру. Підтвердіть або відхиліть запрошення:
      </p>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="onConfirm"
          class="py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
        >
          <Icon icon="mdi:check" class="mr-2" />
          Підтвердити
        </button>
        <button
          @click="onReject"
          class="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <Icon icon="mdi:close" class="mr-2" />
          Відхилити
        </button>
      </div>
    </div>

    <div v-else-if="canRecordResult" class="text-center">
      <p class="text-gray-700 mb-4">Гра вже відбулась? Запишіть її результат:</p>
      <button
        @click="onRecordResult"
        class="w-full py-3 rounded-lg font-medium flex items-center justify-center"
        :class="[
          canSubmitResult
            ? 'bg-blue-900 text-white hover:bg-blue-800'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed',
        ]"
        :disabled="!canSubmitResult"
      >
        <Icon icon="mdi:trophy" class="mr-2" />
        Записати результат
      </button>
      <p v-if="!canSubmitResult" class="mt-2 text-xs text-orange-500">
        Гра має бути підтверджена для запису результату
      </p>
    </div>

    <div v-else-if="isScheduled" class="text-center">
      <p class="text-gray-700 mb-2">Гра підтверджена</p>
      <p class="text-sm text-gray-500">
        Після завершення гри, не забудьте записати результат
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { GameStatus } from "@/services/api";

const props = defineProps<{
  gameStatus: GameStatus;
  isPlayer: boolean;
  isOpponent: boolean;
  canRecordResult: boolean;
  canSubmitResult: boolean;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "reject"): void;
  (e: "recordResult"): void;
}>();

const shouldShowActions = computed(() => {
  return (
    props.isOpponent ||
    props.canRecordResult ||
    (props.isPlayer && props.gameStatus === GameStatus.SCHEDULED)
  );
});

const isPendingForOpponent = computed(() => {
  return props.gameStatus === GameStatus.PENDING && props.isOpponent;
});

const isScheduled = computed(() => {
  return props.gameStatus === GameStatus.SCHEDULED && props.isPlayer;
});

const onConfirm = () => emit("confirm");
const onReject = () => emit("reject");
const onRecordResult = () => emit("recordResult");
</script>
