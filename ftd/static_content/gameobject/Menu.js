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

        }else if(this.gameState == "loss"){

        }else if(this.gameState == "won"){

        }else{

        }

    }



}