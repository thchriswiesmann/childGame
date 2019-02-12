const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const LANE_WIDTH = WIDTH/5;
const START_X = WIDTH/2;

let dentist;
let lives = 3;
let livesText, scoreText, restartText;
let score = 0;
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
dentist = new PIXI.Sprite.fromImage('/img/waschbaer_300.png');
dentist.anchor.set(0.5);
dentist.width = LANE_WIDTH;
dentist.height = LANE_WIDTH * 1.13;
dentist.x = WIDTH/2;
dentist.y = HEIGHT - dentist.height;
dentist.lane = 0;
dentist.immortal = false;

// Initialize UI
livesText = new PIXI.Text("xxx", {font: "bold 32px Roboto", fill: '#e74c3c'});
livesText.x = 0;

scoreText = new PIXI.Text("XX", {font: "bold 18px Roboto", fill: '#3f85e0'});
scoreText.x = 0;
scoreText.y = 50;

restartText = new PIXI.Text("Nochmal", {font: "bold 18px Roboto", fill: '#3f85e0'});
restartText.x = 0;
restartText.y = 50;
restartText.buttonMode = true;
restartText.interactive = true;
restartText.visible = false;
restartText.on('pointerdown', restart);




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
application.stage.addChild(scoreText);
application.stage.addChild(livesText);
application.stage.addChild(restartText);


application.renderer.interactive = true;
application.renderer.plugins.interaction.on('pointerdown', move);


function move(click) {
    let isMoveLeft = click.data.global.x <= dentist.x;
    
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
    
    //tint dentist in red when hit by tooth
    dentist.tint = dentist.immortal ? 0x8A0707 : 0xFFFFFF;
    
    // Update UI
    var text;
    if (lives > 0) {
        text = lives + "/3";
    } else {
        text = "GAME OVER!";
        

        time = 0;

        livesText.scale.x = 1.3;
        livesText.scale.y = 1.3;
        livesText.x = application.renderer.width / 2 - (livesText.width / 2);
        livesText.y = application.renderer.height / 2;

        scoreText.scale.x = 1.3;
        scoreText.scale.y = 1.3;
        scoreText.x = application.renderer.width / 2 - (scoreText.width / 2);
        scoreText.y = application.renderer.height / 2 + 50;
        
        restartText.visible = true;

    }
    
    livesText.text = text;
    
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
        if(tooth.lane == (dentist.lane/2) && dentist.y - dentist.height/2 < tooth.y + tooth.height/2 && !dentist.immortal && !(dentist.y + dentist.height/2 < tooth.y - tooth.height/2)) {
            lives--;
            if(lives > 0) {
                dentist.immortal = true;
                setTimeout(() => dentist.immortal = false, 1500);
            }
        }
        
        tooth.x = laneToX(tooth.lane, 1);
        tooth.y += teethSpeed * time;
        
    })
    
    score += 10 * time;
    teethSpeed += 10 * time;
    scoreText.text = "Punkte: " + Math.round(score);
} 

function laneToX(lane, scale) {
    return START_X + LANE_WIDTH * (lane/scale);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min; 
}

function restart() {
    lives = 3;
    restartText.visible = false;
    time = 0;
    teethSpeed = 150;
    
    teeth.map(tooth => {
        tooth.x = WIDTH/2;
        tooth.y = getRandomIntInclusive(-HEIGHT/2, HEIGHT/3);
        tooth.width = LANE_WIDTH;
        tooth.height = LANE_WIDTH;
        tooth.lane = getRandomIntInclusive(-2, 2);
    })
    
    livesText.x = 0;
    livesText.y = 0;
    livesText.scale.x = 1;
    livesText.scale.y = 1;
    
    scoreText.x = 0;
    scoreText.y = 50;
    scoreText.scale.x = 1;
    scoreText.scale.y = 1;
    
}





