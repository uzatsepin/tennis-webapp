import axios from 'axios'

// Определение статусов игры
export enum GameStatus {
    DRAFT = 'draft',
    PENDING = 'pending', // Ожидает подтверждения от оппонента
    SCHEDULED = 'scheduled', // Подтверждено обоими игроками
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected', // Отклонено оппонентом
}

export interface Stats {
    totalUsers: string
    totalGames: string
    completedGames: string
    topPlayers: User[]
    rankings: StatsRankings[]
}

export interface StatsRankings {
    id: string
    userId: number
    points: number
    position: number
    updatedAt: Date | string
    username: string
}

// Интерфейсы для типизации данных
export interface User {
    _id?: string
    telegramId: number
    username: string
    firstName: string
    lastName?: string
    points: number
    gamesPlayed: number
    gamesWon: number
    gamesLost: number
    createdAt: Date
    updatedAt: Date
    rating?: number
    age?: number
    forehand?: string
    height?: number
    weight?: number
    leagues: string[]
}

export interface Game {
    id?: number
    _id?: string
    player1Id: number
    player2Id: number
    player1Username: string
    player2Username: string
    scheduledTime: Date | string
    status: GameStatus
    score?: string
    winnerId?: number
    createdAt: Date | string
    updatedAt: Date | string
    createdBy: number
}

export interface Ranking {
    _id?: string
    userId: number
    username: string
    points: number
    position: number
    updatedAt: Date | string
    user?: User // Вложенный объект пользователя
}

export interface selectedUser {
    id: number
    name: string
    username: string
    rating: number
    gamesPlayed: number
    gamesWon: number
}

export interface League {
    id: string
    name: string
    description: string
    createdAt: Date | string
    updatedAt: Date | string
}

// Create an axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://tennis-api.razserv.cloud',
    headers: {
        'Content-Type': 'application/json',
    },
})

// User related API calls
export const userApi = {
    getUserById: (id: string | number) => api.get(`/api/users/${id}`),
    getAllUsers: () => api.get('/api/users'),
    getUserGames: (id: string | number) => api.get(`/api/users/${id}/games`),
    registerUser: (userData: any) => api.post('/api/users', userData),
    getUserRanking: (id: string | number) => api.get(`/api/users/${id}/ranking`),
    updateUserProfile: (id: string | number, profileData: any) => api.put(`/api/users/${id}/profile`, profileData),
}

// Games related API calls
export const gameApi = {
    getAllGames: () => api.get('/api/games'),
    getPaginatedGames: (params: any) => api.get('/api/games', { params }),
    getGameById: (id: string) => api.get(`/api/games/${id}`),
    createGame: (gameData: any) => api.post('/api/games', gameData),
    updateGameResult: (id: string, resultData: any) => api.put(`/api/games/${id}/results`, resultData),
    confirmGame: (id: string) => api.put(`/api/games/${id}/confirm`),
    rejectGame: (id: string) => api.put(`/api/games/${id}/reject`),
}

// Rankings related API calls
export const rankingApi = {
    getAllRankings: () => api.get('/api/rankings'),
}

//Leagues related api calls
export const leagueApi = {
    getAllLeagues: () => api.get('/api/leagues'),
    getLeagueById: (id: string) => api.get(`/api/leagues/${id}`),
    createLeague: (leagueData: any) => api.post('/api/leagues', leagueData),
    addUserToLeague: (leagueId: string, telegramId: string) => api.post(`/api/leagues/${leagueId}/users`, { telegramId }),
    getLeagueUsers: (leagueId: string) => api.get(`/api/leagues/${leagueId}/users`),
}

export const statsApi = {
    getStats: () => api.get('/api/stats'),
}

export default api
