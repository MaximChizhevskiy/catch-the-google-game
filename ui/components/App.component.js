import {
    GAME_STATUSES
} from "../../core/constants.js"
import {
    getGameStatus
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

export function AppComponent() {
    const element = document.createElement('div')

    render(element)
    return {
        element
    }
}

async function render(element) {
    const gameStatus = await getGameStatus()
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
            const gridComponent = GridComponent()
            element.append(settingsComponent.element, resultPanelComponent.element,
                gridComponent.element)
            break
        }
        case GAME_STATUSES.LOSE: {
            const loseComponent = LoseComponent()
            element.append(loseComponent.element)
            break
        }
        default:
            throw new Error('not implemented')
    }

}