<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Оберіть суперника
    </label>

    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon icon="mdi:magnify" class="text-gray-400" />
      </div>
      <input
        type="text"
        v-model="localSearchQuery"
        placeholder="Пошук гравця за іменем"
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @focus="showDropdown = true"
        @blur="handleSearchBlur"
      />
    </div>

    <!-- Filtered Users Dropdown -->
    <div
      v-if="showDropdown && filteredUsers.length > 0"
      class="mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-y-auto"
    >
      <div class="p-2 border-b border-gray-200 text-xs text-gray-500">
        {{ filteredUsers.length }} гравців знайдено
      </div>
      <div
        v-for="user in filteredUsers"
        :key="user._id || user.telegramId"
        @click="gameStore.selectOpponent(user)"
        class="p-3 flex items-center hover:bg-blue-50 cursor-pointer"
        :class="{ 'bg-blue-50': isUserSelected(user) }"
      >
        <div
          class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-800 font-medium"
        >
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-grow">
          <p class="font-medium text-gray-900">{{ user.username }}</p>
          <p class="text-xs text-gray-500">Рейтинг: {{ user?.rating || 1000 }}</p>
        </div>
        <Icon
          v-if="isUserSelected(user)"
          icon="mdi:check-circle"
          class="text-green-600 ml-2"
        />
      </div>
    </div>

    <div
      v-else-if="showDropdown && localSearchQuery && !filteredUsers.length"
      class="mt-1 p-4 bg-gray-50 rounded-lg text-center text-gray-500"
    >
      Гравців не знайдено
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import type { User } from "@/services/api";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();

const props = defineProps<{
  searchQuery: string;
  showDropdown: boolean;
  filteredUsers: User[];
  selectedUserId: string;
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:showDropdown", value: boolean): void;
  (e: "select", user: User): void;
}>();

const localSearchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit("update:searchQuery", value),
});

const showDropdown = computed({
  get: () => props.showDropdown,
  set: (value) => emit("update:showDropdown", value),
});

// Helper method to check if a user is selected - improve to handle both ID types
const isUserSelected = (user: User) => {
  // Check both types of IDs to be safe
  if (user.telegramId && props.selectedUserId === user.telegramId.toString()) {
    return true;
  }

  if (user._id && props.selectedUserId === user._id.toString()) {
    return true;
  }

  return false;
};

const handleSearchBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.max-h-60 {
  scrollbar-width: thin;
}

.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.max-h-60::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}
</style>
