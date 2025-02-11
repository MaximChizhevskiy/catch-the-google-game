export function CellComponent(y, x) {
    const element = document.createElement('td')
    
    render(element, x, y)
    
    return {element}
}

async function render(element, x, y) {
    element.append(`${y}, ${x}`)

}