const _state = {
    settings: {
        gridSize: {
            rowsCount: 5,
            columnsCount: 5
        }
    },
    points: {
        google: 12,
        players: [10, 11]
    }
}

export async function getGooglePoints() {
    return _state.points.google
}

/**
 * 
 * @param {number} playerNumber - one-based index of player 
 * @returns {Promise<number>} of points
 */  
export async function getPlayerPoints(playerNumber) {
    const playerIndex = playerNumber - 1
    if (playerIndex < 0 || playerIndex > _state.points.players.length - 1){
        throw new Error('Incorrect player number')
    }
    return _state.points.players[playerIndex]
}

export async function getGridSize() {
    return {..._state.settings.gridSize}
}

