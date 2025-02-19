import { EVENTS, GAME_STATUSES } from "./constants.js"

const _state = {
    gameStatus: GAME_STATUSES.SETTINGS,
    settings: {
        /**
         * in milliseconds
         */
        googleJumpInterval: 2000,
        gridSize: {
            rowsCount: 5,
            columnsCount: 5
        },
        pointsToLose: 3,
        pointsToWin: 3
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

function _notifyObservers(name, payload = {}) {
    const event = {
        name, payload 
    }
    _observers.forEach(o => {
        try {
            o(event)
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



//  INTERFACE/ADAPTER
export async function getGooglePoints() {
    return _state.points.google
}

let googleJumpInterval

export async function start() {
    if(_state.gameStatus !== GAME_STATUSES.SETTINGS) throw new Error(`Incorrect transition from "${_state.gameStatus}" to "${GAME_STATUSES.IN_PROGRESS}"`)

    _state.positions.players[0] = {x: 0, y: 0}
    _state.positions.players[1] = {x: _state.settings.gridSize.columnsCount -1,
         y: _state.settings.gridSize.rowsCount -1}
         _jumpGoogleToNewPosition()

    _state.points.google = 0
    _state.points.players = [0, 0]
         
    googleJumpInterval = setInterval(() => {
        const oldPosition = {..._state.positions.google}
        _jumpGoogleToNewPosition()
        _notifyObservers(EVENTS.GOOGLE_JUMPED, {
            oldPosition,
            newPosition: {..._state.positions.google}
        })
        _state.points.google++
        _notifyObservers(EVENTS.SCORES_CHANGED)
              
        if(_state.points.google === _state.settings.pointsToLose) {
            clearInterval(googleJumpInterval)
            _state.gameStatus = GAME_STATUSES.LOSE
            _notifyObservers(EVENTS.STATUS_CHANGED)
        }

    }, _state.settings.googleJumpInterval)

    _state.gameStatus = GAME_STATUSES.IN_PROGRESS
    _notifyObservers(GAME_STATUSES.STATUS_CHANGED)
    
}

export async function playAgain() {
    _state.gameStatus = GAME_STATUSES.SETTINGS
    _notifyObservers(GAME_STATUSES.STATUS_CHANGED)
}
/**
 * @param {number} playerNumber - one-based index of player 
 * @returns {Promise<number>} of points
 */
export async function getPlayerPoints(playerNumber) {
    const playerIndex = _getPlayerIndexByNumber(playerNumber)
    return _state.points.players[playerIndex]
}

export async function getGameStatus() {
    return _state.gameStatus
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