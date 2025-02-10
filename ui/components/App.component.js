import { GridComponent } from "./Grid/Grid.component.js"
import { ResultComponent } from "./ResultPanel/Result.component.js"
import { SettingsComponent } from "./Settings/Settings.component.js"

export function AppComponent() {
    const element = document.createElement('div')
    
    const settingsElement = SettingsComponent()
    const resultPanelElement = ResultComponent()
    const gridElement = GridComponent()
    

    element.append(settingsElement, resultPanelElement, gridElement)
    return element
}