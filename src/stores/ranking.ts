import { ref } from 'vue'
import { defineStore } from 'pinia'
import { rankingApi } from '@/services/api'
import type { Ranking } from '@/services/api'

export const useRankingStore = defineStore('ranking', () => {
  const rankings = ref<Ranking[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadRankings(limit?: number) {
    isLoading.value = true
    error.value = null

    try {
      const response = await rankingApi.getAllRankings()

      // Сортируем по позиции, если необходимо
      const sortedRankings = response.data.sort((a: Ranking, b: Ranking) => a.position - b.position)

      // Ограничиваем количество результатов, если указан лимит
      rankings.value = limit ? sortedRankings.slice(0, limit) : sortedRankings

      return rankings.value
    } catch (err: any) {
      error.value = err.message || 'Помилка завантаження рейтингу'
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function getUserRanking(userId: number | string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await rankingApi.getAllRankings()
      const userRanking = response.data.find(
        (rank: Ranking) => rank.userId.toString() === userId.toString(),
      )

      return userRanking || null
    } catch (err: any) {
      error.value = err.message || 'Помилка отримання рейтингу користувача'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { rankings, isLoading, error, loadRankings, getUserRanking }
})
