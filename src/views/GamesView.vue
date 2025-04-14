<template>
  <div>
    <!-- AppHeaderSimple with proper spacing and tab positioning -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-48 sm:h-56 -mx-4 rounded-b-3xl"
      ></div>

      <div class="relative pt-4 px-1">
        <!-- Header with Back Button and Title -->
        <div class="flex justify-between items-center mb-6">
          <div class="text-white">
            <h1 class="text-2xl font-bold">Тенісні ігри</h1>
            <p class="text-blue-200 text-sm">{{ getHeaderSubtitle() }}</p>
          </div>
          <button
            @click="navigateToNewGame"
            class="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-md hover:bg-blue-50 transition-colors"
          >
            <Icon icon="mdi:plus" class="mr-2" />
            <span>Нова гра</span>
          </button>
        </div>
      </div>

      <!-- Tabs in header -->
      <div
        class="bg-white rounded-xl shadow-lg mt-4"
        style="position: relative; z-index: 10"
      >
        <div class="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div class="flex min-w-full">
            <button
              v-for="(tab, index) in tabs"
              :key="tab.id"
              @click="setActiveTab(tab.id)"
              class="flex-1 min-w-[90px] py-3 px-2 text-center text-sm font-medium whitespace-nowrap transition-all relative"
              :class="[
                activeTab === tab.id
                  ? 'text-blue-900 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50',
                index === 0 ? 'rounded-l-xl' : '',
                index === tabs.length - 1 ? 'rounded-r-xl' : '',
              ]"
            >
              <div class="flex justify-center items-center">
                <Icon :icon="tab.icon" class="mr-1" />
                <span class="max-w-[70px] truncate">{{ tab.name }}</span>
              </div>
              <div
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content with proper margin to avoid overlap with tabs -->
    <div class="mt-12" style="position: relative; z-index: 10">
      <!-- Filter Button -->
      <div class="mb-4">
        <button
          @click="toggleDateFilter"
          class="w-full bg-white rounded-xl py-3 px-4 shadow-sm flex items-center justify-center text-blue-900 font-medium hover:bg-blue-50 transition-colors"
        >
          <Icon :icon="isFilterOpen ? 'mdi:filter-remove' : 'mdi:filter'" class="mr-2" />
          {{ isFilterOpen ? "Приховати фільтр" : "Фільтр по даті" }}
        </button>
      </div>

      <!-- Date Filter (Animated) -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-10 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-10 opacity-0"
      >
        <div v-if="isFilterOpen" class="mb-5">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-900">Фільтр за датою</h3>
              <button
                v-if="fromDate || toDate"
                @click="clearDateFilter"
                class="text-blue-600 text-sm hover:underline flex items-center"
              >
                <Icon icon="mdi:filter-remove" class="mr-1" />
                Очистити
              </button>
            </div>
            <DateRangePicker v-model:fromDate="fromDate" v-model:toDate="toDate" />
          </div>
        </div>
      </transition>

      <!-- Filter info -->
      <div v-if="(fromDate || toDate) && !isLoading" class="mb-4">
        <div class="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 flex items-center">
          <Icon icon="mdi:filter" class="mr-2" />
          <span>
            Фільтр за періодом:
            <strong>{{ fromDate ? formatFilterDate(fromDate) : "початок" }}</strong> -
            <strong>{{ toDate ? formatFilterDate(toDate) : "кінець" }}</strong>
            <template v-if="totalGamesCount > 0"
              >(знайдено {{ totalGamesCount }} ігор)</template
            >
          </span>
        </div>
      </div>

      <!-- Stats Summary (only for my games) -->
      <div
        v-if="activeTab === 'my' && currentUser && !isLoading"
        class="grid grid-cols-3 gap-3 mb-5"
        style="position: relative; z-index: 10"
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
        v-else-if="games.length === 0 && !isLoading"
        class="bg-white rounded-xl shadow-sm p-8 text-center"
        style="position: relative; z-index: 10"
      >
        <Icon icon="mdi:tennis-ball-off" class="text-5xl text-gray-300 mx-auto mb-3" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">Немає ігор</h3>
        <p class="text-gray-500 mb-5 max-w-md mx-auto">
          {{
            activeTab === "my"
              ? "У вас ще немає запланованих або завершених ігор."
              : fromDate || toDate
              ? "Не знайдено ігор у вибраному діапазоні дат."
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
      <div v-else class="space-y-4 mb-6" style="position: relative; z-index: 10">
        <div
          v-for="game in games"
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

      <!-- Pagination -->
      <div
        v-if="totalPages > 1 && !isLoading"
        class="flex justify-center items-center space-x-1 mt-8 mb-6"
      >
        <button
          @click="changePage(currentPage - 1)"
          :disabled="!hasPrevPage"
          class="px-3 py-1 rounded-md flex items-center justify-center transition-colors"
          :class="
            !hasPrevPage
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-900 hover:bg-blue-50'
          "
        >
          <Icon icon="mdi:chevron-left" />
        </button>

        <button
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          class="px-3 py-1 rounded-md transition-colors min-w-[36px] text-center"
          :class="
            page === currentPage
              ? 'bg-blue-900 text-white font-medium'
              : 'hover:bg-blue-50 text-blue-900'
          "
        >
          {{ page }}
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="!hasNextPage"
          class="px-3 py-1 rounded-md flex items-center justify-center transition-colors"
          :class="
            !hasNextPage
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-900 hover:bg-blue-50'
          "
        >
          <Icon icon="mdi:chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { GameStatus, type Game } from "@/services/api";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";
import DateRangePicker from "@/components/game/DateRangePicker.vue";
import { getStatusText } from "@/utils/utils";

const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

const games = ref<Game[]>([]);
const isLoading = ref(true);
const activeTab = ref("all"); // 'all', 'upcoming', 'past', 'my'
const currentPage = ref(1);
const totalPages = ref(1);
const totalGamesCount = ref(0);
const pageLimit = ref(10); // Games per page
const hasNextPage = ref(false);
const hasPrevPage = ref(false);
const isFilterOpen = ref(false);

// Фильтр по датам
const fromDate = ref<string | null>(null);
const toDate = ref<string | null>(null);

const currentUser = computed(() => userStore.currentUser);

// Переключение состояния фильтра
const toggleDateFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

// Очистка фильтра по датам
const clearDateFilter = () => {
  fromDate.value = null;
  toDate.value = null;
  loadGames(); // Перезагрузка данных без фильтров
};

const tabs = [
  { id: "all", name: "Усі ігри", icon: "mdi:tennis" },
  { id: "upcoming", name: "Майбутні", icon: "mdi:calendar-clock" },
  { id: "past", name: "Завершені", icon: "mdi:history" },
  { id: "my", name: "Мої ігри", icon: "mdi:account" },
];

// Pagination display logic
const displayedPages = computed(() => {
  if (totalPages.value <= 5) {
    // If 5 or fewer pages, show all
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  // Always show current page, 2 before and 2 after if possible
  const pages = [];

  // Start from max(1, currentPage - 2)
  const start = Math.max(1, Math.min(currentPage.value - 2, totalPages.value - 4));

  // Show 5 pages in total
  for (let i = 0; i < 5; i++) {
    if (start + i <= totalPages.value) {
      pages.push(start + i);
    }
  }

  return pages;
});

// Загрузка игр с сервера с новой пагинацией
const loadGames = async () => {
  isLoading.value = true;
  try {
    let params: any = {
      page: currentPage.value,
      limit: pageLimit.value
    };

    // Add status filter based on active tab
    if (activeTab.value === "upcoming") {
      params.status = [GameStatus.PENDING, GameStatus.SCHEDULED].join(',');
    } else if (activeTab.value === "past") {
      params.status = GameStatus.COMPLETED;
    } else if (activeTab.value === "my" && currentUser.value) {
      params.playerId = currentUser.value.id;
    }

    // Add date filters if set
    if (fromDate.value) {
      params.fromDate = fromDate.value;
    }

    if (toDate.value) {
      params.toDate = toDate.value;
    }

    const result = await gameStore.loadPaginatedGames(params);

    games.value = result.games;
    totalPages.value = result.pages;
    currentPage.value = result.page;
    totalGamesCount.value = result.total;
    hasNextPage.value = result.hasNextPage;
    hasPrevPage.value = result.hasPrevPage;
    pageLimit.value = result.limit;

    // Загрузить статистику для вкладки "мои игры"
    if (activeTab.value === 'my' && currentUser.value) {
      await fetchMyGamesStats();
    }

  } catch (error) {
    console.error("Помилка завантаження ігор:", error);
  } finally {
    isLoading.value = false;
  }
};

// Следим за изменениями вкладок, фильтров и номера страницы
watch([activeTab, fromDate, toDate, currentPage], () => {
  loadGames();
}, { immediate: false });

onMounted(() => {
  loadGames();
});

// Change page with validation
const changePage = (page: number) => {
  if ((page > currentPage.value && hasNextPage.value) ||
      (page < currentPage.value && hasPrevPage.value) ||
      (page >= 1 && page <= totalPages.value && page !== currentPage.value)) {
    currentPage.value = page;
    // loadGames будет вызван через watcher
  }
};

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

// Set active tab with smooth animation and reset pagination
const setActiveTab = (tabId: string) => {
  if (activeTab.value !== tabId) {
    activeTab.value = tabId;
    currentPage.value = 1; // Reset to first page when changing tabs
  }
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

// Statistics for my games tab
const myGamesStats = ref({
  total: 0,
  wins: 0,
  percentage: 0
});

// Загрузка статистики "моих игр"
const fetchMyGamesStats = async () => {
  if (!currentUser.value || activeTab.value !== 'my') return;

  try {
    const params = {
      playerId: currentUser.value.id,
      statsOnly: true
    };

    const stats = await gameStore.loadPaginatedGames(params);

    // Extract stats safely with defaults
    myGamesStats.value = {
      total: stats.total || 0,
      wins: (stats as any).wins || 0,
      percentage: (stats as any).winPercentage || 0
    };
  } catch (error) {
    console.error("Помилка завантаження статистики:", error);
  }
};

// Computed properties for my games statistics
const myGamesCount = computed(() => myGamesStats.value.total);
const myWinsCount = computed(() => myGamesStats.value.wins);
const winPercentage = computed(() => myGamesStats.value.percentage);

// Форматирование даты для фильтра
const formatFilterDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

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
