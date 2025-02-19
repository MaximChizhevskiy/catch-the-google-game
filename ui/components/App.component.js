import {
    GAME_STATUSES
} from "../../core/constants.js"
import {
    getGameStatus,
    subscribe
} from "../../core/state-manager.js"
import {
    GridComponent
} from "./Grid/Grid.component.js"
import {
    LoseComponent
} from "./Lose/Lose.Component.js"
import {
    ResultComponent
} from "./ResultPanel/ResultPanel.component.js"
import {
    SettingsComponent
} from "./Settings/Settings.component.js"
import { StartComponent } from "./Start/Start.component.js"
import { WinComponent } from "./Win/Win.Component.js"

export function AppComponent() {
    const localState = {prevGameStatus: null, cleanupFunctions: []}

    const element = document.createElement('div')

    subscribe(() => {
        render(element, localState)
    })

    render(element, localState)
    return {
        element
    }
}

async function render(element, localState) {
    const gameStatus = await getGameStatus()
    
    if (localState.prevGameStatus === gameStatus) return
    localState.prevGameStatus = gameStatus

    localState.cleanupFunctions.forEach(cf => cf());
    localState.cleanupFunctions = []

    element.innerHTML = ''

    switch (gameStatus) {
        case GAME_STATUSES.SETTINGS: {
            const settingsComponent = SettingsComponent()
            const startComponent = StartComponent()
            element.append(settingsComponent.element, startComponent.element)
            break
        }
        case GAME_STATUSES.IN_PROGRESS: {
            const settingsComponent = SettingsComponent()
            const resultPanelComponent = ResultComponent()
            localState.cleanupFunctions.push(resultPanelComponent.cleanup)
            const gridComponent = GridComponent()
            localState.cleanupFunctions.push(gridComponent.cleanup)
            element.append(settingsComponent.element, resultPanelComponent.element,
                gridComponent.element)
            break
        }
        case GAME_STATUSES.LOSE: {
            const loseComponent = LoseComponent()
            element.append(loseComponent.element)
            break
        }
        case GAME_STATUSES.WIN: {
            const winComponent = WinComponent()
            element.append(winComponent.element)
            break
        }
        default:
            throw new Error('not implemented')
    }

}