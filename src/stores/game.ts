import { ref } from 'vue'
import { defineStore } from 'pinia'
import { gameApi } from '@/services/api'
import type { Game, User } from '@/services/api'

export const useGameStore = defineStore('game', () => {
    const games = ref<Game[]>([])
    const currentGame = ref<Game | null>(null)
    const selectedOpponent = ref<User | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function loadAllGames(limit?: number) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.getAllGames()
            const allGames = response.data
            // Если указан лимит, ограничиваем количество игр
            games.value = limit ? allGames.slice(0, limit) : allGames
            return games.value
        } catch (err: any) {
            error.value = err.message || 'Помилка завантаження ігор'
            return []
        } finally {
            isLoading.value = false
        }
    }

    async function getGameById(id: string) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.getGameById(id)
            currentGame.value = response.data
            return currentGame.value
        } catch (err: any) {
            error.value = err.message || 'Помилка отримання гри'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function createGame(gameData: any) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.createGame(gameData)
            games.value = [response.data, ...games.value]
            return response.data
        } catch (err: any) {
            error.value = err.message || 'Помилка створення гри'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function updateGameResult(id: string, resultData: any) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.updateGameResult(id, resultData)

            // Обновление игры в списке
            const index = games.value.findIndex((game) => game._id === id)
            if (index !== -1) {
                games.value[index] = response.data
            }

            return response.data
        } catch (err: any) {
            error.value = err.message || 'Помилка оновлення результату гри'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function getUserGames(userId: number | string) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.getAllGames()
            return response.data.filter(
                (game: Game) => game.player1Id.toString() === userId.toString() || game.player2Id.toString() === userId.toString(),
            )
        } catch (err: any) {
            error.value = err.message || 'Помилка отримання ігор користувача'
            return []
        } finally {
            isLoading.value = false
        }
    }

    async function confirmGame(id: string) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.confirmGame(id)

            // Обновление игры в списке
            const index = games.value.findIndex((game) => game._id === id)
            if (index !== -1) {
                games.value[index] = response.data
            }

            return response.data
        } catch (err: any) {
            error.value = err.message || 'Помилка підтвердження гри'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function rejectGame(id: string) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.rejectGame(id)

            // Обновление игры в списке
            const index = games.value.findIndex((game) => game._id === id)
            if (index !== -1) {
                games.value[index] = response.data
            }

            return response.data
        } catch (err: any) {
            error.value = err.message || 'Помилка відхилення гри'
            return null
        } finally {
            isLoading.value = false
        }
    }

    function selectOpponent(user: User | null) {
        if (!user) {
            selectedOpponent.value = null
            return null
        }
        selectedOpponent.value = user
        return null
    }

    function clearOpponent() {
        selectedOpponent.value = null
    }

    return {
        games,
        currentGame,
        selectedOpponent,
        isLoading,
        error,
        loadAllGames,
        getGameById,
        createGame,
        updateGameResult,
        getUserGames,
        confirmGame,
        rejectGame,
        selectOpponent,
        clearOpponent,
    }
})
