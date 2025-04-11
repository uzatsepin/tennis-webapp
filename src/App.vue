<!-- App.vue -->
<template>
  <div id="app" class="bg-gray-100 min-h-screen overflow-x-hidden">
    <!-- Main Content -->
    <main class="container mx-auto px-4 pb-20">
      <div v-if="loading" class="flex justify-center py-8">
        <TennisBallLoader size="large" />
      </div>
      <div v-else>
        <RouterView />
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav
      class="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 border-t border-gray-200 z-10"
    >
      <div class="grid grid-cols-4 gap-1">
        <RouterLink
          to="/"
          class="flex flex-col items-center py-2 text-sm font-medium transition-colors"
          :class="{
            'text-blue-900': $route.path === '/',
            'text-gray-600': $route.path !== '/',
          }"
        >
          <Icon icon="mdi:home" class="text-xl mb-1" />
          <span>Головна</span>
        </RouterLink>
        <RouterLink
          to="/games"
          class="flex flex-col items-center py-2 text-sm font-medium transition-colors"
          :class="{
            'text-blue-900': $route.path.includes('/games'),
            'text-gray-600': !$route.path.includes('/games'),
          }"
        >
          <Icon icon="mdi:tennis" class="text-xl mb-1" />
          <span>Ігри</span>
        </RouterLink>
        <RouterLink
          to="/rankings"
          class="flex flex-col items-center py-2 text-sm font-medium transition-colors"
          :class="{
            'text-blue-900': $route.path === '/rankings',
            'text-gray-600': $route.path !== '/rankings',
          }"
        >
          <Icon icon="mdi:trophy" class="text-xl mb-1" />
          <span>Рейтинг</span>
        </RouterLink>
        <RouterLink
          to="/profile"
          class="flex flex-col items-center py-2 text-sm font-medium transition-colors"
          :class="{
            'text-blue-900': $route.path.includes('/profile'),
            'text-gray-600': !$route.path.includes('/profile'),
          }"
        >
          <Icon icon="mdi:account" class="text-xl mb-1" />
          <span>Профіль</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/user";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";

const router = useRouter();
const userStore = useUserStore();
const telegramWebApp = ref(null);
const loading = ref(true);

// Function to manually select a user (for non-Telegram environments)
const selectUser = async (userId) => {
  if (!userId) return;

  loading.value = true;
  try {
    const user = await userStore.getUserById(userId);
    if (user) {
      userStore.currentUser.value = user;
    }
  } catch (error) {
    console.error("Error selecting user:", error);
  } finally {
    loading.value = false;
  }
};

// Initialize the app
const init = async () => {
  try {
    // First load all users
    await userStore.loadAllUsers();

    // Check if Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
      telegramWebApp.value = window.Telegram.WebApp;
      telegramWebApp.value.ready();

      // Get user from Telegram data
      if (
        telegramWebApp.value.initDataUnsafe &&
        telegramWebApp.value.initDataUnsafe.user
      ) {
        const telegramId = telegramWebApp.value.initDataUnsafe.user.id.toString();

        // Try to get user from database
        const user = await userStore.getUserById(telegramId);

        // If user not found, register them
        if (!user) {
          const userData = {
            id: telegramId,
            name:
              telegramWebApp.value.initDataUnsafe.user.first_name +
              (telegramWebApp.value.initDataUnsafe.user.last_name
                ? " " + telegramWebApp.value.initDataUnsafe.user.last_name
                : ""),
            username: telegramWebApp.value.initDataUnsafe.user.username || "",
            photo: telegramWebApp.value.initDataUnsafe.user.photo_url,
          };

          await userStore.registerUser(userData);
        }
      }
    } else {
      // For non-Telegram environment, select first user
      if (userStore.allUsers.value.length > 0) {
        await selectUser(userStore.allUsers.value[0].id);
      }
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  init();
});

// Add router navigation guard to reset scroll position
onBeforeMount(() => {
  router.beforeEach((to, from, next) => {
    // Reset scroll position when navigating to a new page
    window.scrollTo(0, 0);
    next();
  });
});
</script>

<style>
body {
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  margin: 0;
  padding: 0;
  color: #111827;
  background-color: #f3f4f6;
  padding-bottom: 4rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden; /* Prevent horizontal scroll */
  touch-action: pan-x pan-y; /* Disable double-tap to zoom */
}

/* Fix for mobile devices - prevent horizontal scroll and disable double-tap zoom */
html,
body {
  overflow-x: hidden;
  position: relative;
  width: 100%;
  scroll-behavior: auto !important;
  touch-action: manipulation; /* Prevents double-tap to zoom on iOS Safari */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* Remove tap highlight on mobile */
}

/* Apply touch-action to all interactive elements to prevent zoom */
button,
a,
input,
select,
textarea,
.interactive {
  touch-action: manipulation;
}

/* Add meta viewport tag programmatically to ensure it's correctly set */
:root {
  --viewport-scale: 1;
}

/* Адаптация для мобильных устройств */
@media (max-width: 640px) {
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .text-xl {
    font-size: 1.1rem;
  }

  .text-2xl {
    font-size: 1.3rem;
  }

  .h-10,
  .w-10 {
    height: 2.25rem;
    width: 2.25rem;
  }

  .h-12,
  .w-12 {
    height: 2.5rem;
    width: 2.5rem;
  }

  .h-16,
  .w-16 {
    height: 3rem;
    width: 3rem;
  }
}

/* Add new styles at the end to ensure they're not overridden */
@media (pointer: coarse) {
  /* Styles specific to touch devices */
  * {
    touch-action: manipulation; /* Apply to all elements on touch devices */
  }

  /* Increase tap target sizes for better usability */
  button,
  a {
    min-height: 40px;
    min-width: 40px;
  }
}
</style>
