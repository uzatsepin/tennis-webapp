<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative mb-6" style="z-index: 0">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 h-48 sm:h-56 -mx-4 rounded-b-3xl"
      ></div>

      <div class="relative pt-4 px-1">
        <!-- Header with Title -->
        <div class="flex justify-between items-center mb-6">
          <div class="text-white">
            <h1 class="text-2xl font-bold">Рейтингова таблиця</h1>
            <p class="text-blue-200 text-sm">Турнірна таблиця гравців клубу</p>
          </div>
          <!-- User ranking badge if available -->
          <div
            v-if="userRanking"
            class="bg-white rounded-full py-1 px-3 flex items-center shadow-md"
          >
            <Icon icon="mdi:trophy" class="text-blue-900 mr-1.5" />
            <span class="text-blue-900 font-bold">{{ userRanking.position }}</span>
            <span class="text-gray-500 text-sm ml-1">місце</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="bg-white rounded-xl shadow-sm p-8 flex justify-center"
      style="z-index: 10; position: relative"
    >
      <TennisBallLoader />
    </div>

    <!-- Rankings Content -->
    <div v-else-if="rankings.length > 0" style="z-index: 10; position: relative">
      <!-- Top 3 Players Podium -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div
          class="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
        >
          <div class="flex justify-between items-end">
            <!-- Second Place -->
            <div
              v-if="rankings.length >= 2"
              class="flex-1 flex flex-col items-center"
              :class="{
                'opacity-75':
                  currentUserId && rankings[1].userId === currentUserId
                    ? ''
                    : 'opacity-75',
              }"
            >
              <div class="relative mb-1">
                <div class="absolute -top-1 -right-1">
                  <div
                    class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm"
                  >
                    2
                  </div>
                </div>
                <div
                  class="w-16 h-16 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center overflow-hidden"
                >
                  <span class="text-xl font-bold text-gray-700">{{
                    rankings[1].username.charAt(0)
                  }}</span>
                </div>
              </div>
              <h3 class="font-bold text-gray-800 text-center mb-1">
                {{ rankings[1].username }}
              </h3>
              <p class="text-sm text-gray-500">{{ rankings[1].points }} очків</p>
            </div>

            <!-- First Place -->
            <div
              class="flex-1 flex flex-col items-center -mt-4 z-10"
              :class="{
                'opacity-75':
                  currentUserId && rankings[0].userId === currentUserId
                    ? ''
                    : 'opacity-75',
              }"
            >
              <div class="w-8 h-8 mb-2 text-yellow-500">
                <Icon icon="mdi:crown" class="w-full h-full" />
              </div>
              <div class="relative mb-1">
                <div class="absolute -top-1 -right-1">
                  <div
                    class="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-semibold text-sm"
                  >
                    1
                  </div>
                </div>
                <div
                  class="w-20 h-20 rounded-full bg-yellow-100 border-4 border-yellow-300 flex items-center justify-center overflow-hidden"
                >
                  <span class="text-2xl font-bold text-yellow-700">{{
                    rankings[0].username.charAt(0)
                  }}</span>
                </div>
              </div>
              <h3 class="font-bold text-gray-800 text-center mb-1">
                {{ rankings[0].username }}
              </h3>
              <p class="text-sm font-medium text-blue-900">
                {{ rankings[0].points }} очків
              </p>
            </div>

            <!-- Third Place -->
            <div
              v-if="rankings.length >= 3"
              class="flex-1 flex flex-col items-center"
              :class="{
                'opacity-75':
                  currentUserId && rankings[2].userId === currentUserId
                    ? ''
                    : 'opacity-75',
              }"
            >
              <div class="relative mb-1">
                <div class="absolute -top-1 -right-1">
                  <div
                    class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm"
                  >
                    3
                  </div>
                </div>
                <div
                  class="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-200 flex items-center justify-center overflow-hidden"
                >
                  <span class="text-xl font-bold text-amber-700">{{
                    rankings[2].username.charAt(0)
                  }}</span>
                </div>
              </div>
              <h3 class="font-bold text-gray-800 text-center mb-1">
                {{ rankings[2].username }}
              </h3>
              <p class="text-sm text-gray-500">{{ rankings[2].points }} очків</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Complete Rankings Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div class="px-5 py-4 bg-blue-900 text-white">
          <h2 class="text-lg font-medium flex items-center">
            <Icon icon="mdi:format-list-numbered" class="mr-2" />
            Повна таблиця рейтингу
          </h2>
        </div>

        <!-- Table Header -->
        <div
          class="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-600"
        >
          <div class="col-span-2 text-center">Місце</div>
          <div class="col-span-5">Гравець</div>
          <div class="col-span-3 text-center">Очки</div>
          <div class="col-span-2 text-center">Ігри</div>
        </div>

        <!-- Table Content -->
        <div class="divide-y divide-gray-100">
          <div
            v-for="(player, index) in rankings"
            :key="player.userId"
            class="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-blue-50': currentUserId && player.userId === currentUserId }"
          >
            <div class="col-span-2 text-center">
              <div
                class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold"
                :class="{
                  'bg-yellow-100 text-yellow-800': index === 0,
                  'bg-gray-200 text-gray-800': index === 1,
                  'bg-amber-100 text-amber-700': index === 2,
                  'bg-blue-100 text-blue-800': index > 2,
                }"
              >
                {{ index + 1 }}
              </div>
            </div>
            <div class="col-span-5 flex items-center">
              <div class="font-medium text-gray-900">{{ player.username }}</div>
              <div
                v-if="currentUserId && player.userId === currentUserId"
                class="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
              >
                ВИ
              </div>
            </div>
            <div class="col-span-3 text-center font-medium">
              {{ player.points }}
            </div>
            <div class="col-span-2 text-center text-gray-600">
              {{ player.user?.gamesPlayed || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Rankings Explanation -->
      <div class="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-3">Як формується рейтинг</h3>

        <div class="space-y-4">
          <div class="flex">
            <div class="flex-shrink-0 mr-3">
              <div class="mt-1 bg-blue-100 rounded-full p-2">
                <Icon icon="mdi:calculator" class="h-6 w-6 text-blue-900" />
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-1">Система рейтингу</h4>
              <p class="text-gray-600 text-sm">
                Рейтинг розраховується на основі системи Ело, яка широко використовується
                у спортивних змаганнях.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0 mr-3">
              <div class="mt-1 bg-blue-100 rounded-full p-2">
                <Icon icon="mdi:tennis" class="h-6 w-6 text-blue-900" />
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-1">Очки за гру</h4>
              <p class="text-gray-600 text-sm">
                Кожен гравець отримує або втрачає очки після завершення матчу в залежності
                від результату та різниці в рейтингу гравців.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0 mr-3">
              <div class="mt-1 bg-blue-100 rounded-full p-2">
                <Icon icon="mdi:chart-line" class="h-6 w-6 text-blue-900" />
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-1">Коефіцієнти</h4>
              <p class="text-gray-600 text-sm">
                Чим вища різниця в рейтингу між гравцями, тим менше очок отримає фаворит
                за перемогу і тим більше очок отримає аутсайдер за несподівану перемогу.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0 mr-3">
              <div class="mt-1 bg-blue-100 rounded-full p-2">
                <Icon icon="mdi:information" class="h-6 w-6 text-blue-900" />
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-1">Початковий рейтинг</h4>
              <p class="text-gray-600 text-sm">
                Новий гравець отримує початковий рейтинг 1000 очок. Цей рейтинг буде
                змінюватися після кожної завершеної гри.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm p-8 text-center"
      style="z-index: 10; position: relative"
    >
      <Icon icon="mdi:trophy-off" class="text-5xl text-gray-300 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Рейтинг поки недоступний</h3>
      <p class="text-gray-500 mb-4">Гравці мають зіграти ігри для формування рейтингу</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRankingStore } from "@/stores/ranking";
import { useUserStore } from "@/stores/user";
import { Icon } from "@iconify/vue";
import TennisBallLoader from "@/components/TennisBallLoader.vue";
import type { Ranking } from "@/services/api";

const rankingStore = useRankingStore();
const userStore = useUserStore();

const isLoading = ref(true);
const rankings = computed<Ranking[]>(() => rankingStore.rankings);

const userRanking = ref<Ranking | null>(null);

// Get current user ID for highlighting
const currentUserId = computed(() => userStore.currentUser?.id);

onMounted(async () => {
  isLoading.value = true;
  try {
    await rankingStore.loadRankings();

    if (userStore.currentUser) {
      userRanking.value = await rankingStore.getUserRanking(userStore.currentUser.id);
    }
  } catch (error) {
    console.error("Error loading rankings:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.podium-card {
  transition: all 0.2s ease;
}

.podium-card:hover {
  transform: translateY(-4px);
}
</style>
