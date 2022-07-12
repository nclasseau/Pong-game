const draw = (context, size, ball, paddle, paddle2, score1, score2) => {

    // effacer les traces de la balle et du paddle 
    context.clearRect(0, 0, size.width, size.height);

    // dessiner la balle 
    const drawBall = (x, y, radius, color) => {

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.closePath();

    };

    drawBall(ball.x, ball.y, ball.radius, "red");


    // dessiner le paddle 
    const drawPaddle1 = (x, y, width, height, color) => {

        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = color;
        context.fill();
        context.closePath();

    }

    drawPaddle1(paddle.x, paddle.y, paddle.width, paddle.height, 'blue')

    // dessiner le paddle 
    const drawPaddle2 = (x, y, width, height, color) => {

        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = color;
        context.fill();
        context.closePath();

    }

    drawPaddle2(paddle2.x, paddle2.y, paddle2.width, paddle2.height, 'blue')

    // afficher score
    const drawScore = (ctx, score1, score2) => {
        ctx.font = '20px serif';
        ctx.fillText(`${score2.score} ${score1.score}`, 250, 20);
    }

    drawScore(context, score1, score2)

}

export default draw;
