<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-5">
      <Icon icon="mdi:calendar-clock" class="mr-2 text-blue-900" />
      Дата та час
    </h2>

    <div class="grid gap-4 mb-2">
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
          Дата гри
        </label>
        <input
          id="date"
          type="date"
          v-model="localDate"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :min="currentDate"
          required
        />
      </div>

      <div>
        <label for="time" class="block text-sm font-medium text-gray-700 mb-2">
          Час гри
        </label>
        <input
          id="time"
          type="time"
          v-model="localTime"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>

    <p class="text-sm text-gray-500 mt-4 flex items-center">
      <Icon icon="mdi:information-outline" class="mr-1 text-blue-900 w-6 h-6" />
      Виберіть час, коли ви зможете зустрітися з суперником для гри
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const props = defineProps<{
  date: string;
  time: string;
  currentDate: string;
}>();

const emit = defineEmits<{
  (e: "update:date", value: string): void;
  (e: "update:time", value: string): void;
}>();

const localDate = computed({
  get: () => props.date,
  set: (value) => emit("update:date", value),
});

const localTime = computed({
  get: () => props.time,
  set: (value) => emit("update:time", value),
});
</script>
