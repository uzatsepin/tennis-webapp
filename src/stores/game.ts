import { ref } from 'vue'
import { defineStore } from 'pinia'
import { gameApi, userApi } from '@/services/api'
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
            const allGames = response.data.games || response.data
            games.value = limit ? allGames.slice(0, limit) : allGames
            return games.value
        } catch (err: any) {
            error.value = err.message || 'Помилка завантаження ігор'
            return []
        } finally {
            isLoading.value = false
        }
    }

    async function loadPaginatedGames(params = {}) {
        isLoading.value = true
        error.value = null

        try {
            const response = await gameApi.getPaginatedGames(params)
            return {
                games: response.data.games || [],
                total: response.data.pagination?.total || 0,
                page: response.data.pagination?.page || 1,
                pages: response.data.pagination?.pages || 1,
                limit: response.data.pagination?.limit || 20,
                hasNextPage: response.data.pagination?.hasNextPage || false,
                hasPrevPage: response.data.pagination?.hasPrevPage || false,
            }
        } catch (err: any) {
            error.value = err.message || 'Помилка завантаження ігор'
            return {
                games: [],
                total: 0,
                page: 1,
                pages: 1,
                limit: 20,
                hasNextPage: false,
                hasPrevPage: false,
            }
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
            const response = await userApi.getUserGames(userId)

            return response.data
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

        selectedOpponent.value = {
            _id: user._id || user.telegramId.toString(),
            telegramId: Number(user.telegramId),
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            points: user.points || user.rating || 0,
            gamesWon: user.gamesWon || 0,
            gamesLost: user.gamesLost || 0,
            gamesPlayed: user.gamesPlayed || 0,
            createdAt: user.createdAt || new Date(),
            updatedAt: user.updatedAt || new Date(),
        }

        return selectedOpponent.value
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
        loadPaginatedGames,
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
