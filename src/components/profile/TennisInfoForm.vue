<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-5">
      <Icon icon="mdi:tennis" class="mr-2 text-blue-900" />
      Тенісна інформація
    </h2>

    <div class="space-y-4">
      <div>
        <label for="forehand" class="block text-sm font-medium text-gray-700 mb-1"
          >Робоча рука</label
        >
        <select
          id="forehand"
          v-model="forehand"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Виберіть робочу руку</option>
          <option
            v-for="option in forehandOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useProfileStore } from "../../stores/profile";

const profileStore = useProfileStore();

const forehand = computed({
  get: () => profileStore.profileData.forehand,
  set: (value) => profileStore.updateProfileField("forehand", value),
});

const forehandOptions = [
  { value: "left", label: "Ліва" },
  { value: "right", label: "Права" },
];
</script>
