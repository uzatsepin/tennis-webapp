import { computed } from 'vue'
import { GameStatus } from '@/services/api'

export function useGameStatus(game: any, currentUser: any) {
    // Determine if the current user is one of the players
    const isPlayer = computed(() => {
        if (!game.value || !currentUser.value) return false
        return game.value.player1Id === currentUser.value.id || game.value.player2Id === currentUser.value.id
    })

    // Check if user is the opponent (for pending games)
    const isOpponent = computed(() => {
        if (!game.value || !currentUser.value) return false

        return (
            game.value.status === GameStatus.PENDING &&
            ((game.value.player2Id === currentUser.value.id && game.value.createdBy === game.value.player1Id) ||
                (game.value.player1Id === currentUser.value.id && game.value.createdBy === game.value.player2Id))
        )
    })

    // Check if the game status allows submitting results
    const canSubmitResult = computed(() => {
        if (!game.value) return false
        return game.value.status === GameStatus.SCHEDULED
    })

    // Check if user can record the result
    const canRecordResult = computed(() => {
        if (!game.value || !isPlayer.value) return false
        return game.value.status === GameStatus.PENDING || game.value.status === GameStatus.SCHEDULED
    })

    // Check if a player is the winner
    const isWinner = (game: any, playerId: string) => {
        return game.status === GameStatus.COMPLETED && game.winnerId === playerId
    }

    // Check if a player is the current user
    const isCurrentUserPlayer = (playerId: string) => {
        return currentUser.value && String(currentUser.value.id) === playerId
    }

    return {
        isPlayer,
        isOpponent,
        canSubmitResult,
        canRecordResult,
        isWinner,
        isCurrentUserPlayer,
    }
}
