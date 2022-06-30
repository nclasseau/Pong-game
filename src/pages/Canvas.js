import '../styles/styles.css'
import { useRef, useEffect } from "react";
import draw from "./Draw";

const Canvas = () => {
    const canvasRef = useRef(null);
    const requestAnimationRef = useRef(null);
    const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3, radius: 20 });
    const paddle1Ref = useRef({ x: 20, y: 20 });
    const paddle2Ref = useRef({ x: 40, y: 40 });
    const size = { width: 500, height: 300 };

    const moveBall = () => {
        const ball = ballRef.current;
        ball.x += ball.vx;
        ball.y += ball.vy;

        console.log(ball.radius, ball.y)

        // faire rebondir la balle sur le mur sud
        if (ball.radius + ball.y >= size.height) {
            ball.vy = -ball.vy
        }

        // faire rebondir la balle sur le mur est
        if (ball.radius + ball.x >= size.width) {
            ball.vx = -ball.vx
        }

        // faire rebondir balle sur le mur nord
        if (ball.radius - ball.y >= size.height) {

        }


    };

    const renderDraw = () => {
        const ctx = canvasRef.current.getContext("2d");
        moveBall();
        draw(ctx, size, ballRef.current);
    };

    const effect = () => {
        renderDraw();
        requestAnimationRef.current = requestAnimationFrame(effect);
    };

    useEffect(() => {
        requestAnimationRef.current = requestAnimationFrame(effect);
        return () => {
            cancelAnimationFrame(requestAnimationRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} {...size} id='canva' />;
}

export default Canvas;
