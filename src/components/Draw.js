const draw = (context, size, ball, paddle) => {

    // effacer les traces de la balle  
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
    const drawPaddle = (x, y, width, height, color) => {

        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = color;
        context.fill();
        context.closePath();

    }

    drawPaddle(paddle.x, paddle.y, paddle.width, paddle.height, 'blue')

}

export default draw;
