const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const LANE_WIDTH = WIDTH/5;
const START_X = WIDTH/2;




let application = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    transparent: true,
});


application.renderer.interactive = true;

$('.app').append(application.view);


var dentist = new PIXI.Sprite.fromImage('/img/dentist.png');
dentist.anchor.set(0.5);
dentist.width = LANE_WIDTH;
dentist.height = HEIGHT/10;
dentist.x = WIDTH/2;
dentist.y = HEIGHT - dentist.height;
dentist.lane = 0;

application.stage.addChild(dentist);




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
    dentist.x = START_X + LANE_WIDTH * (dentist.lane/2);
} 

