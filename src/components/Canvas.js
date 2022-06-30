import '../styles/styles.css'
import { useRef, useEffect } from "react";
import draw from "./Draw";

const Canvas = () => {
    const canvasRef = useRef(null);
    const requestAnimationRef = useRef(null);
    const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3, radius: 20 });
    const size = { width: 500, height: 300 };
    const paddle1Ref = useRef({ height: 100, width: 10, x: 10, y: 80 });


    // ball
    const moveBall = () => {
        const ball = ballRef.current;
        ball.x += ball.vx;
        ball.y += ball.vy;


        // faire rebondir la balle sur le mur est et ouest 
        // on utilise le ball.radius pour faire rebondir la balle des qu'elle touche le mur
        if (ball.x + ball.vx >= size.width - ball.radius) {
            ball.vx = -ball.vx
        }

        // faire rebondir la balle sur le mur ouest 
        if (ball.x + ball.vx <= ball.radius) {
            ball.vx = -ball.vx
        }

        // faire rebondir la balle sur le mur sud 
        if (ball.y + ball.vy >= size.height - ball.radius) {
            ball.vy = -ball.vy
        }

        // faire rebondir la balle sur mur nord 
        if (ball.y + ball.vy <= ball.radius) {
            ball.vy = -ball.vy
        }
    };

    //event paddle
    const handleKeyDown = (event) => {
        if (event.key === 'Down' || event.key === 'ArrowDown') {
            downPressed = true
        }
    }

    const handleKeyUp = (event) => {
        if (event.key === 'Up' || event.key === 'ArrowUp') {
            upPressed = true
        }
    }

    // paddle 1
    const movePaddle1 = () => {
        const paddle1 = paddle1Ref.current;

        if (downPressed) {
            paddle1.y += 3
        }
    }




    const renderDraw = () => {
        const ctx = canvasRef.current.getContext("2d");
        moveBall();
        draw(ctx, size, ballRef.current, paddle1Ref.current);

    };

    const effect = () => {
        renderDraw();
        requestAnimationRef.current = requestAnimationFrame(effect);
    };

    useEffect(() => {
        // paddle
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp)


        requestAnimationRef.current = requestAnimationFrame(effect);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(requestAnimationRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} {...size} id='canva' />;
}

export default Canvas;
