<template>
  <div class="home">
    <!-- Hero Banner -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-48 sm:h-56 -mx-4 rounded-b-3xl"
      ></div>

      <div class="relative pt-6 px-1">
        <!-- Welcome Text -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-white">Вітаємо у Тенісному Клубі</h1>
          <p class="text-blue-200 text-sm">Плануйте ігри та відстежуйте свій прогрес</p>
        </div>

        <!-- User Profile Card -->
        <div v-if="userStore.currentUser" class="bg-white rounded-xl shadow-lg p-5 mb-4">
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
                {{ userStore.currentUser.name.charAt(0) }}
              </div>
            </div>

            <div class="flex-1">
              <h2 class="font-bold text-lg text-gray-900">
                <span v-if="userStore.currentUser.name">
                  {{ userStore.currentUser.name }}
                </span>
                <span v-else>{{ userStore.currentUser.username }}</span>
              </h2>
              <p class="text-gray-500 text-sm">@{{ userStore.currentUser.username }}</p>

              <div class="flex mt-2 space-x-4">
                <div>
                  <p class="text-xs text-gray-500">Рейтинг</p>
                  <p class="font-semibold">{{ userStore.currentUser.rating || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Ігор</p>
                  <p class="font-semibold">
                    {{ userStore.currentUser.gamesPlayed || 0 }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Перемог</p>
                  <p class="font-semibold">{{ userStore.currentUser.gamesWon || 0 }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">% перемог</p>
                  <p class="font-semibold">
                    {{ winRate !== null ? winRate + "%" : "N/A" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <RouterLink
              to="/games/new"
              class="flex items-center justify-center px-4 py-2.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Icon icon="mdi:tennis" class="mr-2" />
              Нова гра
            </RouterLink>
            <RouterLink
              to="/profile"
              class="flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon icon="mdi:account" class="mr-2" />
              Мій профіль
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Stats -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div
        class="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
      >
        <div>
          <p class="text-sm text-gray-600 mb-1">Всього гравців</p>
          <p class="text-2xl font-bold text-gray-900">{{ appStats?.totalUsers }}</p>
        </div>
        <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon icon="lucide:users" class="text-2xl text-blue-800" />
        </div>
      </div>
      <div
        class="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
      >
        <div>
          <p class="text-sm text-gray-600 mb-1">Зіграно ігор</p>
          <p class="text-2xl font-bold text-gray-900">{{ appStats?.completedGames }}</p>
        </div>
        <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon icon="solar:tennis-bold" class="text-2xl text-blue-800" />
        </div>
      </div>
    </div>
    <!-- Recent Games -->
    <div class="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
      <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon icon="mdi:tennis" class="mr-2 text-blue-900" />
          Останні ігри
        </h2>
        <RouterLink
          to="/games"
          class="text-blue-900 text-sm font-medium hover:underline flex items-center"
        >
          Всі ігри
          <Icon icon="mdi:chevron-right" class="ml-1" />
        </RouterLink>
      </div>

      <div v-if="isLoading" class="p-6 flex justify-center">
        <div
          class="w-8 h-8 border-4 border-gray-200 rounded-full border-t-blue-900 animate-spin"
        ></div>
      </div>

      <div v-else-if="recentGames.length" class="divide-y divide-gray-100">
        <div
          v-for="game in recentGames"
          :key="game._id"
          class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="navigateTo(`/games/${game._id}`)"
        >
          <div class="flex justify-between items-center mb-2">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': game.status === 'completed',
                'bg-blue-100 text-blue-800': game.status === 'scheduled',
                'bg-yellow-100 text-yellow-800': game.status === 'pending',
                'bg-gray-100 text-gray-800':
                  game.status === 'cancelled' || game.status === 'rejected',
              }"
            >
              {{ getStatusText(game.status) }}
            </span>
            <span class="text-sm text-gray-500 flex items-center">
              <Icon icon="mdi:clock-outline" class="mr-1" />
              {{ formatDate(game.scheduledTime) }}
            </span>
          </div>

          <div class="flex items-center">
            <div class="flex flex-col items-center flex-1">
              <span class="font-medium text-gray-900">@{{ game.player1Username }}</span>
              <span v-if="game.score" class="mt-1 text-lg font-bold">
                {{ game.score.split(":")[0] }}
              </span>
            </div>
            <div class="mx-4 text-gray-400">
              <Icon icon="mdi:versus" class="text-xl" />
            </div>
            <div class="flex flex-col items-center flex-1">
              <span class="font-medium text-gray-900">@{{ game.player2Username }}</span>
              <span v-if="game.score" class="mt-1 text-lg font-bold">
                {{ game.score.split(":")[1] }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-6 text-center">
        <Icon icon="mdi:tennis-ball-off" class="text-4xl text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 mb-3">Немає жодних ігор</p>
        <RouterLink
          to="/games/new"
          class="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Icon icon="mdi:plus" class="mr-2" />
          Запланувати гру
        </RouterLink>
      </div>
    </div>

    <!-- Top Players -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon icon="mdi:podium" class="mr-2 text-blue-900" />
          Кращі гравці
        </h2>
        <RouterLink
          to="/rankings"
          class="text-blue-900 text-sm font-medium hover:underline flex items-center"
        >
          Повний рейтинг
          <Icon icon="mdi:chevron-right" class="ml-1" />
        </RouterLink>
      </div>

      <div v-if="isLoading" class="p-6 flex justify-center">
        <div
          class="w-8 h-8 border-4 border-gray-200 rounded-full border-t-blue-900 animate-spin"
        ></div>
      </div>

      <div v-else-if="topPlayers.length" class="divide-y divide-gray-100">
        <div
          v-for="(player, index) in topPlayers"
          :key="player.userId"
          class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="navigateTo(`/profile/${player.userId}`)"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-xl"
              :class="{
                'bg-yellow-100 text-yellow-800': index === 0,
                'bg-gray-200 text-gray-700': index === 1,
                'bg-amber-100 text-amber-800': index === 2,
                'bg-blue-100 text-blue-800': index > 2,
              }"
            >
              <span v-if="index < 3">
                <Icon v-if="index === 0" icon="mdi:medal" class="text-xl" />
                <Icon v-else-if="index === 1" icon="mdi:medal" class="text-xl" />
                <Icon v-else icon="mdi:medal" class="text-xl" />
              </span>
              <span v-else class="font-bold">{{ index + 1 }}</span>
            </div>

            <div class="ml-3 flex-1">
              <div v-if="player.user?.firstName || player.user?.lastName">
                <div class="font-medium text-gray-900">
                  {{ player.user?.firstName }} {{ player.user?.lastName }}
                </div>
                <div class="text-sm text-gray-600">{{ player.username }}</div>
              </div>
              <div v-else>
                <div class="font-medium text-gray-900">
                  {{ player.username }}
                </div>
              </div>
              <div class="mt-0.5 flex items-center text-sm text-gray-500">
                <Icon icon="mdi:trophy" class="mr-1 text-blue-900" />
                <span>{{ player.points }} очків</span>
              </div>
            </div>

            <Icon icon="mdi:chevron-right" class="text-gray-400" />
          </div>
        </div>
      </div>

      <div v-else class="p-6 text-center">
        <Icon icon="mdi:chart-bar-off" class="text-4xl text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500">Рейтинг ще не сформовано</p>
      </div>
    </div>
    <p class="text-center text-gray-500 text-sm mt-4">ver. 0.1.3</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { useRankingStore } from "@/stores/ranking";
import type { Game, Ranking, Stats } from "@/services/api";
import { Icon } from "@iconify/vue";
import { getStatusText } from "@/utils/utils";
import { useProfileStore } from "@/stores/profile";

const router = useRouter();
const userStore = useUserStore();
const gameStore = useGameStore();
const rankingStore = useRankingStore();
const profile = useProfileStore();

const isLoading = ref(true);
const recentGames = ref<Game[]>([]);
const topPlayers = ref<Ranking[]>([]);
const userRanking = ref<Ranking>();
const appStats = ref<Stats>();

// Get user's photo from Telegram if available
const telegramPhoto = computed(() => {
  //@ts-ignore
  if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
    //@ts-ignore
    return window.Telegram.WebApp.initDataUnsafe.user.photo_url;
  }
  return null;
});

// Calculate win rate
const winRate = computed(() => {
  const user = userStore.currentUser;
  if (!user || !user.gamesPlayed || user.gamesPlayed === 0 || user.gamesWon === undefined)
    return null;

  return Math.round((user.gamesWon / user.gamesPlayed) * 100);
});

onMounted(async () => {
  isLoading.value = true;

  try {
    // Load recent games
    await gameStore.loadAllGames(5);
    recentGames.value = gameStore.games.slice(0, 5);

    // Load Stats

    await profile.loadStats();
    appStats.value = Array.isArray(profile.stats) ? profile.stats[0] : profile.stats;
    // Load top players
    await rankingStore.loadRankings();
    topPlayers.value = rankingStore.rankings.slice(0, 5);

    // Get user ranking from the already loaded rankings if user is authenticated
    if (userStore.currentUser) {
      userRanking.value = rankingStore.rankings.find(
        (rank) => rank.userId?.toString() === userStore.currentUser?.id?.toString()
      );
    }
  } catch (error) {
    console.error("Error loading home page data:", error);
  } finally {
    isLoading.value = false;
  }
});

// Helper functions
const navigateTo = (path: string): void => {
  router.push(path);
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.home {
  /* Smooth transitions */
  & .transition-all {
    transition: all 0.3s ease;
  }

  /* Card hover effects */
  & .hover\:shadow-md:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
}
</style>
