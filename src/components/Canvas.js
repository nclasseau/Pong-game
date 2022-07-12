import '../styles/styles.css'
import { useRef, useEffect, useState } from "react";
import draw from "./Draw";
import io from 'socket.io-client'


const Canvas = () => {
    //states
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(socket.connected)

    // useRef
    const canvasRef = useRef(null);
    const requestAnimationRef = useRef(null);
    const ballRef = useRef({ x: 300, y: 200, vx: 3, vy: 3, radius: 10 });
    const size = { width: 600, height: 300 };
    const paddle1Ref = useRef({ height: 100, width: 10, x: 10, y: 80 });
    const paddle2Ref = useRef({ height: 100, width: 10, x: 580, y: 80 });
    const score1Ref = useRef({ score: 0 });
    const score2Ref = useRef({ score: 0 });


    // ball
    const moveBall = () => {
        const ball = ballRef.current;
        const paddle1 = paddle1Ref.current;
        const paddle2 = paddle2Ref.current
        ball.x += ball.vx;
        ball.y += ball.vy;

        let score1 = score1Ref.current;
        let score2 = score2Ref.current;

        let newBallX = ball.x + ball.vx;
        let newBallY = ball.y + ball.vy;


        // faire rebondir la balle sur le mur Est
        // on utilise le ball.radius pour faire rebondir la balle des qu'elle touche le mur
        //faire rebondir la balle sur le paddle
        if (newBallX >= (size.width - ball.radius) - paddle1.width) {
            if (newBallY < paddle2.y || newBallY > paddle2.y + 100) {
                score2.score++
                resetPosition()
                if (score2.score === 5) {
                    alert('Game Over');
                    window.location.reload()
                }
            } else {
                ball.vx = -ball.vx
            }
        }

        // faire rebondir la balle sur le mur Ouest 
        // faire rebondir balle sur le paddle
        if (newBallX <= paddle1.width + ball.radius) {
            if (newBallY < paddle1.y || newBallY > paddle1.y + 100) {
                score1.score++
                resetPosition()
                if (score1.score === 5) {
                    alert('Game Over');
                    window.location.reload()
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

    };

    // appuie sur touche ou nn 
    const keycode = {};

    // const keyUp = () => {
    //     keycode[e.key] = true
    // }

    // const keyDown = () => {
    //     delete keycode[e.key] 
    // }


    //event paddle
    const movePaddle = () => {
        if (keycode['arrowUp']) socket.emit('move up')
        if (keycode['arrowDown']) socket.emit('move down')
    }



    //restart position 
    const resetPosition = () => {
        setTimeout(() => {
            const ball = ballRef.current;
            const paddle1 = paddle1Ref.current;
            const paddle2 = paddle2Ref.current;

            ball.x = 300

            paddle1.y = 80
            paddle2.y = 80
        }, 1000)
    }


    const renderDraw = () => {
        const ctx = canvasRef.current.getContext("2d");
        moveBall();
        movePaddle();
        draw(ctx, size, ballRef.current, paddle1Ref.current, paddle2Ref.current, score1Ref.current, score2Ref.current);

    };

    const effect = () => {
        renderDraw();
        requestAnimationRef.current = requestAnimationFrame(effect);
    };

    useEffect(() => {
        //socket
        const newSocket = io('http://localhost:3001')
        setSocket(newSocket)

        socket.on('connected', () => {
            setIsConnected(true);
        });

        socket.on('disconnected', () => {
            setIsConnected(false)
        })

        // animationFrame permet de setInterval et donc de deplacer objets 
        requestAnimationRef.current = requestAnimationFrame(effect);
        return () => {
            //socket
            socket.off('connect');
            socket.off('disconnect');

            cancelAnimationFrame(requestAnimationRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} {...size} id='canva' />;
}

export default Canvas;
