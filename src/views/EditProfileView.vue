<template>
  <div>
    <div class="relative mb-6" style="z-index: 0">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-32 -mx-4 rounded-b-3xl"
      ></div>

      <div class="relative pt-4 px-1 z-10">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center">
            <button
              @click="navigateBack"
              class="mr-3 text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Icon icon="mdi:arrow-left" class="h-6 w-6" />
            </button>
            <div class="text-white">
              <h1 class="text-2xl font-bold">Редагування профілю</h1>
              <p class="text-blue-200 text-sm">Оновіть свою інформацію</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="profileStore.isLoading"
      class="bg-white rounded-xl shadow-sm p-8 flex justify-center"
      style="position: relative; z-index: 10"
    >
      <TennisBallLoader />
    </div>

    <!-- Edit Profile Form -->
    <form
      v-else
      @submit.prevent="handleSubmit"
      class="space-y-5"
      style="position: relative; z-index: 10"
    >
      <BasicInfoForm />
      <TennisInfoForm />
      <PhysicalInfoForm />
      <ProfileActionButtons
        :is-submitting="profileStore.isSubmitting"
        @submit="handleSubmit"
        @cancel="navigateBack"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";
import BasicInfoForm from "@/components/profile/BasicInfoForm.vue";
import TennisInfoForm from "@/components/profile/TennisInfoForm.vue";
import PhysicalInfoForm from "@/components/profile/PhysicalInfoForm.vue";
import ProfileActionButtons from "@/components/profile/ProfileActionButtons.vue";

const router = useRouter();
const profileStore = useProfileStore();

onMounted(async () => {
  await profileStore.initProfileData();

  // Redirect if no user data
  if (!profileStore.profileData.username) {
    navigateBack();
  }
});

const handleSubmit = async () => {
  const success = await profileStore.submitProfile();
  if (success) {
    navigateBack();
  }
};

const navigateBack = () => {
  router.push("/profile");
};
</script>
