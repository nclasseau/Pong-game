const draw = (context, size, ball) => {

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
}

export default draw;
