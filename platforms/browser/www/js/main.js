const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const LANE_WIDTH = WIDTH/5;
const START_X = WIDTH/2;

let dentist;
let teethSpeed = 150;
let teeth = [];



let application = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    transparent: true,
});

window.app = application;

$('.app').append(application.view);

//Initialize Player(dentist)
dentist = new PIXI.Sprite.fromImage('/img/dentist.png');
dentist.anchor.set(0.5);
dentist.width = LANE_WIDTH;
dentist.height = LANE_WIDTH * 1.1;
dentist.x = WIDTH/2;
dentist.y = HEIGHT - dentist.height;
dentist.lane = 0;

//Initialize enemies(teeth)
for (var i = 0; i<4; i++) {
    var tooth = new PIXI.Sprite.fromImage('/img/tooth.png');
    tooth.anchor.set(0.5);
    tooth.x = WIDTH/2;
    tooth.y = getRandomIntInclusive(-HEIGHT/2, HEIGHT/3);
    tooth.width = LANE_WIDTH;
    tooth.height = LANE_WIDTH;
    tooth.lane = getRandomIntInclusive(-2, 2);
    
    teeth.push(tooth);
}

//add everything to the game
application.stage.addChild(dentist);

teeth.map(tooth => application.stage.addChild(tooth));



application.renderer.interactive = true;
application.renderer.plugins.interaction.on('pointerdown', move);


function move(click) {
    let isMoveLeft = click.data.global.x <= application.renderer.width / 2;
    
    if (isMoveLeft) {
        dentist.lane = Math.max(-4, dentist.lane - 1);
    } else {
        dentist.lane =  Math.min(4, dentist.lane + 1);    
    }
}

application.ticker.add(dt => gameLoop(dt));



function gameLoop(deltaTime) {
    //time in seconds
    let time = application.ticker.elapsedMS /1000;
    
    //update position of dentist
    dentist.x = laneToX(dentist.lane, 2);
    
  
    
    //move teeth from top to bottom
    teeth.map(tooth => {
        //reset teeth from bottom to top
        if (tooth.y > application.renderer.height + getRandomIntInclusive(1, 8) * tooth.height) {
            tooth.y = 0;
            tooth.lane = getRandomIntInclusive(-2, 2);
        }
        
        //Collision detection
        if(tooth.lane == (dentist.lane/2) && dentist.y - dentist.height/2 < tooth.y + tooth.height/2) {
            application.start();
        }
        
        tooth.x = laneToX(tooth.lane, 1);
        tooth.y += teethSpeed * time;
        
    })
    
    teethSpeed += 10 * time;
} 

function laneToX(lane, scale) {
    return START_X + LANE_WIDTH * (lane/scale);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min; 
}





