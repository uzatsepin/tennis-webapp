export enum GameStatus {
    DRAFT = 'draft',
    PENDING = 'pending', // Ожидает подтверждения от оппонента
    SCHEDULED = 'scheduled', // Подтверждено обоими игроками
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected', // Отклонено оппонентом
}

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
    // Новые поля для дополнительной информации
    age?: number
    height?: number // рост в см
    weight?: number // вес в кг
    forehand?: string // тип форхенда, например: "one-handed", "two-handed"
    createdAt: Date
    updatedAt: Date
}

export interface Game {
    _id?: string
    player1Id: number // Telegram user ID of player 1
    player2Id: number // Telegram user ID of player 2
    player1Username: string
    player2Username: string
    scheduledTime: Date
    status: GameStatus
    score?: string // e.g. "6:4, 7:5"
    winnerId?: number // Telegram user ID of the winner
    createdAt: Date
    updatedAt: Date
    createdBy: number // Telegram user ID of the creator
}

export interface Ranking {
    _id?: string
    userId: number
    username: string
    points: number
    position: number
    updatedAt: Date
    user?: User // Вложенный объект пользователя
}

// Интерфейсы для сессии бота
export interface GameData {
    opponentUsername?: string
    scheduledTime?: Date
    gameId?: string
    score?: string
}

export interface BotSession {
    step?: 'schedule_game_username' | 'schedule_game_time' | 'add_result_select' | 'add_result_score' | 'add_result_winner'
    gameData?: GameData
}

// Интерфейс для часто встречающихся оппонентов
export interface OpponentStats {
    opponentId: number
    opponentUsername: string
    gamesCount: number
}
