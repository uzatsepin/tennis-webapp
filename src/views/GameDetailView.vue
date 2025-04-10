<template>
  <div>
    <!-- Hero Banner with Game Status -->
    <GameHeroBanner title="Деталі гри" :subtitle="getSubtitle()" @back="router.back()">
      <div class="flex justify-between items-center">
        <GameStatusBadge v-if="game" :status="game.status" />
        <div v-if="game" class="text-gray-500 flex items-center">
          <Icon icon="mdi:clock" class="mr-1.5" />
          {{ formatDate(game.scheduledTime) }}
        </div>
      </div>
    </GameHeroBanner>

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
        <div class="flex justify-between">
          <GamePlayerCard
            :username="game.player1Username"
            :playerName="game.player1.firstName"
            :playerSurname="game.player1.lastName"
            :is-winner="gameStatus.isWinner(game, game.player1Id)"
            :is-current-user="gameStatus.isCurrentUserPlayer(game.player1Id)"
          />

          <GameScoreDisplay :status="game.status" :score="game.score" />

          <GamePlayerCard
            :username="game.player2Username"
            :playerName="game.player2.firstName"
            :playerSurname="game.player2.lastName"
            :is-winner="gameStatus.isWinner(game, game.player2Id)"
            :is-current-user="gameStatus.isCurrentUserPlayer(game.player2Id)"
          />
        </div>
      </div>

      <!-- Action Card -->
      <GameActionCard
        :game-status="game.status"
        :is-player="gameStatus.isPlayer.value"
        :is-opponent="gameStatus.isOpponent.value"
        :can-record-result="gameStatus.canRecordResult.value"
        :can-submit-result="gameStatus.canSubmitResult.value"
        @confirm="confirmGame"
        @reject="rejectGame"
        @record-result="navigateToGameResult"
      />

      <!-- Game Info Card -->
      <GameInfoCard :game="game" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";
import { Icon } from "@iconify/vue";
import { useGameStatus } from "@/composables/useGameStatus";
import { GameStatus } from "@/services/api";

// Components
import TennisBallLoader from "@/components/TennisBallLoader.vue";
import GameHeroBanner from "@/components/game/GameHeroBanner.vue";
import GameStatusBadge from "@/components/game/GameStatusBadge.vue";
import GamePlayerCard from "@/components/game/GamePlayerCard.vue";
import GameScoreDisplay from "@/components/game/GameScoreDisplay.vue";
import GameActionCard from "@/components/game/GameActionCard.vue";
import GameInfoCard from "@/components/game/GameInfoCard.vue";

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

const game = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Get current user
const currentUser = computed(() => userStore.currentUser);

// Use composable for game status
const gameStatus = useGameStatus(game, currentUser);

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
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "—";

  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSubtitle = () => {
  if (!game.value) return "Інформація про гру";

  switch (game.value.status) {
    case GameStatus.PENDING:
      return "Очікує підтвердження";
    case GameStatus.SCHEDULED:
      return "Заплановано";
    case GameStatus.COMPLETED:
      return "Гра завершена";
    case GameStatus.CANCELLED:
      return "Гра скасована";
    case GameStatus.REJECTED:
      return "Гра відхилена";
    default:
      return "Інформація про гру";
  }
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
