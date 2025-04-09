import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userApi } from '@/services/api'

// Telegram WebApp type declaration
declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                initDataUnsafe?: {
                    user?: {
                        id: number
                    }
                }
            }
        }
    }
}

export interface UserDisplay {
    id: number
    name: string
    username: string
    rating?: number
    photo?: string
    gamesPlayed?: number
    gamesWon?: number
}

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<UserDisplay | null>(null)
    const allUsers = ref<UserDisplay[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!currentUser.value)

    async function loadAllUsers() {
        isLoading.value = true
        error.value = null

        try {
            console.log('Loading all users')
            const response = await userApi.getAllUsers()

            if (!response || !response.data) {
                throw new Error('Invalid response format')
            }

            allUsers.value = response.data.map((user: any) => ({
                id: user.telegramId,
                name: `${user.firstName} ${user.lastName || ''}`.trim(),
                username: user.username,
                rating: user.points,
                gamesPlayed: user.gamesPlayed,
                gamesWon: user.gamesWon,
            }))

            return allUsers.value
        } catch (err: any) {
            console.error('Error loading users:', err)
            error.value = err.message || 'Помилка завантаження користувачів'
            return []
        } finally {
            isLoading.value = false
        }
    }

    async function getUserById(id: string | number) {
        if (!id) return null

        isLoading.value = true
        error.value = null

        try {
            console.log(`Getting user by ID: ${id}`)
            const response = await userApi.getUserById(id)
            console.log(response.data)

            if (!response || !response.data) {
                return null
            }

            const user = {
                id: response.data.telegramId,
                name: `${response.data.firstName} ${response.data.lastName || ''}`.trim(),
                username: response.data.username,
                rating: response.data.points,
                gamesPlayed: response.data.gamesPlayed,
                gamesWon: response.data.gamesWon,
            }

            // If this is the current user based on Telegram data
            if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id.toString() === id.toString()) {
                currentUser.value = user
            }

            return user
        } catch (err: any) {
            console.error('Error getting user:', err)
            error.value = err.message || 'Помилка отримання користувача'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function registerUser(userData: any) {
        if (!userData || !userData.id) return null

        isLoading.value = true
        error.value = null

        try {
            console.log('Registering user:', userData)
            const userToRegister = {
                telegramId: userData.id,
                username: userData.username || '',
                firstName: userData.name.split(' ')[0] || userData.name,
                lastName: userData.name.split(' ').slice(1).join(' ') || '',
            }

            const response = await userApi.registerUser(userToRegister)

            if (!response || !response.data) {
                throw new Error('Invalid registration response')
            }

            const user = {
                id: response.data.telegramId,
                name: `${response.data.firstName} ${response.data.lastName || ''}`.trim(),
                username: response.data.username,
                rating: response.data.points,
                photo: userData.photo,
                gamesPlayed: response.data.gamesPlayed,
                gamesWon: response.data.gamesWon,
            }

            currentUser.value = user

            // Update allUsers list
            const existingUserIndex = allUsers.value.findIndex((u) => u.id === user.id)
            if (existingUserIndex >= 0) {
                allUsers.value[existingUserIndex] = user
            } else {
                allUsers.value.push(user)
            }

            return user
        } catch (err: any) {
            console.error('Error registering user:', err)
            error.value = err.message || 'Помилка реєстрації користувача'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function getUserGames(userId: string | number) {
        isLoading.value = true
        error.value = null

        try {
            console.log(`[UserStore] Fetching games for user: ${userId}`)
            const response = await userApi.getUserGames(userId)
            console.log('[UserStore] User games response:', response)
            return response.data
        } catch (err: any) {
            console.error('[UserStore] Error fetching user games:', err)
            error.value = err.message || 'Помилка отримання ігор користувача'
            return []
        } finally {
            isLoading.value = false
        }
    }

    async function getUserRanking(userId: string | number) {
        isLoading.value = true
        error.value = null

        try {
            console.log(`[UserStore] Fetching ranking for user: ${userId}`)
            const response = await userApi.getUserRanking(userId)
            console.log('[UserStore] User ranking response:', response)

            if (!response.data) {
                console.warn('[UserStore] No ranking data found')
                return null
            }

            return response.data
        } catch (err: any) {
            console.error('[UserStore] Error fetching user ranking:', err)
            error.value = err.message || 'Помилка отримання рейтингу користувача'
            return null
        } finally {
            isLoading.value = false
        }
    }

    return {
        currentUser,
        allUsers,
        isLoading,
        error,
        isAuthenticated,
        loadAllUsers,
        getUserById,
        registerUser,
        getUserGames,
        getUserRanking,
    }
})
