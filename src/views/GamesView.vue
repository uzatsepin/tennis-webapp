<template>
  <div>
    <!-- AppHeaderSimple with proper spacing and tab positioning -->
    <AppHeader
      title="Тенісні ігри"
      :subtitle="getHeaderSubtitle()"
      :showBackButton="$route.path !== '/games'"
    >
      <!-- Action button in header -->
      <template #actions>
        <button
          @click="navigateToNewGame"
          class="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-md hover:bg-blue-50 transition-colors"
        >
          <Icon icon="mdi:plus" class="mr-2" />
          <span>Нова гра</span>
        </button>
      </template>

      <!-- Tabs in header -->
      <template #tabs>
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto scrollbar-hide -mx-1 px-1">
            <div class="flex min-w-full">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                class="flex-1 min-w-[90px] py-3 px-2 text-center text-sm font-medium whitespace-nowrap transition-all relative"
                :class="[
                  activeTab === tab.id
                    ? 'text-blue-900 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50',
                ]"
              >
                <div class="flex justify-center items-center">
                  <Icon :icon="tab.icon" class="mr-1" />
                  <span class="max-w-[80px] truncate">{{ tab.name }}</span>
                </div>
                <div
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>

    <!-- Content with proper margin to avoid overlap with tabs -->
    <div class="mt-16">
      <!-- Stats Summary (only for my games) -->
      <div
        v-if="activeTab === 'my' && currentUser && !isLoading"
        class="grid grid-cols-3 gap-3 mb-5"
      >
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <p class="text-gray-500 text-xs mb-1">Усього</p>
          <p class="text-xl font-bold">{{ myGamesCount }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <p class="text-gray-500 text-xs mb-1">Перемог</p>
          <p class="text-xl font-bold text-green-600">{{ myWinsCount }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <p class="text-gray-500 text-xs mb-1">Перемог %</p>
          <p class="text-xl font-bold">{{ winPercentage }}%</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-xl shadow-sm p-8 flex justify-center">
        <TennisBallLoader />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredGames.length === 0"
        class="bg-white rounded-xl shadow-sm p-8 text-center"
      >
        <Icon icon="mdi:tennis-ball-off" class="text-5xl text-gray-300 mx-auto mb-3" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">Немає ігор</h3>
        <p class="text-gray-500 mb-5 max-w-md mx-auto">
          {{
            activeTab === "my"
              ? "У вас ще немає запланованих або завершених ігор."
              : "Поки що не знайдено ігор, що відповідають вашим критеріям."
          }}
        </p>
        <button
          @click="navigateToNewGame"
          class="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          <Icon icon="mdi:plus" class="mr-2" />
          Запланувати гру
        </button>
      </div>

      <!-- Game List -->
      <div v-else class="space-y-4">
        <div
          v-for="game in filteredGames"
          :key="game._id"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          @click="game._id && navigateToGameDetails(game._id)"
        >
          <div
            class="border-b border-gray-100 px-4 py-3 flex justify-between items-center"
          >
            <span
              class="px-3 py-1 rounded-full text-xs font-medium flex items-center"
              :class="{
                'bg-green-100 text-green-800': game.status === GameStatus.COMPLETED,
                'bg-blue-100 text-blue-800': game.status === GameStatus.SCHEDULED,
                'bg-yellow-100 text-yellow-800': game.status === GameStatus.PENDING,
                'bg-gray-100 text-gray-800':
                  game.status === GameStatus.CANCELLED ||
                  game.status === GameStatus.REJECTED,
              }"
            >
              <Icon :icon="getStatusIcon(game.status)" class="mr-1" />
              {{ getStatusText(game.status) }}
            </span>
            <div class="text-sm text-gray-500 flex items-center">
              <Icon icon="mdi:calendar" class="mr-1" />
              {{ formatDate(game.scheduledTime) }}
            </div>
          </div>

          <div class="p-4">
            <div class="flex items-center justify-between">
              <div
                class="flex-1 flex flex-col items-center p-3 rounded-lg"
                :class="{ 'bg-green-50': isWinner(game, game.player1Id) }"
              >
                <div
                  class="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-2"
                >
                  <span class="text-blue-900 font-bold text-lg">
                    {{ getPlayerName(game, true).charAt(0).toUpperCase() }}
                  </span>
                </div>
                <p class="font-medium text-gray-900 mb-1 text-center">
                  {{ getPlayerName(game, true) }}
                </p>
                <p
                  v-if="game.status === GameStatus.COMPLETED && game.score"
                  class="text-2xl font-bold"
                  :class="{
                    'text-green-600': isWinner(game, game.player1Id),
                    'text-gray-500': !isWinner(game, game.player1Id),
                  }"
                >
                  {{ getScore(game).player1 }}
                </p>
              </div>

              <div class="flex flex-col items-center mx-2">
                <div class="text-gray-500 mb-1 flex items-center justify-center">
                  <Icon icon="fluent-emoji-high-contrast:vs-button" class="text-2xl" />
                </div>
              </div>

              <div
                class="flex-1 flex flex-col items-center p-3 rounded-lg"
                :class="{ 'bg-green-50': isWinner(game, game.player2Id) }"
              >
                <div
                  class="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-2"
                >
                  <span class="text-blue-900 font-bold text-lg">
                    {{ getPlayerName(game, false).charAt(0).toUpperCase() }}
                  </span>
                </div>
                <p class="font-medium text-gray-900 mb-1 text-center">
                  {{ getPlayerName(game, false) }}
                </p>
                <p
                  v-if="game.status === GameStatus.COMPLETED && game.score"
                  class="text-2xl font-bold"
                  :class="{
                    'text-green-600': isWinner(game, game.player2Id),
                    'text-gray-500': !isWinner(game, game.player2Id),
                  }"
                >
                  {{ getScore(game).player2 }}
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="
              (game.status === GameStatus.PENDING ||
                game.status === GameStatus.SCHEDULED) &&
              currentUser &&
              (game.player1Id === currentUser.id || game.player2Id === currentUser.id)
            "
            class="px-4 py-3 border-t border-gray-100 flex justify-between bg-gray-50"
          >
            <div class="text-gray-500 text-sm flex items-center">
              <Icon icon="mdi:information-outline" class="mr-1" />
              {{
                game.status === GameStatus.PENDING
                  ? "Очікується підтвердження"
                  : "Гра підтверджена"
              }}
            </div>
            <button
              @click.stop="navigateToGameResult(game._id)"
              class="inline-flex items-center px-3 py-1.5 bg-blue-900 text-white text-sm rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Icon icon="mdi:trophy" class="mr-1" />
              Результат
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { GameStatus, type Game } from "@/services/api";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";
import AppHeader from "@/components/AppHeader.vue";

const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

const games = ref<Game[]>([]);
const isLoading = ref(true);
const activeTab = ref("all"); // 'all', 'upcoming', 'past', 'my'

const currentUser = computed(() => userStore.currentUser);

const tabs = [
  { id: "all", name: "Усі ігри", icon: "mdi:tennis" },
  { id: "upcoming", name: "Майбутні", icon: "mdi:calendar-clock" },
  { id: "past", name: "Завершені", icon: "mdi:history" },
  { id: "my", name: "Мої ігри", icon: "mdi:account" },
];

onMounted(async () => {
  isLoading.value = true;
  try {
    await gameStore.loadAllGames();
    games.value = gameStore.games;
  } catch (error) {
    console.error("Помилка завантаження ігор:", error);
  } finally {
    isLoading.value = false;
  }
});

// Header subtitle based on active tab
const getHeaderSubtitle = () => {
  switch (activeTab.value) {
    case "all":
      return "Переглянути всі ігри клубу";
    case "upcoming":
      return "Заплановані та очікувані ігри";
    case "past":
      return "Історія завершених ігор";
    case "my":
      return "Ваші особисті ігри та результати";
    default:
      return "Керуйте своїми іграми та результатами";
  }
};

// Set active tab with smooth animation
const setActiveTab = (tabId:string) => {
  activeTab.value = tabId;
};

const navigateToNewGame = () => {
  router.push("/games/new");
};

const navigateToGameDetails = (gameId: string) => {
  router.push(`/games/${gameId}`);
};

const navigateToGameResult = (gameId: string | undefined) => {
  if (gameId) {
    router.push(`/games/${gameId}/result`);
  }
};

const filteredGames = computed(() => {
  if (activeTab.value === "all") {
    return games.value;
  } else if (activeTab.value === "upcoming") {
    return games.value.filter(
      (game) => game.status === GameStatus.PENDING || game.status === GameStatus.SCHEDULED
    );
  } else if (activeTab.value === "past") {
    return games.value.filter((game) => game.status === GameStatus.COMPLETED);
  } else if (activeTab.value === "my") {
    if (!currentUser.value) return [];
    return games.value.filter(
      (game) =>
        game.player1Id === currentUser.value?.id || game.player2Id === currentUser.value?.id
    );
  }
  return games.value;
});

// Statistics for my games tab
const myGamesCount = computed(() => {
  if (!currentUser.value) return 0;
  return games.value.filter(
    (game) =>
      game.player1Id === currentUser.value?.id || game.player2Id === currentUser.value?.id
  ).length;
});

const myWinsCount = computed(() => {
  if (!currentUser.value) return 0;
  return games.value.filter(
    (game) =>
      game.status === GameStatus.COMPLETED && game.winnerId === currentUser.value?.id
  ).length;
});

const winPercentage = computed(() => {
  if (myGamesCount.value === 0) return 0;
  const completedGames = games.value.filter(
    (game) =>
      game.status === GameStatus.COMPLETED &&
      (game.player1Id === currentUser.value?.id ||
        game.player2Id === currentUser.value?.id)
  ).length;

  if (completedGames === 0) return 0;
  return Math.round((myWinsCount.value / completedGames) * 100);
});

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isWinner = (game: Game, playerId: string | number) => {
  return game.status === GameStatus.COMPLETED && game.winnerId === playerId;
};

const getStatusText = (status:GameStatus) => {
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

const getStatusIcon = (status:GameStatus) => {
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

const getPlayerName = (game:Game, isFirstPlayer:boolean) => {
  return isFirstPlayer ? game.player1Username : game.player2Username;
};

const getScore = (game: Game) => {
  if (!game.score) return { player1: "0", player2: "0" };

  const [score1, score2] = game.score.split(":");
  return { player1: score1.trim(), player2: score2.trim() };
};
</script>

<style scoped>
/* Add smooth transitions */
button {
  transition: all 0.2s ease;
}

/* Add some soft hover effects */
.hover\:shadow-md {
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.hover\:shadow-md:hover {
  transform: translateY(-1px);
}

/* Hide scrollbar but allow scrolling */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
