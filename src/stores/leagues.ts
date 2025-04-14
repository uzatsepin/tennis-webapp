import { leagueApi, type League } from '@/services/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLeagueStore = defineStore('league', () => {
    const leauges = ref<League[]>([])
    const currentLeague = ref<League | null>(null)
    const usersInLeague = ref([])
    const error = ref<string | null>(null)
    const isLoading = ref(false)

    async function loadAllLeagues() {
        isLoading.value = true
        error.value = null
        try {
            const response = await leagueApi.getAllLeagues()
            const allLeagues = response.data.leagues || response.data
            leauges.value = allLeagues
            return allLeagues
        } catch (err: any) {
            error.value = err.message || 'Помилка завантаження ліг'
            return []
        } finally {
            isLoading.value = false
        }
    }

    async function loadLeagueById(id: string) {
        isLoading.value = true
        error.value = null
        try {
            const response = await leagueApi.getLeagueById(id)
            const league = response.data.league || response.data
            currentLeague.value = league
            return league
        } catch (err: any) {
            error.value = err.message || 'Помилка завантаження ліг'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function createLeague(leagueData: any) {
        isLoading.value = true
        error.value = null
        try {
            const response = await leagueApi.createLeague(leagueData)
            const league = response.data.league || response.data
            currentLeague.value = league
            return league
        } catch (err: any) {
            error.value = err.message || 'Помилка створення ліги'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function addUserToLeague(leagueId: string, telegramId: string) {
        isLoading.value = true
        error.value = null
        try {
            const response = await leagueApi.addUserToLeague(leagueId, telegramId)
            const league = response.data.league || response.data
            currentLeague.value = league
            return league
        } catch (err: any) {
            error.value = err.message || 'Помилка додавання користувача до ліги'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function getLeagueUsers(leagueId: string) {
        isLoading.value = true
        error.value = null
        try {
            const response = await leagueApi.getLeagueUsers(leagueId)
            const users = response.data.users || response.data
            usersInLeague.value = users
            return users
        } catch (err: any) {
            error.value = err.message || 'Помилка отримання користувачів ліги'
            return []
        } finally {
            isLoading.value = false
        }
    }

    return {
        leauges,
        error,
        loadAllLeagues,
        loadLeagueById,
        currentLeague,
        isLoading,
        createLeague,
        addUserToLeague,
        getLeagueUsers,
    }
})
