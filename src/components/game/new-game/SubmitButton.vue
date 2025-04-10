<template>
  <div class="sticky bottom-20 bg-white rounded-xl shadow-lg p-4">
    <button
      type="submit"
      class="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
      :disabled="disabled"
      :class="{
        'opacity-50 cursor-not-allowed': disabled,
      }"
    >
      <Icon icon="mdi:tennis" class="mr-2" />
      {{ buttonText }}
    </button>

    <p v-if="!hasOpponent" class="text-center text-sm text-gray-500 mt-2">
      Спочатку виберіть суперника
    </p>
    <p v-else-if="!hasDateTime" class="text-center text-sm text-gray-500 mt-2">
      Виберіть дату та час
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const props = defineProps<{
  hasOpponent: boolean;
  hasDateTime: boolean;
  buttonText?: string;
}>();

const disabled = computed(() => {
  return !props.hasOpponent || !props.hasDateTime;
});

defineEmits<{
  (e: "submit"): void;
}>();
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>
