<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative mb-16">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-32 -mx-4 rounded-b-3xl z-0"
      ></div>

      <div class="relative pt-4 px-1 z-10">
        <!-- Header with Back Button and Title -->
        <div class="flex justify-between items-center mb-6">
          <div class="text-white">
            <h1 class="text-2xl font-bold">Мій Профіль</h1>
            <p class="text-blue-200 text-sm">Ваша статистика та ігри</p>
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

      <!-- Profile Card - Now positioned partially over the banner -->
      <div
        v-if="currentUser"
        class="relative bg-white rounded-xl shadow-lg p-6 mx-1 z-20"
      >
        <div class="flex items-center">
          <div class="mr-4">
            <img
              v-if="telegramPhoto"
              :src="telegramPhoto"
              class="h-16 w-16 rounded-xl object-cover"
              alt="Profile"
            />
            <div
              v-else
              class="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-xl font-bold"
            >
              {{ currentUser?.name.charAt(0) }}
            </div>
          </div>

          <div class="flex-1">
            <h2 class="font-bold text-lg text-gray-900">{{ currentUser?.name }}</h2>
            <p class="text-gray-500 text-sm">@{{ currentUser?.username }}</p>

            <div class="flex mt-2 space-x-4">
              <div>
                <p class="text-xs text-gray-500">Рейтинг</p>
                <p class="font-semibold">{{ currentUser?.rating || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Ігор</p>
                <p class="font-semibold">
                  {{ currentUser?.gamesPlayed || 0 }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Перемог</p>
                <p class="font-semibold">{{ currentUser?.gamesWon || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">% перемог</p>
                <p class="font-semibold">
                  {{ winRate !== null ? winRate + "%" : "—" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <TennisBallLoader />
    </div>

    <!-- Not Authenticated State -->
    <div
      v-else-if="!isAuthenticated"
      class="bg-white rounded-xl shadow-sm p-8 text-center"
    >
      <Icon icon="mdi:account-alert" class="text-5xl text-gray-400 mb-3" />
      <p class="text-gray-700 font-medium mb-2">Ви не авторизовані</p>
      <p class="text-gray-500 mb-4">Необхідно увійти для перегляду профілю</p>
      <p class="text-sm text-gray-400">
        Будь ласка, перезапустіть застосунок або зверніться до адміністратора
      </p>
    </div>

    <!-- Authenticated User Profile -->
    <div v-else class="space-y-6 z-10">
      <!-- Profile Tabs -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 py-3 px-4 text-center text-sm font-medium relative transition-colors"
            :class="[
              activeTab === tab.id
                ? 'text-blue-900 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50',
            ]"
          >
            <div class="flex justify-center items-center">
              <Icon :icon="tab.icon" class="mr-2" />
              {{ tab.name }}
            </div>
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-900"
            ></div>
          </button>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="p-5">
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div
              class="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              @click="activeTab = 'games'"
            >
              <div>
                <p class="text-sm text-gray-600 mb-1">Зіграно ігор</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ completedGames.length }}
                </p>
              </div>
              <div
                class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <Icon icon="mdi:tennis" class="text-2xl text-blue-800" />
              </div>
            </div>
            <div
              class="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              @click="activeTab = 'statistics'"
            >
              <div>
                <p class="text-sm text-gray-600 mb-1">Перемоги</p>
                <p class="text-2xl font-bold text-gray-900">{{ myWinsCount }}</p>
              </div>
              <div
                class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <Icon icon="mdi:trophy" class="text-2xl text-blue-800" />
              </div>
            </div>
          </div>

          <!-- Upcoming Games -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-gray-900 flex items-center">
                <Icon icon="mdi:calendar-clock" class="mr-2 text-blue-900" />
                Найближчі ігри
              </h3>
              <button
                @click="activeTab = 'games'"
                class="text-blue-900 text-sm font-medium hover:underline flex items-center"
              >
                Всі
                <Icon icon="mdi:chevron-right" class="ml-1" />
              </button>
            </div>

            <div
              v-if="upcomingGames.length === 0"
              class="bg-gray-50 rounded-xl p-4 text-center"
            >
              <p class="text-gray-500">Немає запланованих ігор</p>
              <button
                @click="navigateToNewGame"
                class="mt-2 text-blue-900 font-medium text-sm"
              >
                Запланувати нову гру
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="game in upcomingGames.slice(0, 3)"
                :key="game._id"
                class="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="navigateToGame(game._id)"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-500 flex items-center">
                    <Icon icon="mdi:clock-outline" class="mr-1" />
                    {{ formatDate(game.scheduledTime) }}
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': game.status === 'scheduled',
                      'bg-yellow-100 text-yellow-800': game.status === 'pending',
                    }"
                  >
                    {{ getStatusText(game.status) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player1Id === currentUser?.id ? "Ви" : game.player1Username
                      }}
                    </div>
                  </div>
                  <div class="mx-2 text-gray-400">vs</div>
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player2Id === currentUser?.id ? "Ви" : game.player2Username
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Games -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-gray-900 flex items-center">
                <Icon icon="mdi:history" class="mr-2 text-blue-900" />
                Останні результати
              </h3>
              <button
                @click="activeTab = 'games'"
                class="text-blue-900 text-sm font-medium hover:underline flex items-center"
              >
                Всі
                <Icon icon="mdi:chevron-right" class="ml-1" />
              </button>
            </div>

            <div
              v-if="completedGames.length === 0"
              class="bg-gray-50 rounded-xl p-4 text-center"
            >
              <p class="text-gray-500">Немає завершених ігор</p>
              <button
                @click="navigateToNewGame"
                class="mt-2 text-blue-900 font-medium text-sm"
              >
                Запланувати першу гру
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="game in completedGames.slice(0, 3)"
                :key="game._id"
                class="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="navigateToGame(game._id)"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-500 flex items-center">
                    <Icon icon="mdi:calendar-check" class="mr-1" />
                    {{ formatDate(game.scheduledTime) }}
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ getStatusText(game.status) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player1Id === currentUser?.id ? "Ви" : game.player1Username
                      }}
                    </div>
                    <div
                      v-if="game.score"
                      class="mt-1 text-lg font-bold"
                      :class="{ 'text-blue-700': isWinner(game, game.player1Id) }"
                    >
                      {{ getScore(game).player1 }}
                    </div>
                  </div>
                  <div class="mx-2 text-gray-400">vs</div>
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player2Id === currentUser?.id ? "Ви" : game.player2Username
                      }}
                    </div>
                    <div
                      v-if="game.score"
                      class="mt-1 text-lg font-bold"
                      :class="{ 'text-blue-700': isWinner(game, game.player2Id) }"
                    >
                      {{ getScore(game).player2 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Games Tab -->
        <div v-if="activeTab === 'games'" class="p-5">
          <div class="mb-6">
            <h3 class="font-semibold text-gray-900 flex items-center mb-4">
              <Icon icon="mdi:calendar-clock" class="mr-2 text-blue-900" />
              Заплановані ігри
            </h3>

            <div
              v-if="upcomingGames.length === 0"
              class="bg-gray-50 rounded-xl p-4 text-center"
            >
              <p class="text-gray-500">Немає запланованих ігор</p>
              <button
                @click="navigateToNewGame"
                class="mt-2 text-blue-900 font-medium text-sm"
              >
                Запланувати нову гру
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="game in upcomingGames"
                :key="game._id"
                class="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="navigateToGame(game._id)"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-500 flex items-center">
                    <Icon icon="mdi:clock-outline" class="mr-1" />
                    {{ formatDate(game.scheduledTime) }}
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': game.status === 'scheduled',
                      'bg-yellow-100 text-yellow-800': game.status === 'pending',
                    }"
                  >
                    {{ getStatusText(game.status) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player1Id === currentUser?.id ? "Ви" : game.player1Username
                      }}
                    </div>
                  </div>
                  <div class="mx-2 text-gray-400">vs</div>
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player2Id === currentUser?.id ? "Ви" : game.player2Username
                      }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="canAddResult(game)"
                  class="mt-3 pt-2 border-t border-gray-200 text-right"
                >
                  <button
                    @click.stop="navigateToGameResult(game._id)"
                    class="text-blue-900 text-sm font-medium"
                  >
                    Записати результат
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 flex items-center mb-4">
              <Icon icon="mdi:history" class="mr-2 text-blue-900" />
              Історія ігор
            </h3>

            <div
              v-if="completedGames.length === 0"
              class="bg-gray-50 rounded-xl p-4 text-center"
            >
              <p class="text-gray-500">Немає завершених ігор</p>
              <button
                @click="navigateToNewGame"
                class="mt-2 text-blue-900 font-medium text-sm"
              >
                Запланувати першу гру
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="game in completedGames"
                :key="game._id"
                class="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="navigateToGame(game._id)"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-500 flex items-center">
                    <Icon icon="mdi:calendar-check" class="mr-1" />
                    {{ formatDate(game.scheduledTime) }}
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ getStatusText(game.status) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player1Id === currentUser?.id ? "Ви" : game.player1Username
                      }}
                    </div>
                    <div
                      v-if="game.score"
                      class="mt-1 text-lg font-bold"
                      :class="{ 'text-blue-700': isWinner(game, game.player1Id) }"
                    >
                      {{ getScore(game).player1 }}
                    </div>
                  </div>
                  <div class="mx-2 text-gray-400">vs</div>
                  <div class="text-center">
                    <div class="font-medium text-gray-900">
                      {{
                        game.player2Id === currentUser?.id ? "Ви" : game.player2Username
                      }}
                    </div>
                    <div
                      v-if="game.score"
                      class="mt-1 text-lg font-bold"
                      :class="{ 'text-blue-700': isWinner(game, game.player2Id) }"
                    >
                      {{ getScore(game).player2 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Tab -->
        <div v-if="activeTab === 'statistics'" class="p-5">
          <div v-if="completedGames.length === 0" class="text-center py-6">
            <Icon icon="mdi:chart-bar-off" class="text-5xl text-gray-300 mx-auto mb-3" />
            <h3 class="text-lg font-medium text-gray-900 mb-1">
              Немає даних для статистики
            </h3>
            <p class="text-gray-500 mb-4">
              Зіграйте кілька ігор щоб побачити свою статистику
            </p>
            <button
              @click="navigateToNewGame"
              class="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              <Icon icon="mdi:plus" class="mr-2" />
              Запланувати гру
            </button>
          </div>

          <div v-else>
            <!-- Statistics Cards -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-600 mb-1">Всього матчів</p>
                <p class="text-2xl font-bold text-gray-900">{{ myGamesCount }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-600 mb-1">Перемоги</p>
                <p class="text-2xl font-bold text-blue-700">{{ myWinsCount }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-600 mb-1">Поразки</p>
                <p class="text-2xl font-bold text-gray-900">{{ myLossesCount }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-sm text-gray-600 mb-1">Відсоток перемог</p>
                <p class="text-2xl font-bold text-blue-700">{{ winPercentage }}%</p>
              </div>
            </div>

            <!-- Win/Loss Chart -->
            <div class="mb-6 bg-white rounded-xl p-5 shadow-sm">
              <h3 class="font-semibold text-gray-900 flex items-center mb-4">
                <Icon icon="mdi:chart-pie" class="mr-2 text-blue-900" />
                Співвідношення перемог і поразок
              </h3>
              <div class="flex flex-col md:flex-row">
                <div class="w-full md:w-1/2 h-60">
                  <Doughnut :data="winLossChartData" :options="winLossChartOptions" />
                </div>
                <div
                  class="w-full md:w-1/2 flex flex-col justify-center pl-0 md:pl-5 mt-4 md:mt-0"
                >
                  <div class="flex items-center mb-3">
                    <div class="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                    <span class="text-gray-700">Перемоги: {{ myWinsCount }}</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                    <span class="text-gray-700">Поразки: {{ myLossesCount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Chart (Last Games) -->
            <div class="mb-6 bg-white rounded-xl p-5 shadow-sm">
              <h3 class="font-semibold text-gray-900 flex items-center mb-4">
                <Icon icon="mdi:chart-line" class="mr-2 text-blue-900" />
                Динаміка результатів
              </h3>
              <div v-if="completedGames.length >= 2" class="h-60">
                <Line :data="performanceChartData" :options="performanceChartOptions" />
              </div>
              <div v-else class="text-center py-10 text-gray-500">
                <Icon
                  icon="mdi:chart-line-variant"
                  class="text-4xl text-gray-300 mx-auto mb-2"
                />
                <p>Зіграйте більше ігор для відображення графіку</p>
              </div>
            </div>

            <!-- Ranking History -->
            <div
              v-if="userRanking && userRanking.history && userRanking.history.length > 0"
              class="mb-6"
            >
              <h3 class="font-semibold text-gray-900 flex items-center mb-4">
                <Icon icon="mdi:chart-line" class="mr-2 text-blue-900" />
                Історія рейтингу
              </h3>

              <div class="space-y-2">
                <div
                  v-for="(item, index) in userRanking.history.slice(0, 5)"
                  :key="index"
                  class="bg-gray-50 rounded-xl p-3 flex justify-between items-center"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ formatDate(item.date) }}</p>
                    <p v-if="item.gameId" class="text-xs text-blue-900">
                      <button
                        @click="navigateToGame(item.gameId)"
                        class="hover:underline"
                      >
                        Переглянути гру
                      </button>
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-blue-900">{{ item.rating }}</p>
                    <p v-if="index < userRanking.history.length - 1" class="text-xs">
                      <span
                        :class="{
                          'text-green-600':
                            item.rating > userRanking.history[index + 1].rating,
                          'text-red-600':
                            item.rating < userRanking.history[index + 1].rating,
                        }"
                      >
                        {{
                          item.rating > userRanking.history[index + 1].rating ? "+" : ""
                        }}
                        {{ item.rating - userRanking.history[index + 1].rating }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const router = useRouter();
const userStore = useUserStore();
const gameStore = useGameStore();

const userGames = ref<any[]>([]);
const userRanking = ref<any>(null);
const isLoading = ref(true);
const activeTab = ref("overview"); // 'overview', 'games', 'statistics'

const tabs = [
  { id: "overview", name: "Огляд", icon: "mdi:view-dashboard" },
  { id: "games", name: "Мої ігри", icon: "mdi:tennis" },
  { id: "statistics", name: "Статистика", icon: "mdi:chart-bar" },
];

const currentUser = computed(() => userStore.currentUser);
const isAuthenticated = computed(() => userStore.isAuthenticated);

// Get user's photo from Telegram if available
const telegramPhoto = computed(() => {
  //@ts-ignore
  if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
    //@ts-ignore
    return window.Telegram.WebApp.initDataUnsafe.user.photo_url;
  }
  return null;
});

onMounted(async () => {
  isLoading.value = true;

  try {
    if (currentUser.value) {
      // Load user games
      const games = await gameStore.getUserGames(currentUser.value.id);
      userGames.value = games || [];

      // Load user ranking
      userRanking.value = await userStore.getUserRanking(currentUser.value.id);
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  } finally {
    isLoading.value = false;
  }
});

// Filter completed games
const completedGames = computed(() => {
  return userGames.value.filter((game) => game.status === GameStatus.COMPLETED);
});

// Filter upcoming games
const upcomingGames = computed(() => {
  return userGames.value.filter(
    (game) => game.status === GameStatus.PENDING || game.status === GameStatus.SCHEDULED
  );
});

// Calculate game statistics
const myGamesCount = computed(() => {
  if (!currentUser.value) return 0;
  return userGames.value.filter(
    (game) =>
      game.player1Id === currentUser.value?.id || game.player2Id === currentUser.value?.id
  ).length;
});

const myWinsCount = computed(() => {
  if (!currentUser.value) return 0;
  return completedGames.value.filter((game) => game.winnerId === currentUser.value?.id)
    .length;
});

const myLossesCount = computed(() => {
  return completedGames.value.length - myWinsCount.value;
});

const winPercentage = computed(() => {
  if (completedGames.value.length === 0) return 0;
  return Math.round((myWinsCount.value / completedGames.value.length) * 100);
});

// Win rate for the overview section
const winRate = computed(() => {
  if (
    !currentUser.value ||
    !currentUser.value.gamesPlayed ||
    currentUser.value.gamesPlayed === 0 ||
    currentUser.value.gamesWon === undefined
  ) {
    return null;
  }
  return Math.round((currentUser.value.gamesWon / currentUser.value.gamesPlayed) * 100);
});

// Navigation functions
const navigateToNewGame = () => {
  router.push("/games/new");
};

const navigateToGame = (gameId:string) => {
  router.push(`/games/${gameId}`);
};

const navigateToGameResult = (gameId:string) => {
  router.push(`/games/${gameId}/result`);
};

// Helper functions
const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
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

const isWinner = (game:Game, playerId:string | number) => {
  return game.status === GameStatus.COMPLETED && game.winnerId === playerId;
};

const getScore = (game: Game) => {
  if (!game.score) return { player1: "0", player2: "0" };

  const [score1, score2] = game.score.split(":");
  return { player1: score1.trim(), player2: score2.trim() };
};

const canAddResult = (game:Game) => {
  if (!currentUser.value) return false;
  return (
    (game.status === GameStatus.PENDING || game.status === GameStatus.SCHEDULED) &&
    (game.player1Id === currentUser.value.id || game.player2Id === currentUser.value.id)
  );
};

// Chart data for statistics tab
const winLossChartData = computed(() => ({
  labels: ["Перемоги", "Поразки"],
  datasets: [
    {
      data: [myWinsCount.value, myLossesCount.value],
      backgroundColor: ["#2563EB", "#E5E7EB"],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}));

const winLossChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context:any) {
          const value = context.raw;
          const total = myWinsCount.value + myLossesCount.value;
          const percentage = Math.round((value / total) * 100);
          return `${context.label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

const performanceChartData = computed(() => {
  // Get last 5 games
  const lastGames = [...completedGames.value]
    .sort(
      (a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
    )
    .slice(0, 5)
    .reverse();

  const labels = lastGames.map((game) => {
    const date = new Date(game.scheduledTime);
    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
  });

  const data = lastGames.map((game) => {
    return game.winnerId === currentUser.value?.id ? 1 : 0;
  });

  return {
    labels,
    datasets: [
      {
        label: "Результат",
        data,
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderColor: "#2563EB",
        borderWidth: 2,
        pointBackgroundColor: "#2563EB",
        fill: true,
        tension: 0.4,
      },
    ],
  };
});

const performanceChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 1,
      ticks: {
        stepSize: 1,
        callback: function (value:number) {
          return value === 1 ? "Перемога" : "Поразка";
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<style scoped>
/* Smooth transitions */
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
</style>
