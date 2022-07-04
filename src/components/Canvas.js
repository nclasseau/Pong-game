import '../styles/styles.css'
import { useRef, useEffect } from "react";
import draw from "./Draw";

const Canvas = () => {
    const canvasRef = useRef(null);
    const requestAnimationRef = useRef(null);
    const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3, radius: 10 });
    const size = { width: 600, height: 300 };
    const paddle1Ref = useRef({ height: 100, width: 10, x: 10, y: 80 });
    const paddle2Ref = useRef({ height: 100, width: 10, x: 580, y: 80 });
    const score1Ref = useRef({ score: 0 })
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
        let newBallY = ball.y + ball.vy

        // console.log(ball.y)

        // faire rebondir la balle sur le mur Est
        // on utilise le ball.radius pour faire rebondir la balle des qu'elle touche le mur
        //faire rebondir la balle sur le paddle
        if (newBallX >= (size.width - ball.radius) - paddle1.width) {
            if (newBallY < paddle2.y || newBallY > paddle2.y + 100) {
                score2.score++
            } else {
                ball.vx = -ball.vx
            }
        }

        // faire rebondir la balle sur le mur Ouest 
        // faire rebondir balle sur le paddle
        if (newBallX <= paddle1.width + ball.radius) {
            if (newBallY < paddle1.y || newBallY > paddle1.y + 100) {
                score1.score++
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

        console.log(score1, score2)

    };

    // set variable a false, les touches ne sont pas enfoncees 
    let upArrowPressed = false;
    let downArrowPressed = false;

    //event paddle

    // event lorsque l'on appuie sur la touche ( on stock la variable a true)
    const keyTouchHandler = (e) => {
        // 38 correspond au keycode fleche du haut 
        // 40 correpond au keycode fleche du bas 
        if (e.keyCode === 38) {
            upArrowPressed = true;
        } else if (e.keyCode === 40) {
            downArrowPressed = true
        }
    }

    // event lorsque l'on n'appuie plus sur la touche ( on stock la variable a false)
    const keyRemoveHandler = (e) => {
        if (e.keyCode === 38) {
            upArrowPressed = false;
        } else if (e.keyCode === 40) {
            downArrowPressed = false;
        }
    }

    // paddle 1
    const movePaddle1 = () => {
        const paddle1 = paddle1Ref.current;
        const paddle2 = paddle2Ref.current

        // si touche arrowup enfoncee, deplacer le paddle de 3px sur axe y 
        if (upArrowPressed) {
            console.log('up')
            paddle1.y -= 3
            paddle2.y -= 3
            // empeche le paddle de depasser le canvas
            if (paddle1.y < 0) {
                paddle1.y = 0
                paddle2.y = 0
            }
        }
        if (downArrowPressed) {
            console.log('down')
            paddle1.y += 3
            paddle2.y += 3

            if (paddle1.y + paddle1.height > size.height) {
                paddle1.y = size.height - paddle1.height
                paddle2.y = size.height - paddle2.height
            }
        }
    }




    const renderDraw = () => {
        const ctx = canvasRef.current.getContext("2d");
        moveBall();
        movePaddle1();
        draw(ctx, size, ballRef.current, paddle1Ref.current, paddle2Ref.current, score1Ref.current, score2Ref.current);

    };

    const effect = () => {
        renderDraw();
        requestAnimationRef.current = requestAnimationFrame(effect);
    };

    useEffect(() => {
        // paddle
        window.addEventListener('keydown', keyTouchHandler, false);
        window.addEventListener('keyup', keyRemoveHandler, false)


        // animationFrame permet de setInterval et donc de deplacer objets 
        requestAnimationRef.current = requestAnimationFrame(effect);
        return () => {
            window.removeEventListener('keydown', keyTouchHandler);
            window.removeEventListener('keyup', keyRemoveHandler);
            cancelAnimationFrame(requestAnimationRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} {...size} id='canva' />;
}

export default Canvas;
