<template>
  <div class="bg-white rounded-xl shadow-sm p-6 mb-5">
    <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Icon icon="mdi:account-multiple" class="mr-2 text-blue-900" />
      Гравці
    </h2>

    <!-- Current User Selection -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Ви</label>
      <div class="flex items-center bg-blue-50 p-3 rounded-lg">
        <div
          class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-800 font-medium"
        >
          {{ currentUser?.username.charAt(0).toUpperCase() || "?" }}
        </div>
        <div>
          <p class="font-medium text-gray-900">{{ currentUser?.username || "Ви" }}</p>
          <p v-if="currentUser?.points" class="text-xs text-gray-500">
            Рейтинг: {{ currentUser.points }}
          </p>
        </div>
        <div class="ml-auto px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">
          Ви
        </div>
      </div>
    </div>

    <!-- Opponent Search -->
    <PlayerSearch
      :searchQuery="searchQuery"
      :showDropdown="showUserDropdown"
      :filteredUsers="filteredUsers"
      :selectedUserId="selectedUserId"
      @update:searchQuery="$emit('update:searchQuery', $event)"
      @update:showDropdown="$emit('update:showDropdown', $event)"
    />

    <!-- Selected Opponent Display -->
    <div v-if="selectedOpponent" class="mt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Обраний суперник
      </label>
      <div
        class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
      >
        <div class="flex items-center">
          <div
            class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-800 font-medium"
          >
            {{ selectedOpponent.username?.charAt(0).toUpperCase() || "?" }}
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ selectedOpponent.username }}</p>
            <p class="text-xs text-gray-500">
              Рейтинг: {{ selectedOpponent.rating || "1000" }}
            </p>
          </div>
        </div>
        <button
          @click="gameStore.clearOpponent"
          class="ml-2 text-gray-500 hover:text-red-500"
          aria-label="Remove opponent"
        >
          <Icon icon="mdi:close-circle" class="text-xl" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import PlayerSearch from "./PlayerSearch.vue";
import type { User } from "@/services/api";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();

const props = defineProps<{
  showUserDropdown: boolean;
  currentUser: User | null;
  filteredUsers: User[];
  selectedOpponent: User | null;
  selectedUserId: string;
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:showDropdown", value: boolean): void;
  (e: "select-opponent", opponent: User): void;
  (e: "clear-opponent"): void;
}>();
</script>
