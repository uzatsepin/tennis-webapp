<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-5">
      <Icon icon="mdi:human" class="mr-2 text-blue-900" />
      Фізичні параметри
    </h2>

    <div class="space-y-4">
      <div>
        <label for="height" class="block text-sm font-medium text-gray-700 mb-1"
          >Зріст (см)</label
        >
        <input
          id="height"
          v-model.number="height"
          type="number"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введіть зріст у сантиметрах"
        />
      </div>

      <div>
        <label for="weight" class="block text-sm font-medium text-gray-700 mb-1"
          >Вага (кг)</label
        >
        <input
          id="weight"
          v-model.number="weight"
          type="number"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введіть вагу у кілограмах"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useProfileStore } from "../../stores/profile";

const profileStore = useProfileStore();

const height = computed({
  get: () => profileStore.profileData.height,
  set: (value) => profileStore.updateProfileField("height", value),
});

const weight = computed({
  get: () => profileStore.profileData.weight,
  set: (value) => profileStore.updateProfileField("weight", value),
});
</script>
