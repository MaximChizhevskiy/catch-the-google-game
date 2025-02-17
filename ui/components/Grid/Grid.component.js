import { getGridSize, subscribe, unsubscribe } from "../../../core/state-manager.js"
import { CellComponent } from "./Cell/Cell.component.js"

export function GridComponent() {
    const element = document.createElement('table')
    element.classList.add('grid')
  
    const observer = () => {
        render(element)
    }
    subscribe(observer)

    render(element)
    
    return {element, cleanup: () => {
        unsubscribe(observer)
    }}
}

async function render(element) {
    element.innerHTML = ''
    const gridSize = await getGridSize()
    for (let x = 0; x < gridSize.rowsCount; x++) {
        const rowElement = document.createElement('tr')

        for (let y = 0; y < gridSize.columnsCount; y++) {
            const cellComponent = CellComponent(y, x)
            rowElement.append(cellComponent.element)
        }
        element.append(rowElement)
    }
       
}