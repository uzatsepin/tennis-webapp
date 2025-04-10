<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-5">
      <Icon icon="mdi:account" class="mr-2 text-blue-900" />
      Основна інформація
    </h2>

    <div class="space-y-4">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1"
          >Ім'я</label
        >
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введіть ваше ім'я"
        />
      </div>

      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1"
          >Прізвище</label
        >
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введіть ваше прізвище"
        />
      </div>

      <div>
        <label for="age" class="block text-sm font-medium text-gray-700 mb-1">Вік</label>
        <input
          id="age"
          v-model.number="age"
          type="number"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Введіть ваш вік"
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

const firstName = computed({
  get: () => profileStore.profileData.firstName,
  set: (value) => profileStore.updateProfileField("firstName", value),
});

const lastName = computed({
  get: () => profileStore.profileData.lastName,
  set: (value) => profileStore.updateProfileField("lastName", value),
});

const username = computed({
  get: () => profileStore.profileData.username,
  set: (value) => profileStore.updateProfileField("username", value),
});

const age = computed({
  get: () => profileStore.profileData.age,
  set: (value) => profileStore.updateProfileField("age", value),
});
</script>
