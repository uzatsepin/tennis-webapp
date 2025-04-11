<template>
  <div class="date-range-picker">
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <!-- From date -->
      <div class="flex flex-col flex-1">
        <label class="text-sm text-gray-600 mb-1">Від</label>
        <div class="relative">
          <input
            type="date"
            v-model="fromDateLocal"
            class="w-full rounded-lg border border-gray-300 p-2 pr-8 text-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            v-if="fromDateLocal"
            @click="clearFromDate"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>
      </div>

      <!-- To date -->
      <div class="flex flex-col flex-1">
        <label class="text-sm text-gray-600 mb-1">До</label>
        <div class="relative">
          <input
            type="date"
            v-model="toDateLocal"
            :min="fromDateLocal"
            class="w-full rounded-lg border border-gray-300 p-2 pr-8 text-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            v-if="toDateLocal"
            @click="clearToDate"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>
      </div>
    </div>

    <!-- Quick date filters -->
    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="preset in datePresets"
        :key="preset.label"
        @click="applyPreset(preset.value)"
        class="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
        :class="{'bg-blue-100 text-blue-800': isPresetActive(preset.value)}"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  fromDate: string | null;
  toDate: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:fromDate', value: string | null): void;
  (e: 'update:toDate', value: string | null): void;
}>();

// Local state for the dates
const fromDateLocal = ref(props.fromDate || '');
const toDateLocal = ref(props.toDate || '');

// Emit events when local values change
watch(fromDateLocal, (newValue) => {
  emit('update:fromDate', newValue || null);
});

watch(toDateLocal, (newValue) => {
  emit('update:toDate', newValue || null);
});

// Helper functions to clear dates
const clearFromDate = () => {
  fromDateLocal.value = '';
};

const clearToDate = () => {
  toDateLocal.value = '';
};

// Date presets
const datePresets = [
  { label: 'Цей тиждень', value: 'current-week' },
  { label: 'Минулий тиждень', value: 'last-week' },
  { label: 'Цей місяць', value: 'current-month' },
  { label: 'Минулий місяць', value: 'last-month' },
  { label: 'Цей рік', value: 'current-year' },
];

// Check if a preset is active
const isPresetActive = (presetValue: string): boolean => {
  // Implementation logic to check if current date range matches a preset
  switch (presetValue) {
    case 'current-week':
      return isCurrentWeekSelected();
    case 'last-week':
      return isLastWeekSelected();
    case 'current-month':
      return isCurrentMonthSelected();
    case 'last-month':
      return isLastMonthSelected();
    case 'current-year':
      return isCurrentYearSelected();
    default:
      return false;
  }
};

// Helper functions for checking if a preset is active
const isCurrentWeekSelected = (): boolean => {
  if (!fromDateLocal.value || !toDateLocal.value) return false;
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);

  const fromDate = new Date(fromDateLocal.value);
  const toDate = new Date(toDateLocal.value);

  return fromDate.getTime() === startOfWeek.getTime() && toDate.getTime() === endOfWeek.getTime();
};

const isLastWeekSelected = (): boolean => {
  if (!fromDateLocal.value || !toDateLocal.value) return false;

  const today = new Date();
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
  lastWeekStart.setHours(0, 0, 0, 0);

  const lastWeekEnd = new Date(today);
  lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
  lastWeekEnd.setHours(23, 59, 59, 999);

  const fromDate = new Date(fromDateLocal.value);
  const toDate = new Date(toDateLocal.value);

  return fromDate.getTime() === lastWeekStart.getTime() && toDate.getTime() === lastWeekEnd.getTime();
};

const isCurrentMonthSelected = (): boolean => {
  if (!fromDateLocal.value || !toDateLocal.value) return false;

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const fromDate = new Date(fromDateLocal.value);
  const toDate = new Date(toDateLocal.value);

  return fromDate.getTime() === startOfMonth.getTime() && toDate.getTime() === endOfMonth.getTime();
};

const isLastMonthSelected = (): boolean => {
  if (!fromDateLocal.value || !toDateLocal.value) return false;

  const today = new Date();
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  endOfLastMonth.setHours(23, 59, 59, 999);

  const fromDate = new Date(fromDateLocal.value);
  const toDate = new Date(toDateLocal.value);

  return fromDate.getTime() === startOfLastMonth.getTime() && toDate.getTime() === endOfLastMonth.getTime();
};

const isCurrentYearSelected = (): boolean => {
  if (!fromDateLocal.value || !toDateLocal.value) return false;

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);

  const fromDate = new Date(fromDateLocal.value);
  const toDate = new Date(toDateLocal.value);

  return fromDate.getTime() === startOfYear.getTime() && toDate.getTime() === endOfYear.getTime();
};

// Apply a preset date range
const applyPreset = (presetValue: string) => {
  const today = new Date();

  switch (presetValue) {
    case 'current-week': {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      fromDateLocal.value = startOfWeek.toISOString().split('T')[0];
      toDateLocal.value = endOfWeek.toISOString().split('T')[0];
      break;
    }
    case 'last-week': {
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
      lastWeekStart.setHours(0, 0, 0, 0);

      const lastWeekEnd = new Date(today);
      lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
      lastWeekEnd.setHours(23, 59, 59, 999);

      fromDateLocal.value = lastWeekStart.toISOString().split('T')[0];
      toDateLocal.value = lastWeekEnd.toISOString().split('T')[0];
      break;
    }
    case 'current-month': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      fromDateLocal.value = startOfMonth.toISOString().split('T')[0];
      toDateLocal.value = endOfMonth.toISOString().split('T')[0];
      break;
    }
    case 'last-month': {
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      fromDateLocal.value = startOfLastMonth.toISOString().split('T')[0];
      toDateLocal.value = endOfLastMonth.toISOString().split('T')[0];
      break;
    }
    case 'current-year': {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);

      fromDateLocal.value = startOfYear.toISOString().split('T')[0];
      toDateLocal.value = endOfYear.toISOString().split('T')[0];
      break;
    }
  }
};
</script>

<style scoped>
/* Mobile-friendly styles */
@media (max-width: 640px) {
  input[type="date"] {
    font-size: 14px;
  }
}

/* Additional styles for native date inputs */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
