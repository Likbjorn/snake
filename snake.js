const WIDTH = 40,
    HEIGHT = 40,
    SCALE = 10,
    PADDING = 1,
    TICKRATE = 200;

let canvas, ctx, scorePar;

let snake, food;
let alive = true;
let score = 0;

canvas = document.getElementById("canvas");
canvas.width = WIDTH*SCALE;
canvas.height = HEIGHT*SCALE;
ctx = canvas.getContext("2d");

scorePar = document.getElementById("score");

class Snake {
    constructor() {
        this.direction = "up";
        this.lastDirection = "up";
        this.body = [{x: 20, y: 20}];
        this.ctx = ctx;
        this.belly = 0;
    }

    move() {
        let head = {x: null, y: null};
        switch(this.direction) {
            case "up":
                head.x = this.body[0].x;
                head.y = this.body[0].y - 1;
                break;
            case "down":
                head.x = this.body[0].x;
                head.y = this.body[0].y + 1;
                break;
            case "left":
                head.x = this.body[0].x - 1;
                head.y = this.body[0].y;
                break;
            case "right":
                head.x = this.body[0].x + 1;
                head.y = this.body[0].y;
                break;
        }

        head.x = head.x < 0 ? WIDTH - 1 : head.x;
        head.x = head.x >= WIDTH ? 0 : head.x;
        head.y = head.y < 0 ? HEIGHT - 1 : head.y;
        head.y = head.y >= HEIGHT ? 0 : head.y;

        this.body.unshift(head);
        if (this.belly < 1) {
            this.body.pop();
        } else {
            this.belly -= 1;
        }

        this.lastDirection = this.direction;
    }

    draw() {
        this.body.forEach( function(square) {
            drawRect(square.x, square.y);
        });
    }

    eat(food) {
        this.belly += food.value;
    }

}

class Food {
    constructor() {
        this.x = Math.floor(Math.random()*WIDTH);
        this.y = Math.floor(Math.random()*HEIGHT);
        this.value = 1;
        this.color = "green";
    }

    draw() {
        drawRect(this.x, this.y, this.color);
    }
}

function updateScore() {
    score += 1;
    scorePar.innerHTML = score;
}

function drawRect(x, y, color="black") {
    ctx.fillStyle = color;
    ctx.fillRect(
        SCALE*x + PADDING,
        SCALE*y + PADDING,
        SCALE - PADDING,
        SCALE - PADDING);
}

function clear() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, WIDTH*SCALE, HEIGHT*SCALE);
}

function init() {
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, WIDTH*SCALE, HEIGHT*SCALE);
    snake = new Snake();
    food = new Food();
    snake.draw();
    food.draw();

    document.addEventListener("keydown", function(event) {
        if(event.keyCode == 37 && snake.lastDirection != "right") {
            snake.direction = "left";
        }
        else if(event.keyCode == 39 && snake.lastDirection != "left") {
            snake.direction = "right";
        }
        else if(event.keyCode == 38 && snake.lastDirection != "down") {
            snake.direction = "up";
        }
        else if(event.keyCode == 40 && snake.lastDirection != "up") {
            snake.direction = "down";
        }
    });
}

async function tick() {
    while (alive) {
        clear();
        if (food.x === snake.body[0].x && food.y === snake.body[0].y) {
            snake.eat(food);
            updateScore();
            food = new Food();
        }
        food.draw();
        snake.move();
        snake.draw();
        for (let i = 1; i < snake.body.length; i++) {
            if (snake.body[i].x == snake.body[0].x &&
                snake.body[i].y == snake.body[0].y) {
                alive = false;
            }
        }
        await sleep(TICKRATE);
    }
}

async function sleep(tickrate) {
    await new Promise(r => setTimeout(r, tickrate));
}

init();
tick();
