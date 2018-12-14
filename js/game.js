class Menu extends Phaser.Scene{
    
    constructor ()
    {
        super('Menu');

        this.active;
        this.currentScene;
        
        this.menu;
    }
    
    preload() {
        this.load.image('menu', 'assets/menu.png');
        this.load.image('button', 'assets/play.png');         
    }
    
    create(){
        
        let menu = this.add.sprite(0, 0, 'menu');
        let button = this.add.sprite(0, 0, 'button');

        menu.setOrigin(0, 0);
        button.setOrigin(0, 0);
        
        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('Game'));
    }
    
}



let gameScene = new Phaser.Scene('Game');
let Over = new Phaser.Scene('Over');
var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Menu, gameScene,Over]

   
}; //ending of var config


let game = new Phaser.Game(config);


gameScene.preload = function() {
    console.log("preload called");
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(160, 200, 320, 50);
    /*creating the bottom pogress bar and box */
    var height = this.cameras.main.height;
    var width = this.cameras.main.width;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading CA1, touch the scene to move paddles',
        style: {
            font: '20px monospace',
            fill: '#00FF00'
            /*controls the colour, text font, text x,y location and width and height*/
        }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#0000FF'
            
        /*controls the percent of the loading screens, location width,height and colour*/
        }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
           /* controls the white loading bar that shows the loading pogress, controls the location,width, height,style and colour*/
        }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(170, 210, 300 * value, 30);
        //controls the white progress bar colour,location and load
    });
    /*controls the progress bars */

    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        //if refresh is pressed the destroy, will stop and reset all the pogress functions
    });

    this.load.image('logo', 'load.png');
    for (var i = 0; i < 300; i++) {
        this.load.image('logo' + i, 'load.png');
     /* controls the loading speed of the progrees bar that closer to 0 the faster the more further from 0 the slower*/
    }
    this.load.image('restartnew','assets/restartnew.png');
    this.load.image('GameOver','assets/GameOver.png');
    this.load.image('menu','assets/menu.png');
    this.load.image('field', 'assets/backgroundtest2.png');
    this.load.image('player1', 'assets/player1.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('player2', 'assets/enemy.png');
    this.load.image('restart','assets/restart.png');
    this.load.audio("music","assets/music.mp3")
    console.log("end preload");
} //ending of preloadGame

var cursors;
var ball;
var score=0;

gameScene.create = function() {
    soundName = this.sound.add("music");
    soundName.play();
    
    console.log("create called");
    this.add.image(300, 200, 'field');
//creates the field
    this.ball = this.physics.add.sprite(100, 100, 'ball');
    this.ball.setScale(1.5);

    console.log("create: " + this.ball);

    this.ball.setVelocity(200, 200);

    this.ball.body.bounce.x = 1;
    this.ball.body.bounce.y = 1;
    this.ball.body.collideWorldBounds = true;
/*physics for the ball controls the bounce */
    
    this.player1 = this.physics.add.sprite(50, 50, 'player1').setImmovable();
    this.player1.setScale(1.8);
    
    this.player2 = this.physics.add.sprite(600, 50, 'player2').setImmovable();
    this.player2.setScale(1.8);//sets scale and adds sprite
   
    cursors = this.input.keyboard.createCursorKeys();
    console.log(cursors.up.isDown);//mouse controls

    this.player1.body.collideWorldBounds = true;
    this.player2.body.collideWorldBounds = true;//world bounds collider

    this.physics.add.collider(this.ball, this.player1);
    this.physics.add.collider(this.ball, this.player2); //ball colider physics
    
    this.scoreText = this.add.text(270,40,'score:0',{
        fontSize: '25px',
        fill: '#ffffff'
    });
    
    //adds the score text

    timer = this.time.addEvent({
        delay: 800,
        loop: true,
        callback: scoreCounter,
        callbackScope: this
    });
    //adds a event and loops if true.
    
} //ending of creategame

function scoreCounter() {
    score++;
}
//increments the ball score

function resetBall(ball)
{
    console.log("reset: "+ ball);
    //this.ball.setVelocity(300,300);
    ball.setPosition(300,200);

}
//resets balls position.


gameScene.update = function() {
    console.log("update: "+ this.ball);
    // console.log(cursors.up.isDown);
        if(this.ball.x < 30)
            {
                console.log("Over scene called");
                 this.scene.start(Over);
                
            }
        
          if(this.ball.x > 610)
            {
                console.log("Over scene called");
                 this.scene.start(Over);
            }
    //ball reset
    if(this.input.activePointer.isDown){
        //mouse inputs
        this.input.on('pointermove', function(pointer)
        {
        this.player1.setPosition(50,pointer.y);
            this.player2.setPosition(600,pointer.y);
        },this);
    }   
    
    this.scoreText.setText("Score:" + score);
    console.log(score);
}//ending of update game

Over.create = function(){
    
        console.log("Over scene create");
    
            let menu = this.add.sprite(0, 0, 'GameOver');
        let button = this.add.sprite(0, 0, 'restartnew');
    
        this.scoreText = this.add.text(225,130,'Your Score:0',{
            fontSize: '25px',
            fill: '#ffffff'
        });
        this.scoreText.setText("Your Score:" + score);
        soundName.destroy();
    
    

        menu.setOrigin(0, 0);
        button.setOrigin(0, 0);
        
        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('Game'));
    //loads into a new scene GameOver and destroys the music
}//end of over



