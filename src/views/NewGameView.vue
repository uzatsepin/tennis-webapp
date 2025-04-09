<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative mb-6" style="z-index: 0">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-32 -mx-4 rounded-b-3xl"
      ></div>

      <div class="relative pt-4 px-1 z-10">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center">
            <button
              @click="router.back()"
              class="mr-3 text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Icon icon="mdi:arrow-left" class="h-6 w-6" />
            </button>
            <div class="text-white">
              <h1 class="text-2xl font-bold">Запланувати гру</h1>
              <p class="text-blue-200 text-sm">Оберіть суперника та час</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="bg-white rounded-xl shadow-sm p-8 flex justify-center"
      style="position: relative; z-index: 10"
    >
      <TennisBallLoader />
    </div>

    <!-- Error Message -->
    <div
      v-else-if="errorMessage"
      class="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm flex items-center"
      style="position: relative; z-index: 10"
    >
      <Icon icon="mdi:alert-circle" class="mr-2 flex-shrink-0" />
      <span>{{ errorMessage }}</span>
      <button @click="errorMessage = ''" class="ml-auto text-red-700 hover:text-red-800">
        <Icon icon="mdi:close" />
      </button>
    </div>

    <!-- Game Form -->
    <form
      v-else
      @submit.prevent="handleSubmit"
      class="space-y-5"
      style="position: relative; z-index: 10"
    >
      <!-- Player Selection -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-5">
          <Icon icon="mdi:account-multiple" class="mr-2 text-blue-900" />
          Гравці
        </h2>

        <!-- Current Player -->
        <div class="flex items-center p-4 bg-blue-50 rounded-lg mb-4">
          <div
            class="h-14 w-14 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold mr-3 text-xl"
          >
            {{ currentUser?.username.charAt(0).toUpperCase() || "В" }}
          </div>
          <div class="flex-grow">
            <p class="font-medium text-gray-900">{{ currentUser?.username || "Ви" }}</p>
            <p class="text-sm text-gray-600">
              Рейтинг:
              <span class="font-medium text-blue-900">{{
                currentUser?.rating || 1000
              }}</span>
            </p>
          </div>
          <div
            class="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
          >
            Ви
          </div>
        </div>

        <div class="flex items-center my-4">
          <div class="flex-grow border-t border-gray-200"></div>
          <div class="mx-4 text-gray-400 flex items-center">
            <Icon icon="mdi:versus" class="mr-1" />
            <span>проти</span>
          </div>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <!-- Opponent Search -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Оберіть суперника
          </label>

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon icon="mdi:magnify" class="text-gray-400" />
            </div>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Пошук гравця за іменем"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @focus="showUserDropdown = true"
              @blur="handleSearchBlur"
            />
          </div>

          <!-- Filtered Users Dropdown -->
          <div
            v-if="showUserDropdown && filteredUsers.length > 0"
            class="mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-y-auto"
          >
            <div class="p-2 border-b border-gray-200 text-xs text-gray-500">
              {{ filteredUsers.length }} гравців знайдено
            </div>
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              @click="selectOpponent(user)"
              class="p-3 flex items-center hover:bg-blue-50 cursor-pointer"
              :class="{ 'bg-blue-50': formData.player2Id === user.id }"
            >
              <div
                class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-800 font-medium"
              >
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-grow">
                <p class="font-medium text-gray-900">{{ user.username }}</p>
                <p class="text-xs text-gray-500">Рейтинг: {{ user.rating || 1000 }}</p>
              </div>
              <Icon
                v-if="formData.player2Id === user.id"
                icon="mdi:check-circle"
                class="text-green-600 ml-2"
              />
            </div>
          </div>

          <div
            v-else-if="showUserDropdown && searchQuery && !filteredUsers.length"
            class="mt-1 p-4 bg-gray-50 rounded-lg text-center text-gray-500"
          >
            Гравців не знайдено
          </div>
        </div>

        <!-- Selected Opponent -->
        <div
          v-if="selectedOpponent"
          class="p-4 bg-blue-50 rounded-lg border border-blue-100"
        >
          <div class="flex items-center">
            <div
              class="h-14 w-14 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold mr-3 text-xl"
            >
              {{ selectedOpponent.username.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-grow">
              <p class="font-medium text-gray-900">{{ selectedOpponent.username }}</p>
              <p class="text-sm text-gray-600">
                Рейтинг:
                <span class="font-medium text-blue-900">{{
                  selectedOpponent.rating || 1000
                }}</span>
              </p>
            </div>
            <button
              type="button"
              @click="clearOpponent"
              class="text-gray-400 hover:text-red-500"
              aria-label="Remove opponent"
            >
              <Icon icon="mdi:close-circle" class="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <!-- Date and Time -->
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
              v-model="formData.date"
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
              v-model="formData.time"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <p class="text-sm text-gray-500 mt-4 flex items-center">
          <Icon icon="mdi:information-outline" class="mr-1 text-blue-900" />
          Виберіть час, коли ви зможете зустрітися з суперником для гри
        </p>
      </div>

      <!-- Game Preview -->
      <div v-if="formData.player2Id" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-4">
          <Icon icon="mdi:eye" class="mr-2 text-blue-900" />
          Попередній перегляд гри
        </h2>

        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="text-center">
              <div
                class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold mx-auto mb-2"
              >
                <span class="text-blue-900 font-bold">
                  {{ currentUser?.username.charAt(0).toUpperCase() }}
                </span>
              </div>
              <p class="font-medium text-gray-900">
                {{ truncateText(currentUser?.username, 12) }}
              </p>
            </div>

            <div class="text-gray-500 font-medium">vs</div>

            <div class="text-center">
              <div
                class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold mx-auto mb-2"
              >
                <span class="text-blue-900 font-bold">
                  {{ selectedOpponent?.username.charAt(0).toUpperCase() }}
                </span>
              </div>
              <p class="font-medium text-gray-900">
                {{ truncateText(selectedOpponent?.username, 12) }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-center mt-4 text-sm text-gray-600">
            <Icon icon="mdi:calendar" class="mr-1" />
            <span>{{ formatDateTime(getFullScheduledTime()) }}</span>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="sticky bottom-20 bg-white rounded-xl shadow-lg p-4">
        <button
          type="submit"
          class="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
          :disabled="!formData.player2Id || !formData.date || !formData.time"
          :class="{
            'opacity-50 cursor-not-allowed':
              !formData.player2Id || !formData.date || !formData.time,
          }"
        >
          <Icon icon="mdi:tennis" class="mr-2" />
          Запланувати гру
        </button>

        <p v-if="!formData.player2Id" class="text-center text-sm text-gray-500 mt-2">
          Спочатку виберіть суперника
        </p>
        <p
          v-else-if="!formData.date || !formData.time"
          class="text-center text-sm text-gray-500 mt-2"
        >
          Виберіть дату та час
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";

interface User {
  id: string | number;
  username: string;
  name?: string;
  rating?: number;
  photo?: string;
  gamesPlayed?: number;
  gamesWon?: number;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const gameStore = useGameStore();

const allUsers = ref<User[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");
const searchQuery = ref("");
const showUserDropdown = ref(false);
const selectedOpponent = ref<User | null>(null);

// Form data with separate date and time fields for better UX
const formData = ref({
  date: new Date().toISOString().split("T")[0], // format: YYYY-MM-DD
  time: new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }), // format: HH:MM
  player2Id: "",
});

// Get current date in YYYY-MM-DD format for min attribute
const currentDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const currentUser = computed(() => userStore.currentUser);

// Filter users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return allUsers.value
      .filter((user) => user.id !== currentUser.value?.id)
      .sort((a, b) => (b.rating || 1000) - (a.rating || 1000))
      .slice(0, 100);
  }

  const query = searchQuery.value.toLowerCase();
  return allUsers.value
    .filter(
      (user) =>
        user.id !== currentUser.value?.id && user.username.toLowerCase().includes(query)
    )
    .sort((a, b) => (b.rating || 1000) - (a.rating || 1000))
    .slice(0, 100);
});

// Load opponent from query parameter if provided
onMounted(async () => {
  isLoading.value = true;
  try {
    // Load all users
    await userStore.loadAllUsers();
    allUsers.value = userStore.allUsers;

    // Check if opponent ID was provided in the query
    const opponentId = route.query.opponent as string;
    if (opponentId) {
      const opponent = allUsers.value.find((user) => user.id === opponentId);
      if (opponent) {
        selectOpponent(opponent);
      }
    }
  } catch (error) {
    console.error("Error loading users:", error);
    errorMessage.value = "Помилка завантаження користувачів";
  } finally {
    isLoading.value = false;
  }
});

// Select opponent
const selectOpponent = (user: User) => {
  formData.value.player2Id = String(user.id);
  selectedOpponent.value = user;
  searchQuery.value = user.username;
  showUserDropdown.value = false;
};

// Clear opponent selection
const clearOpponent = () => {
  formData.value.player2Id = "";
  selectedOpponent.value = null;
  searchQuery.value = "";
};

// Get full scheduled time by combining date and time
const getFullScheduledTime = () => {
  if (!formData.value.date || !formData.value.time) return null;
  return `${formData.value.date}T${formData.value.time}:00`;
};

// Format date and time for display
const formatDateTime = (dateTimeString: string | null): string => {
  if (!dateTimeString) return "—";

  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Truncate text for display
const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Validate form before submission
const validateForm = () => {
  if (!formData.value.player2Id) {
    errorMessage.value = "Будь ласка, оберіть суперника";
    return false;
  }

  if (!formData.value.date || !formData.value.time) {
    errorMessage.value = "Будь ласка, оберіть дату та час";
    return false;
  }

  const scheduledTime = getFullScheduledTime();
  if (!scheduledTime) {
    errorMessage.value = "Некоректна дата або час";
    return false;
  }

  const selectedDate = new Date(scheduledTime);
  const now = new Date();
  if (isNaN(selectedDate.getTime()) || selectedDate <= now) {
    errorMessage.value = "Будь ласка, оберіть дату та час у майбутньому";
    return false;
  }

  return true;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  if (!currentUser.value) {
    errorMessage.value = "Ви маєте бути авторизовані, щоб створити гру";
    return;
  }

  isLoading.value = true;

  try {
    const scheduledTime = getFullScheduledTime();
    const gameData = {
      player1Id: currentUser.value.id,
      player2Id: formData.value.player2Id,
      scheduledTime,
    };

    // Send POST request to create a game
    const newGame = await gameStore.createGame(gameData);

    // Navigate to games list or game details
    if (newGame && newGame._id) {
      router.push(`/games/${newGame._id}`);
    } else {
      router.push("/games");
    }
  } catch (error) {
    console.error("Error creating game:", error);
    errorMessage.value = "Не вдалося створити гру. Спробуйте ще раз.";
    isLoading.value = false;
  }
};

// Handle input blur with timeout to allow for clicking dropdown items
const handleSearchBlur = (): void => {
  setTimeout(() => {
    showUserDropdown.value = false;
  }, 200);
};
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}

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
