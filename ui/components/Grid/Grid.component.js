import { getGridSize, subscribe, unsubscribe } from "../../../core/state-manager.js"
import { CellComponent } from "./Cell/Cell.component.js"

export function GridComponent() {
    const localState = {cleanupFunctions: []} 
    const element = document.createElement('table')
    element.classList.add('grid')
  
    render(element, localState)
    
    return {element, cleanup: () => {
        localState.cleanupFunctions.forEach(cf => cf())
    }}
}

async function render(element, localState) {
    localState.cleanupFunctions.forEach(cf => cf());
    localState.cleanupFunctions = []
    
    element.innerHTML = ''
    const gridSize = await getGridSize()
    for (let x = 0; x < gridSize.rowsCount; x++) {
        const rowElement = document.createElement('tr')


        for (let y = 0; y < gridSize.columnsCount; y++) {
            const cellComponent = CellComponent(y, x)
            localState.cleanupFunctions.push(cellComponent.cleanup)
            rowElement.append(cellComponent.element)
        }
        element.append(rowElement)
    }
       
}