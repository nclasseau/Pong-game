import express from 'express';
const app = express();
import http from 'http'
import { Server } from 'socket.io';
import cors from 'cors';
import { paddle1, paddle2, ball, score1, score2, size } from './variables.mjs'

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    },
});

let user = 0;
let roomNumber = 0;
let playersId = [];
let players = []
const chunkSize = 2;

io.on('connection', (socket) => {
    console.log('user connected')
    user++
    console.log(user)

    //push chaque connecté dans le tableau 
    playersId.push(socket.id)

    //new room each 2 person
    if (user % 2 === 1) {
        roomNumber += 1
    }

    socket.join(roomNumber);
    io.to(roomNumber).emit('data', paddle1, paddle2, ball)

    socket.emit('room', (roomNumber))

    //chunk array every 2 connections 
    for (let i = 0; i < playersId.length; i += chunkSize) {
        const chunk = playersId.slice(i, i + chunkSize)
        players.push(chunk)

    }

    //paddle movement
    socket.on('movePaddle', ({ direction, room }) => {

        players.map(id => {
            console.log(id)
            console.log(socket.id)
            if (socket.id === id[0]) {
                movePaddle('p1', direction, paddle1, room)
            }
            if (socket.id === id[1]) {
                movePaddle('p2', direction, paddle1, room)
            }
        })


        // if (socket.id === playersId[0]) {
        //     movePaddle('p1', direction, paddle1, room)
        // }
        // if (socket.id === playersId[1]) {
        //     movePaddle('p2', direction, paddle2, room)
        // }
    })

    socket.on('restart', (room) => {
        startGame(room)
    })
})

//move paddles with arrow keys 
const movePaddle = (player, direction, paddle, roomNumber) => {
    if (direction === 'up') {
        paddle.y -= 25;
        if (paddle.y < 0) paddle.y = 0
    }

    if (direction === 'down') {
        paddle.y += 25;
        if (paddle.y + paddle.height > size.height) paddle.y = size.height - paddle.height
    }
    //lui passer room en question
    io.to(roomNumber).emit(`${player}Moved`, (paddle.y))
}

//move balls
const moveBall = (ball, paddle1, paddle2, score1, score2, roomNumber) => {
    ball.x += ball.vx;
    ball.y += ball.vy;

    let newBallX = ball.x + ball.vx;
    let newBallY = ball.y + ball.vy;

    // faire rebondir la balle sur le mur Est
    // on utilise le ball.radius pour faire rebondir la balle des qu'elle touche le mur
    //faire rebondir la balle sur le paddle
    if (newBallX >= (size.width - ball.radius) - paddle1.width) {
        // ball.vx += 1
        if (newBallY < paddle2.y || newBallY > paddle2.y + 100) {
            score2.score++
            resetPosition()
            if (score2.score === 5) {
                clearInterval(interval)
                score1.score = 0;
                score2.score = 0;
            }
        } else {
            ball.vx = -ball.vx
        }
    }

    // faire rebondir la balle sur le mur Ouest 
    // faire rebondir balle sur le paddle
    if (newBallX <= paddle1.width + ball.radius) {
        // ball.vx += 1
        if (newBallY < paddle1.y || newBallY > paddle1.y + 100) {
            score1.score++
            resetPosition()
            if (score1.score === 5) {
                clearInterval(interval)
                score1.score = 0;
                score2.score = 0;
            }
        } else {
            ball.vx = -ball.vx
        }
    }

    // faire rebondir la balle sur le mur Sud 
    if (newBallY >= size.height - ball.radius) {
        ball.vy = -ball.vy
    }

    // faire rebondir la balle sur mur Nord 
    if (newBallY <= ball.radius) {
        ball.vy = -ball.vy
    }

    io.to(roomNumber).emit('ballMoved', ball.x, ball.y)
    io.to(roomNumber).emit('score', score1, score2)
};

let interval;
const startGame = (room) => {
    interval = setInterval(() => { moveBall(ball, paddle1, paddle2, score1, score2, room) }, 10)
}

const resetPosition = () => {
    ball.x = 300

    paddle1.y = 80

    paddle2.y = 80

}


//server listen
server.listen(3001, () => {
    console.log('Server is running on 3001')
});