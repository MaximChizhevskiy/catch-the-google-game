import express from 'express';
import { start, getGameStatus, getGooglePosition } from '../core/state-manager.js';


const app = express()
const port = 3000


app.get('/getGameStatus', async (req, res ) => {
    const gameStatus = await getGameStatus()
    res.send(gameStatus)
})

app.get('/getGooglePosition', async (req, res ) => {
    const googlePosition = await getGooglePosition()
    res.send(googlePosition)
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})