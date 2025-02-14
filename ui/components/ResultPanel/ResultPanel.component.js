import { getGooglePoints, getPlayerPoints, subscribe } from "../../../core/state-manager.js"

export function ResultComponent() {
    const element = document.createElement('div')
    
    subscribe(() => {
        render(element) 
    })

    element.classList.add('result-panel')
          
    render(element)

    return {element}
}


async function render(element) {
    element.innerHTML = ''

    const googlePoints = await getGooglePoints(0)
    const player1Points = await getPlayerPoints(1)
    const player2Points = await getPlayerPoints(2)

    element.append(`Player1: ${player1Points}, Player2: ${player2Points}, Google: ${googlePoints}`)
}