import express from 'express';
import cors from 'cors';
import { start, getGameStatus, getGooglePosition, playAgain, getPlayerPosition, getGridSize, getPlayerPoints, getGooglePoints, movePlayer } from '../core/state-manager-server.js';


const app = express()
app.use(cors())

const port = 3000

app.get('/start', async (req, res) => {
    await start()
    res.send(200)
})

app.get('/playAgain', async (req, res) => {
    await playAgain()
})

app.get('/getPlayerPoints', async (req, res ) => {
    console.log(req)
    const playerPoints = await getPlayerPoints(req.query.playerNumber)
    console.log(req)
    res.send({data: playerPoints})
})

app.get('/getGooglePoints', async (req, res ) => {
    const googlePoints = await getGooglePoints()
    res.send({data: googlePoints})
})

app.get('/getGameStatus', async (req, res ) => {
    const gameStatus = await getGameStatus()
    res.send({data: gameStatus})
})

app.get('/getGridSize', async (req, res ) => {
    const gridSize = await getGridSize()
    res.send({data: gridSize})
})

app.get('/getGooglePosition', async (req, res ) => {
    const googlePosition = await getGooglePosition()
    res.send({data: googlePosition})
})

app.get('/getPlayerPosition', async (req, res ) => {
    const playerPosition = await getPlayerPosition(req.query.playerNumber)
    res.send({data: playerPosition})
})

app.get('/movePlayer', async (req, res ) => {
    await movePlayer(req.query.playerNumber, req.query.direction)
    res.send()
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})