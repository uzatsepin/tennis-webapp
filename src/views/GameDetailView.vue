<template>
  <div>
    <!-- Hero Banner with increased margin to prevent overlap -->
    <div class="relative mb-36">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-32 -mx-4 rounded-b-3xl z-0"
      ></div>

      <div class="relative pt-4 px-1 z-10">
        <div class="flex items-center mb-6">
          <button
            @click="router.back()"
            class="mr-3 text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Icon icon="mdi:arrow-left" class="h-6 w-6" />
          </button>
          <div class="text-white">
            <h1 class="text-2xl font-bold">Деталі гри</h1>
            <p class="text-blue-200 text-sm">
              {{ getSubtitle() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Status Card - Positioned over the banner but below content -->
      <div
        class="bg-white rounded-xl shadow-sm p-6 mx-1 absolute -bottom-28 left-0 right-0 z-20"
      >
        <div class="flex justify-between items-center">
          <span
            class="px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center"
            :class="{
              'bg-green-100 text-green-800': game?.status === GameStatus.COMPLETED,
              'bg-blue-100 text-blue-800': game?.status === GameStatus.SCHEDULED,
              'bg-yellow-100 text-yellow-800': game?.status === GameStatus.PENDING,
              'bg-gray-100 text-gray-800':
                game?.status === GameStatus.CANCELLED ||
                game?.status === GameStatus.REJECTED,
            }"
          >
            <Icon :icon="getStatusIcon(game?.status)" class="mr-2" />
            {{ getStatusText(game?.status) }}
          </span>

          <div v-if="game" class="text-gray-500 flex items-center">
            <Icon icon="mdi:clock" class="mr-1.5" />
            {{ formatDate(game.scheduledTime) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <TennisBallLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-6 text-center">
      <Icon icon="mdi:alert-circle" class="text-5xl text-red-500 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Помилка</h3>
      <p class="text-gray-500 mb-4">{{ error }}</p>
      <button
        @click="router.push('/games')"
        class="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
      >
        <Icon icon="mdi:tennis" class="mr-2" />
        Всі ігри
      </button>
    </div>

    <!-- Game Details -->
    <div v-else-if="game" class="space-y-5">
      <!-- Players Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex flex-col items-center">
            <div
              class="h-20 w-20 rounded-xl bg-blue-100 flex items-center justify-center mb-3"
              :class="{ 'bg-green-100': isWinner(game, game.player1Id) }"
            >
              <span
                :class="[
                  'text-2xl font-bold',
                  isWinner(game, game.player1Id) ? 'text-green-800' : 'text-blue-900',
                ]"
              >
                {{ game.player1Username.charAt(0).toUpperCase() }}
              </span>
            </div>
            <p class="font-medium text-gray-900 mb-1 text-center">
              {{ game.player1Username }}
            </p>
            <p v-if="isCurrentUser(game.player1Id)" class="text-xs text-blue-900">Ви</p>
            <div
              v-if="isWinner(game, game.player1Id)"
              class="mt-2 flex items-center text-green-600"
            >
              <Icon icon="mdi:trophy" class="mr-1" />
              <span class="text-sm font-medium">Переможець</span>
            </div>
          </div>

          <div class="text-center mx-3 py-4 px-1">
            <div v-if="game.status === GameStatus.COMPLETED && game.score" class="mb-2">
              <div class="text-4xl font-bold text-gray-900">
                {{ getScore().player1 }} : {{ getScore().player2 }}
              </div>
              <p class="text-xs text-gray-500 mt-1">Рахунок</p>
            </div>
            <div v-else class="text-gray-500 text-lg font-medium">vs</div>
          </div>

          <div class="flex-1 flex flex-col items-center">
            <div
              class="h-20 w-20 rounded-xl bg-blue-100 flex items-center justify-center mb-3"
              :class="{ 'bg-green-100': isWinner(game, game.player2Id) }"
            >
              <span
                :class="[
                  'text-2xl font-bold',
                  isWinner(game, game.player2Id) ? 'text-green-800' : 'text-blue-900',
                ]"
              >
                {{ game.player2Username.charAt(0).toUpperCase() }}
              </span>
            </div>
            <p class="font-medium text-gray-900 mb-1 text-center">
              {{ game.player2Username }}
            </p>
            <p v-if="isCurrentUser(game.player2Id)" class="text-xs text-blue-900">Ви</p>
            <div
              v-if="isWinner(game, game.player2Id)"
              class="mt-2 flex items-center text-green-600"
            >
              <Icon icon="mdi:trophy" class="mr-1" />
              <span class="text-sm font-medium">Переможець</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Card (for pending/scheduled games) -->
      <div v-if="showActions" class="bg-white rounded-xl shadow-sm p-5">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
          <Icon icon="mdi:hand-pointing-right" class="mr-2 text-blue-900" />
          Дії
        </h3>

        <div v-if="game.status === GameStatus.PENDING && isOpponent" class="space-y-3">
          <p class="text-gray-700 text-sm mb-4">
            Вас запросили на гру. Підтвердіть або відхиліть запрошення:
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="confirmGame"
              class="py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
            >
              <Icon icon="mdi:check" class="mr-2" />
              Підтвердити
            </button>
            <button
              @click="rejectGame"
              class="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Icon icon="mdi:close" class="mr-2" />
              Відхилити
            </button>
          </div>
        </div>

        <div v-else-if="canRecordResult" class="text-center">
          <p class="text-gray-700 mb-4">Гра вже відбулась? Запишіть її результат:</p>
          <button
            @click="navigateToGameResult"
            class="w-full py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center"
          >
            <Icon icon="mdi:trophy" class="mr-2" />
            Записати результат
          </button>
        </div>

        <div v-else-if="game.status === GameStatus.SCHEDULED" class="text-center">
          <p class="text-gray-700 mb-2">Гра підтверджена</p>
          <p class="text-sm text-gray-500">
            Після завершення гри, не забудьте записати результат
          </p>
        </div>
      </div>

      <!-- Game Info Card -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
          <Icon icon="mdi:information" class="mr-2 text-blue-900" />
          Інформація
        </h3>

        <ul class="space-y-3">
          <li class="flex items-start py-2 border-b border-gray-100">
            <div class="bg-blue-100 p-2 rounded-lg mr-3">
              <Icon icon="mdi:calendar" class="text-blue-900" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Дата та час</p>
              <p class="font-medium text-gray-900">
                {{ formatDate(game.scheduledTime, true) }}
              </p>
            </div>
          </li>

          <li class="flex items-start py-2 border-b border-gray-100">
            <div class="bg-blue-100 p-2 rounded-lg mr-3">
              <Icon icon="mdi:account-multiple" class="text-blue-900" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Гравці</p>
              <p class="font-medium text-gray-900">
                {{ game.player1Username }} vs {{ game.player2Username }}
              </p>
            </div>
          </li>

          <li class="flex items-start py-2 border-b border-gray-100">
            <div class="bg-blue-100 p-2 rounded-lg mr-3">
              <Icon icon="mdi:flag" class="text-blue-900" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Статус</p>
              <p class="font-medium text-gray-900">{{ getStatusText(game.status) }}</p>
            </div>
          </li>

          <li
            v-if="game.status === GameStatus.COMPLETED"
            class="flex items-start py-2 border-b border-gray-100"
          >
            <div class="bg-blue-100 p-2 rounded-lg mr-3">
              <Icon icon="mdi:trophy" class="text-blue-900" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Переможець</p>
              <p class="font-medium text-gray-900">
                {{
                  game.winnerId === game.player1Id
                    ? game.player1Username
                    : game.player2Username
                }}
              </p>
            </div>
          </li>

          <li
            v-if="game.status === GameStatus.COMPLETED && game.score"
            class="flex items-start py-2"
          >
            <div class="bg-blue-100 p-2 rounded-lg mr-3">
              <Icon icon="mdi:scoreboard" class="text-blue-900" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Рахунок</p>
              <p class="font-medium text-gray-900">{{ game.score }}</p>
            </div>
          </li>

          <li class="flex items-start py-2">
            <div class="bg-blue-100 p-2 rounded-lg mr-3">
              <Icon icon="mdi:clock-time-four" class="text-blue-900" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500">Створено</p>
              <p class="font-medium text-gray-900">{{ formatDate(game.createdAt) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";
import { GameStatus } from "@/services/api";

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

const game = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Get current user
const currentUser = computed(() => userStore.currentUser);

// Determine if the current user is one of the players
const isPlayer = computed(() => {
  if (!game.value || !currentUser.value) return false;
  return (
    game.value.player1Id === currentUser.value.id ||
    game.value.player2Id === currentUser.value.id
  );
});

// Check if user is the opponent (for pending games)
const isOpponent = computed(() => {
  if (!game.value || !currentUser.value) return false;

  return (
    game.value.status === GameStatus.PENDING &&
    ((game.value.player2Id === currentUser.value.id &&
      game.value.createdBy === game.value.player1Id) ||
      (game.value.player1Id === currentUser.value.id &&
        game.value.createdBy === game.value.player2Id))
  );
});

// Check if user can record the result
const canRecordResult = computed(() => {
  if (!game.value || !isPlayer.value) return false;

  return (
    game.value.status === GameStatus.PENDING || game.value.status === GameStatus.SCHEDULED
  );
});

// Decide whether to show action buttons
const showActions = computed(() => {
  if (!game.value || !currentUser.value) return false;

  if (isOpponent.value) return true;
  if (canRecordResult.value) return true;
  if (isPlayer.value && game.value.status === GameStatus.SCHEDULED) return true;

  return false;
});

onMounted(async () => {
  isLoading.value = true;
  const gameId = route.params.id as string;

  if (!gameId) {
    error.value = "ID гри не вказано";
    isLoading.value = false;
    return;
  }

  try {
    const gameData = await gameStore.getGameById(gameId);
    if (!gameData) {
      error.value = "Гру не знайдено";
    } else {
      game.value = gameData;
    }
  } catch (err) {
    console.error("Error loading game:", err);
    error.value = "Помилка завантаження деталей гри";
  } finally {
    isLoading.value = false;
  }
});

// Helper functions
const formatDate = (dateString: string | Date | undefined, includeWeekday = false) => {
  if (!dateString) return "—";

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (includeWeekday) {
    options.weekday = "long";
  }

  return date.toLocaleDateString("uk-UA", options);
};

const getSubtitle = () => {
  if (!game.value) return "Інформація про гру";

  if (game.value.status === GameStatus.PENDING) return "Очікує підтвердження";
  if (game.value.status === GameStatus.SCHEDULED) return "Заплановано";
  if (game.value.status === GameStatus.COMPLETED) return "Гра завершена";
  if (game.value.status === GameStatus.CANCELLED) return "Гра скасована";
  if (game.value.status === GameStatus.REJECTED) return "Гра відхилена";

  return "Інформація про гру";
};

const isWinner = (game: any, playerId: string) => {
  return game.status === GameStatus.COMPLETED && game.winnerId === playerId;
};

const isCurrentUser = (playerId: string) => {
  return currentUser.value && String(currentUser.value.id) === playerId;
};

const getStatusText = (status: GameStatus) => {
  switch (status) {
    case GameStatus.PENDING:
      return "очікує підтвердження";
    case GameStatus.SCHEDULED:
      return "заплановано";
    case GameStatus.COMPLETED:
      return "завершено";
    case GameStatus.CANCELLED:
      return "скасовано";
    case GameStatus.REJECTED:
      return "відхилено";
    default:
      return "чернетка";
  }
};

const getStatusIcon = (status: GameStatus) => {
  switch (status) {
    case GameStatus.PENDING:
      return "mdi:clock-outline";
    case GameStatus.SCHEDULED:
      return "mdi:calendar-check";
    case GameStatus.COMPLETED:
      return "mdi:check-circle";
    case GameStatus.CANCELLED:
      return "mdi:cancel";
    case GameStatus.REJECTED:
      return "mdi:close-circle";
    default:
      return "mdi:file-document-outline";
  }
};

const getScore = () => {
  if (!game.value || !game.value.score) {
    return { player1: "0", player2: "0" };
  }

  const [score1, score2] = game.value.score.split(":");
  return {
    player1: score1.trim(),
    player2: score2.trim(),
  };
};

// Action functions
const navigateToGameResult = () => {
  router.push(`/games/${game.value._id}/result`);
};

const confirmGame = async () => {
  if (!game.value) return;

  try {
    isLoading.value = true;
    await gameStore.confirmGame(game.value._id);

    // Reload game data to get updated status
    game.value = await gameStore.getGameById(game.value._id);
  } catch (err) {
    console.error("Error confirming game:", err);
    error.value = "Помилка підтвердження гри";
  } finally {
    isLoading.value = false;
  }
};

const rejectGame = async () => {
  if (!game.value) return;

  try {
    isLoading.value = true;
    await gameStore.rejectGame(game.value._id);

    // Reload game data to get updated status
    game.value = await gameStore.getGameById(game.value._id);
  } catch (err) {
    console.error("Error rejecting game:", err);
    error.value = "Помилка відхилення гри";
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
