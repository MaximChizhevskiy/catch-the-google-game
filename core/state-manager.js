import {
    renderApp
} from "../ui/index.js"

const _state = {
    settings: {
        /**
         * in milliseconds
         */
        googleJumpInterval: 2000,
        gridSize: {
            rowsCount: 5,
            columnsCount: 5
        },
        pointsToLose: 5,
        pointsToWin: 5
    },
    positions: {
        google: {
            x: 1,
            y: 1
        },
        players: [{
            x: 2,
            y: 2
        }, {
            x: 3,
            y: 3
        }]
    },
    points: {
        google: 0,
        players: [0, 0]
    }
}

//OBSERVER
let _observers = []
export function subscribe(observer) {
    _observers.push(observer)
}
export function unsubscribe(observer) {
    _observers = _observers.filter(o => o !== observer)
}

function _notifyObservers() {
    _observers.forEach(o => {
        try {
            o()
        } catch (error) {
            console.log(error);
        }
    });
}

function _generateIntegerNumber(min, max) {
    min = Math.ceil(min)
    max = Math.ceil(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function _getPlayerIndexByNumber(playerNumber) {
    const playerIndex = playerNumber - 1
    if (playerIndex < 0 || playerIndex > _state.points.players.length - 1) {
        throw new Error('Incorrect player number')
    }
    return playerIndex
}

function _jumpGoogleToNewPosition() {
    const newPosition = {
        ..._state.positions.google
    }

    do {
        newPosition.x = _generateIntegerNumber(0, _state.settings.gridSize.rowsCount - 1)
        newPosition.y = _generateIntegerNumber(0, _state.settings.gridSize.columnsCount - 1)

        var isNewPositionMatchWithCurrentGooglePosition =
            newPosition.x === _state.positions.google.x &&
            newPosition.y === _state.positions.google.y

        var isNewPositionMatchWithCurrentPlayer1Position =
            newPosition.x === _state.positions.players[0].x &&
            newPosition.y === _state.positions.players[0].y

        var isNewPositionMatchWithCurrentPlayer2Position =
            newPosition.x === _state.positions.players[1].x &&
            newPosition.y === _state.positions.players[1].y
    } while (isNewPositionMatchWithCurrentGooglePosition ||
        isNewPositionMatchWithCurrentPlayer1Position ||
        isNewPositionMatchWithCurrentPlayer2Position)

    _state.positions.google = newPosition
}

let googleJumpInterval

googleJumpInterval = setInterval(() => {
    _state.points.google++
    _jumpGoogleToNewPosition()
    _notifyObservers()    

    if(_state.points.google === _state.settings.pointsToLose) {
        clearInterval(googleJumpInterval)
    }
}, _state.settings.googleJumpInterval)

//  INTERFACE/ADAPTER
export async function getGooglePoints() {
    return _state.points.google
}
/**
 * @param {number} playerNumber - one-based index of player 
 * @returns {Promise<number>} of points
 */
export async function getPlayerPoints(playerNumber) {
    const playerIndex = _getPlayerIndexByNumber(playerNumber)
    return _state.points.players[playerIndex]
}

export async function getGridSize() {
    return {
        ..._state.settings.gridSize
    }
}

export async function getGooglePosition() {
    return {
        ..._state.positions.google
    }
}

export async function getPlayerPosition(playerNumber) {
    const playerIndex = _getPlayerIndexByNumber(playerNumber)
    return _state.positions.players[playerIndex]
}