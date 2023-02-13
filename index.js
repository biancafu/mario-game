const canvas = document.querySelector('canvas');
//c = canvas context
const c = canvas.getContext('2d');

canvas.width = window.innerWidth; //don't need window. can just use innerWidth
canvas.height = innerHeight;

const gravity = 0.5;

class Player {
    constructor() {
        //setting position of Player
        this.position = {
            x:100,
            y:100
        };

        this.velocity = {
            x: 0,
            y: 0 //positive will push element down (top = 0)
        }
        //setting size of Player
        this.width = 30;
        this.height = 30;


    }

    draw() {
        //define the look of Player
        c.fillStyle="red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    //updates player's property 
    update() {
        this.draw(); 
        this.position.x += this.velocity.x; 
        this.position.y += this.velocity.y; 

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            //if y position + player height + velocity < bottom this means its above ground => gravity
            this.velocity.y += gravity; //accerlerating overtime
        } else {
            //on ground => no gravity
            this.velocity.y = 0;
        }
    }
};

class Platform {
    constructor({x, y}) {
        this.position = {
            x,
            y
        }

        this.width = 200;
        this.height = 20;
    }

    draw() {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
};

//creating our player
const player = new Player();
const platforms = [new Platform({x: 200, y: 100}), new Platform({x: 500, y: 600})];

//monitoring pressed keys for x position movements
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};

//win scenario
let scrollOffset = 0;


//recursive function to generate animation  of player by constantly updating and drawing player
function animate() {
    requestAnimationFrame(animate);
    //(starting x, starting y, to x, to y)
    c.clearRect(0, 0, canvas.width, canvas.height); //clearing canvasand allow us to call draw right after
    player.update();
    platforms.forEach(platform => platform.draw());

    //update velocity to change position x of player
    // add in condition to limit where player can move
    if(keys.right.pressed && player.position.x < 400) {
        console.log(player.position.x, "<400")

        player.velocity.x = 5;
     } else if (keys.left.pressed && player.position.x > 50) {
        console.log(player.position.x, ">50")
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            scrollOffset += 5;
            platforms.forEach(platform => platform.position.x -= 5);
             //subtract at same rate as velocity to create the illusion of movement for player
        } else if (keys.left.pressed && scrollOffset >= 0) {
            scrollOffset -= 5;
            platforms.forEach(platform => platform.position.x += 5);
        }
    }
    //platform collision detection
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y //+ platform.height //bottom of player taller than bottom of platform (?)
        && player.position.y + player.height + player.velocity.y >= platform.position.y //jumping above the top of platform
        && player.position.x + player.width >= platform.position.x //right side of player >= left side of platform => stays on top
        &&  player.position.x <= platform.position.x + platform.width // left side of player >= right side of platform => falls
        ) {
        player.velocity.y = 0; //stop player movement
        }
    });

    //win condition
    if (scrollOffset > 2000) {
        console.log('you win');
    }
    
}

animate();

addEventListener('keydown', ({ keyCode }) => {
    switch(keyCode) {
        case 37:
        case 65:
            keys.left.pressed = true;
            break;
        // case 83:
        //     console.log("down");
        //     break;
        case 39:
        case 68:
            keys.right.pressed = true;
            break;
        case 32:
            player.velocity.y -= 20;
            break;
    }
}); //window.addeventListener()

addEventListener('keyup', ({ keyCode }) => {
    switch(keyCode) {
        case 37:
        case 65:
            keys.left.pressed = false;
            break;
        // case 83:
        //     console.log("down");
        //     break;
        case 39:
        case 68:
            keys.right.pressed = false;
            break;
        case 32:
            player.velocity.y -= 1;
            break;
    }
});

