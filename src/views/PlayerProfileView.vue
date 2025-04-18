<template>
  <div>
    <!-- Hero Banner with fixed z-index -->
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
              <h1 class="text-2xl font-bold">Профіль гравця</h1>
              <p class="text-blue-200 text-sm">Статистика та результати гравця</p>
            </div>
          </div>

          <div
            v-if="playerRanking && !isLoading"
            class="bg-white rounded-full py-1 px-3 flex items-center shadow-md"
          >
            <Icon icon="mdi:trophy" class="text-blue-900 mr-1.5" />
            <span class="text-blue-900 font-bold">#{{ playerRanking.position }}</span>
            <span class="text-gray-500 text-sm ml-1">місце</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State with increased z-index -->
    <div
      v-if="isLoading"
      class="bg-white rounded-xl shadow-sm p-8 flex justify-center"
      style="position: relative; z-index: 10"
    >
      <TennisBallLoader />
    </div>

    <!-- Error State with increased z-index -->
    <div
      v-else-if="errorMessage"
      class="bg-white rounded-xl shadow-sm p-6 text-center"
      style="position: relative; z-index: 10"
    >
      <Icon icon="mdi:alert-circle" class="text-5xl text-red-500 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Помилка</h3>
      <p class="text-gray-500 mb-4">{{ errorMessage }}</p>
      <button
        @click="router.push('/rankings')"
        class="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
      >
        <Icon icon="mdi:format-list-numbered" class="mr-2" />
        До рейтингової таблиці
      </button>
    </div>

    <!-- Player Profile with increased z-index -->
    <div v-else-if="player" class="space-y-6" style="position: relative; z-index: 10">
      <!-- Player Header -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="h-18 w-18 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center text-3xl font-bold mr-4"
              :class="{ 'bg-green-100 text-green-800': isCurrentUser }"
            >
              {{ player.username.charAt(0).toUpperCase() }}
            </div>

            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ player.username }}</h2>
              <p v-if="player.firstName || player.lastName" class="text-sm text-gray-500">
                {{ player.firstName }} {{ player.lastName }}
              </p>
              <p v-if="isCurrentUser" class="text-sm text-blue-900 font-medium">
                <Icon icon="mdi:account" class="mr-1" inline />
                Це ви
              </p>
              <p v-if="playerRanking" class="text-sm text-gray-500 mt-1">
                Рейтинг:
                <span class="font-semibold text-blue-900">{{
                  player.rating || 1000
                }}</span>
                очків
              </p>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <button
            v-if="!isCurrentUser"
            @click="navigateToChallengePlayer"
            class="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors flex items-center w-full justify-center"
          >
            <Icon icon="mdi:tennis" class="mr-2" />
            <span>Викликати на гру</span>
          </button>
        </div>

        <!-- Player Details -->
        <div v-if="hasAdditionalInfo" class="mt-6 border-t border-gray-100 pt-4">
          <h3 v-if="hasBaseAdditionalInfo" class="font-medium text-gray-900 mb-3">
            Інформація про гравця
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-if="player.age" class="text-sm">
              <p class="text-gray-500">Вік</p>
              <p class="font-medium">{{ player.age }} років</p>
            </div>
            <div v-if="player.forehand" class="text-sm">
              <p class="text-gray-500">Робоча рука</p>
              <p class="font-medium">
                {{ player.forehand === "right" ? "права" : "ліва" }}
              </p>
            </div>
            <div v-if="player.height" class="text-sm">
              <p class="text-gray-500">Зріст</p>
              <p class="font-medium">{{ player.height }} см</p>
            </div>
            <div v-if="player.weight" class="text-sm">
              <p class="text-gray-500">Вага</p>
              <p class="font-medium">{{ player.weight }} кг</p>
            </div>
          </div>
        </div>

        <h3 class="font-medium text-gray-900" :class="{ 'mt-4': hasBaseAdditionalInfo }">
          Статистика гравця
        </h3>
        <!-- Player Stats Quick View -->
        <div class="mt-4 grid grid-cols-3 gap-3">
          <div
            class="bg-blue-50 p-4 rounded-lg text-center flex flex-col items-center justify-between"
          >
            <p class="text-gray-500 text-sm">Ігор зіграно</p>
            <p class="text-2xl font-bold text-gray-900">{{ completedGames.length }}</p>
          </div>
          <div
            class="bg-blue-50 p-4 rounded-lg text-center flex flex-col items-center justify-between"
          >
            <p class="text-gray-500 text-sm">Перемог</p>
            <p class="text-2xl font-bold text-gray-900">{{ gamesWon }}</p>
          </div>
          <div
            class="bg-blue-50 p-4 rounded-lg text-center flex flex-col items-center justify-between"
          >
            <p class="text-gray-500 text-sm mb-2">Відсоток перемог</p>
            <p class="text-2xl font-bold text-gray-900">{{ Math.round(winRate) }}%</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 py-3 px-4 text-center text-sm font-medium flex items-center justify-center"
            :class="{
              'text-blue-900 border-b-2 border-blue-900 bg-blue-50': activeTab === tab.id,
              'text-gray-500 hover:text-gray-700': activeTab !== tab.id,
            }"
          >
            <Icon :icon="tab.icon" class="mr-2" />
            {{ tab.name }}
          </button>
        </div>

        <!-- Stats Tab -->
        <div v-if="activeTab === 'stats'" class="p-6">
          <div
            v-if="completedGames.length === 0"
            class="text-center text-gray-500 py-8 flex flex-col items-center"
          >
            <Icon icon="mdi:chart-box-outline" class="text-5xl text-gray-300 mb-2" />
            <p>Ще немає зіграних ігор</p>
          </div>
          <div v-else>
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <Icon icon="mdi:chart-donut" class="mr-2 text-blue-900" />
              Статистика ігор
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-gray-500 mb-2">Зіграно ігор</h4>
                <p class="text-2xl font-bold text-gray-900">
                  {{ completedGames.length }}
                </p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-gray-500 mb-2">Виграно ігор</h4>
                <p class="text-2xl font-bold text-blue-900">{{ gamesWon }}</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-gray-500 mb-2">Відсоток перемог</h4>
                <p class="text-2xl font-bold text-gray-900">{{ Math.round(winRate) }}%</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-gray-500 mb-2">Поточна серія</h4>
                <p
                  class="text-2xl font-bold"
                  :class="{
                    'text-blue-900': currentStreak.isWin,
                    'text-red-500': !currentStreak.isWin,
                  }"
                >
                  {{ currentStreak.isWin ? "W" : "L"
                  }}{{ currentStreak.count > 1 ? currentStreak.count : "" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Games Tab -->
        <div v-if="activeTab === 'games'" class="divide-y divide-blue-50">
          <div
            v-if="playerGames.length === 0"
            class="text-center text-gray-500 py-8 flex flex-col items-center"
          >
            <Icon icon="mdi:tennis" class="text-5xl text-gray-300 mb-2" />
            <p>Ігор не знайдено</p>
          </div>
          <template v-else>
            <!-- Upcoming Games -->
            <div v-if="upcomingGames.length > 0" class="p-5">
              <h3 class="font-semibold mb-3 flex items-center text-gray-900">
                <Icon icon="mdi:calendar-clock" class="mr-2 text-blue-900" />
                Заплановані ігри
              </h3>
              <div class="space-y-3">
                <router-link
                  v-for="game in upcomingGames"
                  :key="game._id"
                  :to="`/games/${game._id}`"
                  class="block bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium text-gray-900">
                        {{ getOpponentName(game) }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ formatDate(game.scheduledTime) }}
                      </p>
                    </div>
                    <span
                      class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      заплановано
                    </span>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Completed Games -->
            <div v-if="completedGames.length > 0" class="p-5">
              <h3 class="font-semibold mb-3 flex items-center text-gray-900">
                <Icon icon="mdi:history" class="mr-2 text-blue-900" />
                Історія ігор
              </h3>
              <div class="space-y-3">
                <router-link
                  v-for="game in completedGames"
                  :key="game._id"
                  :to="`/games/${game._id}`"
                  class="block bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium text-gray-900">
                        {{ getOpponentName(game) }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ formatDate(game.scheduledTime) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p
                        class="font-medium"
                        :class="{
                          'text-green-600': isWinner(game),
                          'text-red-500': !isWinner(game),
                        }"
                      >
                        {{ isWinner(game) ? "Перемога" : "Поразка" }}
                      </p>
                      <p class="text-xs mt-1">{{ formatScore(game) }}</p>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </template>
        </div>

        <!-- History Tab -->
        <div v-if="activeTab === 'history'" class="p-5">
          <div
            v-if="
              !playerRanking ||
              !playerRanking.history ||
              playerRanking.history.length === 0
            "
            class="text-center text-gray-500 py-8 flex flex-col items-center"
          >
            <Icon icon="mdi:history" class="text-5xl text-gray-300 mb-2" />
            <p>Історія рейтингу недоступна</p>
          </div>
          <div v-else>
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <Icon icon="mdi:history" class="mr-2 text-blue-900" />
              Історія рейтингу
            </h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in playerRanking.history"
                :key="index"
                class="bg-blue-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ formatDate(item.date) }}</p>
                  <p v-if="item.gameId" class="text-xs text-gray-500 mt-1">
                    <router-link
                      :to="`/games/${item.gameId}`"
                      class="text-blue-900 hover:underline inline-flex items-center"
                    >
                      <Icon icon="mdi:tennis" class="mr-1" />
                      Переглянути гру
                    </router-link>
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-blue-900">{{ item.rating }}</p>
                  <p v-if="index < playerRanking.history.length - 1" class="text-xs mt-1">
                    <span
                      :class="{
                        'text-green-600':
                          item.rating > playerRanking.history[index + 1].rating,
                        'text-red-600':
                          item.rating < playerRanking.history[index + 1].rating,
                      }"
                    >
                      {{
                        item.rating > playerRanking.history[index + 1].rating ? "+" : ""
                      }}
                      {{ item.rating - playerRanking.history[index + 1].rating }}
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, type UserDisplay } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { GameStatus, type User } from '@/services/api'
import { Icon } from '@iconify/vue'
import TennisBallLoader from '@/components/TennisBallLoader.vue'

interface Game {
    _id: string
    player1Id: string
    player2Id: string
    player1Username: string
    player2Username: string
    scheduledTime: string
    status: GameStatus
    score?: string
    winnerId?: string
    createdAt: string
}

interface RatingHistory {
    date: string
    rating: number
    gameId?: string
}

interface PlayerRanking {
    position: number
    userId: string
    username: string
    points: number
    history: RatingHistory[]
}

interface CurrentStreak {
    isWin: boolean
    count: number
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()

const player = ref<UserDisplay | null>(null)
const playerGames = ref<Game[]>([])
const playerRanking = ref<PlayerRanking | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const activeTab = ref('stats')

const tabs = [
    { id: 'stats', name: 'Статистика', icon: 'mdi:chart-box' },
    { id: 'games', name: 'Ігри', icon: 'mdi:tennis' },
    { id: 'history', name: 'Історія', icon: 'mdi:history' },
]

// Check if viewing the current user's profile
const isCurrentUser = computed(() => {
    return userStore.currentUser && player.value && String(userStore.currentUser.id) === String(player.value.id)
})

const hasBaseAdditionalInfo = computed(() => {
    return !!(player.value?.age || player.value?.forehand || player.value?.height || player.value?.weight)
})

const hasAdditionalInfo = computed(() => {
    return !!(
        player.value?.firstName ||
        player.value?.lastName ||
        player.value?.age ||
        player.value?.forehand ||
        player.value?.height ||
        player.value?.weight
    )
})

onMounted(async () => {
    isLoading.value = true
    const playerId = route.params.id as string

    try {
        // Load player data
        const userData = await userStore.getUserById(playerId)

        if (!userData) {
            errorMessage.value = 'Гравець не знайдений'
            return
        }

        // Map userData to match the Player interface structure
        player.value = {
            id: userData.id,
            username: userData.username,
            firstName: userData.name?.split(' ')[0] || undefined,
            lastName: userData.name?.split(' ')[1] || undefined,
            rating: userData.rating,
            age: userData.age,
            forehand: userData.forehand,
            height: userData.height,
            weight: userData.weight,
            telegramId: userData.telegramId,
            gameLost: userData.gameLost,
            gamesWon: userData.gamesWon,
            name: userData.name,
            leagues: userData.leagues,
        }

        // Load player games
        const games = await gameStore.getUserGames(playerId)
        playerGames.value = games

        // Load player ranking
        const ranking = await userStore.getUserRanking(playerId)
        playerRanking.value = ranking
    } catch (error) {
        console.error('Error loading player data:', error)
        errorMessage.value = 'Помилка завантаження даних гравця'
    } finally {
        isLoading.value = false
    }
})

// Computed properties for data display
const completedGames = computed(() => {
    return playerGames.value.filter((game) => game.status === GameStatus.COMPLETED)
})

const upcomingGames = computed(() => {
    return playerGames.value.filter((game) => game.status === GameStatus.PENDING || game.status === GameStatus.SCHEDULED)
})

const gamesWon = computed(() => {
    if (!completedGames.value.length || !player.value) return 0
    return completedGames.value.filter((game) => game.winnerId === player.value?.id).length
})

const winRate = computed(() => {
    if (!completedGames.value.length) return 0
    return (gamesWon.value / completedGames.value.length) * 100
})

const currentStreak = computed((): CurrentStreak => {
    if (!completedGames.value.length || !player.value) {
        return { isWin: false, count: 0 }
    }

    // Sort games by date (newest first)
    const sortedGames = [...completedGames.value].sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime())

    const firstGameWon = Number(sortedGames[0].winnerId) === player.value?.telegramId
    let count = 1

    // Count consecutive wins or losses
    for (let i = 1; i < sortedGames.length; i++) {
        const isWin = Number(sortedGames[i].winnerId) === player.value?.telegramId
        if (isWin === firstGameWon) {
            count++
        } else {
            break
        }
    }

    return { isWin: firstGameWon, count }
})

// Helper functions
const formatDate = (dateString: string): string => {
    if (!dateString) return '—'

    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

const getOpponentName = (game: Game): string => {
    if (!player.value) return ''

    if (Number(game.player1Id) === player.value.telegramId) {
        return game.player2Username
    } else {
        return game.player1Username
    }
}

const isWinner = (game: Game): boolean => {
    if (!player.value) return false
    return Number(game.winnerId) === player.value.telegramId
}

const formatScore = (game: Game): string => {
    if (!game.score) return '—'
    return game.score
}

const navigateToChallengePlayer = async () => {
  if (!player.value) return;

  try {
    // Find the player in the users list by their ID to ensure we have complete data
    await userStore.loadAllUsers();
    const playerToChallenge = userStore.allUsers.find(u => u.id === player.value?.id);

    if (playerToChallenge) {
      // Properly format the user object for the game store
      const opponent = {
        _id: playerToChallenge.id.toString(),
        telegramId: Number(playerToChallenge.id),
        username: playerToChallenge.username,
        firstName: playerToChallenge.firstName || playerToChallenge.username,
        lastName: playerToChallenge.lastName,
        points: playerToChallenge.rating || 0,
        gamesWon: playerToChallenge.gamesWon || 0,
        gamesLost: playerToChallenge.gameLost || 0,
        gamesPlayed: (playerToChallenge.gamesWon || 0) + (playerToChallenge.gameLost || 0),
        createdAt: new Date(),
        updatedAt: new Date(),
        leagues: playerToChallenge.leagues,
      };

      // Set the selected opponent in the game store
      gameStore.selectOpponent(opponent);

      // Navigate to the new game page
      router.push('/games/new');
    } else {
      console.error('Could not find opponent in user list');
    }
  } catch (error) {
    console.error('Error selecting opponent:', error);
  }
};
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Fix scrolling issue when changing routes */
html {
  scroll-behavior: auto !important;
}
</style>
