<template>
  <div>
    <!-- Hero Banner -->
    <HeroBanner
      title="Запланувати гру"
      subtitle="Оберіть суперника та час"
      @back="router.back()"
    />

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
      <PlayerSelection
        :show-user-dropdown="showUserDropdown"
        :current-user="currentUser"
        :filtered-users="filteredUsers"
        :selected-opponent="selectedOpponent"
        :selected-user-id="formData.player2Id"
        :search-query="searchQuery"
        @update:search-query="searchQuery = $event"
        @update:show-dropdown="showUserDropdown = $event"
      />

      <!-- Date and Time -->
      <DateTimePicker
        v-model:date="formData.date"
        v-model:time="formData.time"
        :current-date="currentDate"
      />

      <!-- Game Preview -->
      <GamePreview
        v-if="formData.player2Id"
        :current-user="currentUser"
        :opponent="selectedOpponent"
        :formatted-date-time="formatDateTime(getFullScheduledTime())"
      />

      <!-- Submit Button -->
      <SubmitButton
        :has-opponent="!!gameStore.selectedOpponent"
        :has-date-time="!!formData.date && !!formData.time"
        button-text="Запланувати гру"
        @submit="handleSubmit"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { Icon } from "@iconify/vue";
import type { User } from "@/services/api";

// Components
import TennisBallLoader from "@/components/TennisBallLoader.vue";
import HeroBanner from "@/components/game/HeroBanner.vue";
import PlayerSelection from "@/components/game/new-game/PlayerSelection.vue";
import DateTimePicker from "@/components/game/new-game/DateTimePicker.vue";
import GamePreview from "@/components/game/new-game/GamePreview.vue";
import SubmitButton from "@/components/game/new-game/SubmitButton.vue";

// Stores and Router
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const gameStore = useGameStore();

// State
const allUsers = ref<User[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");
const searchQuery = ref("");
const showUserDropdown = ref(false);

// Form data with separate date and time fields for better UX
const formData = ref({
  date: new Date().toISOString().split("T")[0], // format: YYYY-MM-DD
  time: new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }), // format: HH:MM
  player2Id: gameStore.selectedOpponent?.telegramId.toString() || "",
});

// Get current date in YYYY-MM-DD format for min attribute
const currentDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

// Get the selected opponent from the game store
const selectedOpponent = computed(() => gameStore.selectedOpponent);

// Map current user to match the User type required by components
const currentUser = computed(() => {
  if (!userStore.currentUser) return null;

  return {
    _id: userStore.currentUser.id.toString(),
    telegramId: Number(userStore.currentUser.id),
    username: userStore.currentUser.username,
    firstName: userStore.currentUser.firstName || userStore.currentUser.username,
    points: userStore.currentUser.rating || 0,
    gamesWon: userStore.currentUser.gamesWon || 0,
    gamesLost: userStore.currentUser.gamesLost || 0,
    gamesPlayed: userStore.currentUser.gamesPlayed || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

// Filter users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return allUsers.value
      .filter((user) => user._id !== currentUser.value?._id)
      .sort((a, b) => (b.points || 1000) - (a.points || 1000))
      .slice(0, 100);
  }

  const query = searchQuery.value.toLowerCase();
  return allUsers.value
    .filter(
      (user) =>
        user._id !== currentUser.value?._id && user.username.toLowerCase().includes(query)
    )
    .sort((a, b) => (b.points || 1000) - (a.points || 1000))
    .slice(0, 100);
});

// Load opponent from query parameter if provided
onMounted(async () => {
  isLoading.value = true;
  try {
    // Clear any previously selected opponent
    gameStore.clearOpponent();

    // Load all users
    await userStore.loadAllUsers();
    allUsers.value = userStore.allUsers.map((user) => ({
      _id: user.id.toString(),
      telegramId: Number(user.id),
      username: user.username,
      firstName: user.firstName || user.username,
      lastName: user.lastName,
      points: user.rating || 0,
      gamesWon: user.gamesWon || 0,
      gamesLost: user.gamesLost || 0,
      gamesPlayed: user.gamesPlayed || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: user.rating,
    }));

    // Check if opponent ID was provided in the query
    const opponentId = route.query.opponent as string;
    if (opponentId) {
      const opponent = allUsers.value.find((user) => user._id === opponentId);
      if (opponent) {
        handleSelectOpponent(opponent);
      }
    }
  } catch (error) {
    console.error("Error loading users:", error);
    errorMessage.value = "Помилка завантаження користувачів";
  } finally {
    isLoading.value = false;
  }
});

// Handle opponent selection using the game store
const handleSelectOpponent = (user: User) => {
  // Use the store function to get the correct ID
  const opponentId = gameStore.selectedOpponent?.telegramId.toString();

  if (opponentId) {
    formData.value.player2Id = opponentId;
    searchQuery.value = user.username;
    showUserDropdown.value = false;

    console.log("Selected opponent:", user);
    console.log("Opponent ID set to:", formData.value.player2Id);
  } else {
    console.error("Failed to get valid ID from opponent");
    errorMessage.value = "Помилка вибору суперника";
  }
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

// Validate form before submission
const validateForm = () => {
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

    // Ensure we're sending correctly formatted IDs
    const gameData = {
      player1Id: currentUser.value.telegramId,
      player2Id: gameStore.selectedOpponent?.telegramId,
      scheduledTime,
    };

    console.log("Creating game with data:", gameData);

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
</script>
