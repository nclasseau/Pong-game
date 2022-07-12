import '../styles/styles.css'
import { useRef, useEffect, useState } from "react";
import draw from "./Draw";
import io from 'socket.io-client'

const url = 'http://127.0.0.1:3001'
const socket = io(url)


const Canvas = () => {

    //state
    const [isConnected, setIsConnected] = useState(false);
    const [ballX, setBallX] = useState(null)
    const [ballY, setBallY] = useState(null)
    const [score1, setScore1] = useState(null)
    const [score2, setScore2] = useState(null)
    const [paddle1Y, setPaddle1Y] = useState(null)
    const [paddle2Y, setPaddle2Y] = useState(null)

    // useRef
    const canvasRef = useRef(null);
    const requestAnimationRef = useRef(null);
    //player en question
    const playerRef = useRef('')



    //paddle, ball, size

    const size = {
        width: 600,
        height: 300
    }

    const paddle1 = {
        height: 100, width: 10, x: 10, y: paddle1Y
    }

    const paddle2 = {
        height: 100, width: 10, x: 580, y: paddle2Y
    }

    const ball = {
        x: ballX, y: ballY, vx: 3, vy: 3, radius: 10
    }


    //event paddle
    const movePaddle = (keyCode) => {
        if (keyCode === 38) {
            socket.emit('movePaddle', { direction: 'up', player: playerRef.current })

        }
        if (keyCode === 40) {
            socket.emit('movePaddle', { direction: 'down', player: playerRef.current })
        }
    }


    // //restart position 
    // const resetPosition = () => {
    //     setTimeout(() => {
    //         const ball = ballRef.current;
    //         const paddle1 = paddle1Ref.current;
    //         const paddle2 = paddle2Ref.current;

    //         ball.x = 300

    //         paddle1.y = 80
    //         paddle2.y = 80
    //     }, 1000)
    // }


    const renderDraw = () => {
        const ctx = canvasRef.current.getContext("2d");
        movePaddle();
        draw(ctx, size, ball, paddle1, paddle2, score1, score2);

    };

    const effect = () => {
        renderDraw();
        requestAnimationRef.current = requestAnimationFrame(effect);
    };

    useEffect(() => {
        // connect or disconnect
        socket.on('connect', () => {
            setIsConnected(true)
            //create or join rooms 
            socket.emit('create', 'room1')

        })

        socket.on('data', (paddle1, paddle2, ball) => {
            console.log(paddle1)
            console.log(paddle2)
            console.log(ball)

            setPaddle1Y(paddle1.y)
            setPaddle2Y(paddle2.y)
            setBallX(ball.x)
            setBallY(ball.y)
        })


        socket.on('disconnect', () => {
            setIsConnected(false)
        })

        //score
        socket.on('score1', (score1) => {
            setScore1(score1)
        })
        socket.on('score2', (score2) => {
            setScore2(score2)
        })


        // //paddle1 and 2 moved 
        // socket.on('paddle1Moved', (y) => {
        //     setPaddle1Y(y)
        // })

        // socket.on('paddle2Moved', (y) => {
        //     setPaddle2Y(y)
        // })

        // //ball moved 
        // socket.on('ballMoved', (x, y) => {
        //     setBallX(x);
        //     setBallY(y)
        // })


        // animationFrame permet de setInterval et donc de deplacer objets 
        requestAnimationRef.current = requestAnimationFrame(effect);


        return () => {
            //socket off
            socket.off()

            //animationFrame
            cancelAnimationFrame(requestAnimationRef.current);
        };
    }, []);

    return (
        <>
            <p>Connected: {'' + isConnected}</p>
            <canvas ref={canvasRef} {...size} id='canva' />
        </>
    )
}

export default Canvas;
