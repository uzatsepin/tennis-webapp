<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative mb-6" style="z-index: 0">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-48 sm:h-56 -mx-4 rounded-b-3xl"
      ></div>

      <div class="relative pt-6 px-1">
        <!-- Header with Back Button and Title -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center">
            <button
              @click="router.back()"
              class="mr-3 text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Icon icon="mdi:arrow-left" class="h-6 w-6" />
            </button>
            <div class="text-white">
              <h1 class="text-2xl font-bold">Запис результату</h1>
              <p class="text-blue-200 text-sm">Фіксація результату матчу</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8" style="z-index: 10">
      <TennisBallLoader />
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="bg-white rounded-xl shadow-sm p-6 text-center"
      style="z-index: 10"
    >
      <Icon icon="mdi:alert-circle" class="text-5xl text-red-500 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Помилка</h3>
      <p class="text-gray-500 mb-4">{{ errorMessage }}</p>
      <button
        @click="router.back()"
        class="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
      >
        <Icon icon="mdi:arrow-left" class="mr-2" />
        Повернутися
      </button>
    </div>

    <!-- Record Result Form -->
    <div v-else-if="game" class="space-y-5" style="z-index: 10; position: relative">
      <!-- Match Info -->
      <div class="bg-white rounded-xl shadow-sm p-6 z-20">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-4">
          <Icon icon="mdi:information" class="mr-2 text-blue-900" />
          Інформація про гру
        </h2>
        <p class="text-sm text-gray-500 mb-5 flex items-center">
          <Icon icon="mdi:calendar" class="mr-1" />
          {{ formatDate(game.scheduledTime) }}
        </p>

        <div class="flex items-center justify-between">
          <div class="text-center">
            <div
              class="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center font-bold mx-auto mb-2"
            >
              <span class="text-blue-900 font-bold text-xl">
                {{ game.player1Username.charAt(0).toUpperCase() }}
              </span>
            </div>
            <p class="font-medium text-gray-900">{{ game.player1Username }}</p>
            <p v-if="isCurrentUser(game.player1Id)" class="text-xs text-blue-900 mt-1">
              Ви
            </p>
          </div>

          <div class="text-gray-400 font-bold">
            <Icon icon="mdi:versus" class="text-2xl" />
          </div>

          <div class="text-center">
            <div
              class="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center font-bold mx-auto mb-2"
            >
              <span class="text-blue-900 font-bold text-xl">
                {{ game.player2Username.charAt(0).toUpperCase() }}
              </span>
            </div>
            <p class="font-medium text-gray-900">{{ game.player2Username }}</p>
            <p v-if="isCurrentUser(game.player2Id)" class="text-xs text-blue-900 mt-1">
              Ви
            </p>
          </div>
        </div>
      </div>

      <!-- Enter Score -->
      <div class="bg-white rounded-xl shadow-sm p-6 z-20">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-4">
          <Icon icon="mdi:scoreboard" class="mr-2 text-blue-900" />
          Введіть рахунок
        </h2>

        <div class="flex items-center justify-between">
          <div class="text-center flex-1">
            <p class="font-medium text-gray-700 mb-3">{{ game.player1Username }}</p>

            <div class="flex items-center justify-center">
              <button
                @click="decrementScore(1)"
                class="bg-gray-100 rounded-l-lg w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Icon icon="mdi:minus" class="text-xl" />
              </button>
              <div
                class="w-16 h-12 flex items-center justify-center text-3xl font-bold text-blue-900 bg-blue-50"
              >
                {{ formData.scorePlayer1 }}
              </div>
              <button
                @click="incrementScore(1)"
                class="bg-gray-100 rounded-r-lg w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Icon icon="mdi:plus" class="text-xl" />
              </button>
            </div>
          </div>

          <div class="text-center px-4">
            <p class="font-medium text-gray-500 mb-3">проти</p>
          </div>

          <div class="text-center flex-1">
            <p class="font-medium text-gray-700 mb-3">{{ game.player2Username }}</p>

            <div class="flex items-center justify-center">
              <button
                @click="decrementScore(2)"
                class="bg-gray-100 rounded-l-lg w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Icon icon="mdi:minus" class="text-xl" />
              </button>
              <div
                class="w-16 h-12 flex items-center justify-center text-3xl font-bold text-blue-900 bg-blue-50"
              >
                {{ formData.scorePlayer2 }}
              </div>
              <button
                @click="incrementScore(2)"
                class="bg-gray-100 rounded-r-lg w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Icon icon="mdi:plus" class="text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-5 text-center bg-blue-50 p-3 rounded-lg">
          <p class="text-gray-700 text-sm flex items-center justify-center">
            <Icon icon="mdi:information-outline" class="mr-1 text-blue-900" />
            Гравець з вищим рахунком буде відзначено переможцем
          </p>
          <p
            v-if="formData.scorePlayer1 === formData.scorePlayer2"
            class="mt-2 text-xs text-red-600 font-medium"
          >
            Нічия неможлива у тенісі. Остаточний рахунок повинен визначати переможця.
          </p>
        </div>
      </div>

      <!-- Winner Preview -->
      <div
        v-if="formData.scorePlayer1 !== formData.scorePlayer2"
        class="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 class="text-lg font-semibold text-gray-900 flex items-center mb-4">
          <Icon icon="mdi:trophy" class="mr-2 text-blue-900" />
          Переможець
        </h2>

        <div class="flex items-center justify-center">
          <div class="text-center">
            <div
              class="h-20 w-20 rounded-xl bg-green-100 flex items-center justify-center font-bold mx-auto mb-2"
            >
              <span class="text-green-800 font-bold text-2xl">
                {{ getWinner().charAt(0).toUpperCase() }}
              </span>
            </div>
            <p class="font-medium text-gray-900">{{ getWinner() }}</p>
            <p
              class="mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs inline-block"
            >
              Переможець
            </p>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="sticky bottom-20 bg-white rounded-xl shadow-lg p-4">
        <button
          @click="handleSubmit"
          class="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
          :disabled="formData.scorePlayer1 === formData.scorePlayer2"
          :class="{
            'opacity-50 cursor-not-allowed':
              formData.scorePlayer1 === formData.scorePlayer2,
          }"
        >
          <Icon icon="mdi:check-circle" class="mr-2" />
          Зберегти результат
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";
import { GameStatus, type Game } from "@/services/api";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";

interface FormData {
  scorePlayer1: number;
  scorePlayer2: number;
}

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

const game = ref<Game | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");
const formData = ref<FormData>({
  scorePlayer1: 0,
  scorePlayer2: 0,
});

const currentUser = computed(() => userStore.currentUser);

onMounted(async () => {
  isLoading.value = true;
  const gameId = route.params.id as string;

  try {
    const gameData = await gameStore.getGameById(gameId);
    game.value = gameData;

    if (!gameData) {
      errorMessage.value = "Гра не знайдена";
    } else if (gameData.status === GameStatus.COMPLETED) {
      errorMessage.value = "Результат цієї гри вже записаний";
    } else if (
      gameData.status === GameStatus.CANCELLED ||
      gameData.status === GameStatus.REJECTED
    ) {
      errorMessage.value = "Ця гра скасована або відхилена";
    } else if (
      currentUser.value &&
      gameData.player1Id !== currentUser.value.id &&
      gameData.player2Id !== currentUser.value.id
    ) {
      errorMessage.value = "Ви можете записувати результати тільки своїх ігор";
    }
  } catch (error) {
    console.error("Error loading game:", error);
    errorMessage.value = "Помилка при завантаженні деталей гри";
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isCurrentUser = (playerId: number): boolean => {
  return !!currentUser.value && currentUser.value.id === playerId;
};

const incrementScore = (player: number): void => {
  if (player === 1) {
    formData.value.scorePlayer1++;
  } else {
    formData.value.scorePlayer2++;
  }
};

const decrementScore = (player: number): void => {
  if (player === 1) {
    formData.value.scorePlayer1 = Math.max(0, formData.value.scorePlayer1 - 1);
  } else {
    formData.value.scorePlayer2 = Math.max(0, formData.value.scorePlayer2 - 1);
  }
};

const getWinner = (): string => {
  if (!game.value) return "";

  if (formData.value.scorePlayer1 > formData.value.scorePlayer2) {
    return game.value.player1Username;
  } else {
    return game.value.player2Username;
  }
};

const validateForm = (): boolean => {
  if (formData.value.scorePlayer1 === formData.value.scorePlayer2) {
    errorMessage.value = "Нічия неможлива. Будь ласка, введіть коректний рахунок.";
    return false;
  }
  return true;
};

interface GameResultUpdate {
  winnerId: string;
  score: string;
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm() || !game.value) return;

  isLoading.value = true;

  try {
    const winnerId =
      formData.value.scorePlayer1 > formData.value.scorePlayer2
        ? game.value.player1Id
        : game.value.player2Id;

    const score = `${formData.value.scorePlayer1}:${formData.value.scorePlayer2}`;

    // Create the payload for the API request
    const resultData: GameResultUpdate = {
      winnerId: winnerId.toString(), // Ensure it's a string as shown in the example
      score: score
    };

    // Send PUT request to the correct endpoint
    if (!game.value._id) {
      throw new Error("Game ID is undefined");
    }

    await gameStore.updateGameResult(game.value._id, resultData);

    router.push(`/games/${game.value._id}`);
  } catch (error) {
    console.error("Error recording result:", error);
    errorMessage.value = "Помилка при збереженні результату. Спробуйте ще раз.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Add smooth transitions */
button {
  transition: all 0.2s ease;
}
</style>
