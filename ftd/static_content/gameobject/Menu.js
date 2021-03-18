class Menu{

    constructor(stage, player){

        this.stage = stage;
        this.player = player;
    }


    draw(context){
        if(this.stage.gameState == 'pause'){
            context.save();
            context.translate(this.player.camX, this.player.camY);
            context.font = '18px JoyStix';
            context.fillStyle = 'white';
            context.fillText("PAUSE", this.stage.canvas.width/2 - 36, this.stage.canvas.height/2);
            context.restore(); 

        }else if(this.stage.gameState == "loss"){
            context.save();
            context.translate(this.player.camX, this.player.camY);
            context.rect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
            context.fillStyle = 'rgba(0, 0, 0, 0.8)';
            context.fill();
            context.font = '24px JoyStix';
            context.fillStyle = 'red';
            context.fillText("YOU DIED", this.stage.canvas.width/2 - 80, this.stage.canvas.height/2);
            context.restore(); 

        }else if(this.stage.gameState == "win"){
            context.save();
            context.translate(this.player.camX, this.player.camY);
            context.rect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
            context.fillStyle = 'rgba(0, 0, 0, 0.8)';
            context.fill();
            context.font = '24px JoyStix';
            context.fillStyle = 'white';
            context.fillText("You won!!!! :)", this.stage.canvas.width/2 - 150, this.stage.canvas.height/2);
            context.restore(); 
        }

    }



}