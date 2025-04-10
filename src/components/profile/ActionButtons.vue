<template>
  <div class="sticky bottom-20 bg-white rounded-xl shadow-lg p-4">
    <div class="flex space-x-3">
      <button
        type="button"
        @click="onCancel"
        class="flex-1 py-3 border border-blue-900 text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
      >
        <Icon icon="mdi:close" class="mr-2" />
        Скасувати
      </button>
      <button
        type="submit"
        @click="onSubmit"
        class="flex-1 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
        :disabled="isSubmitting"
      >
        <Icon icon="mdi:check" class="mr-2" />
        {{ isSubmitting ? "Збереження..." : "Зберегти зміни" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "cancel"): void;
}>();

const onSubmit = () => emit("submit");
const onCancel = () => emit("cancel");
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>
