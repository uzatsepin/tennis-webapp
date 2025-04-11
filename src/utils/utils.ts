import { GameStatus } from '@/services/api'

export const getStatusText = (status: GameStatus) => {
    switch (status) {
        case GameStatus.PENDING:
            return 'Очікує'
        case GameStatus.SCHEDULED:
            return 'Заплановано'
        case GameStatus.COMPLETED:
            return 'Завершено'
        case GameStatus.CANCELLED:
            return 'Скасовано'
        case GameStatus.REJECTED:
            return 'Відхилено'
        default:
            return 'Чернетка'
    }
}
