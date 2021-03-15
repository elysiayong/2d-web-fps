class HUD{
    constructor(stage, player, spritesheet){
        this.stage = stage;
        this.player = player;
        this.spritesheet = spritesheet;
        this.currWeaponInd = 0;
        this.healthBar = new HealthBar(stage);
        this.miniMap = new MiniMap(stage);
        this.hotBar = new HotBar(stage);
        this.inventory = new Inventory(stage);
    }

    step(){
        if(this.player.currWeapon){
            this.currWeaponInd = this.player.weapons.indexOf(this.player.currWeapon);
        }else{
            this.currWeaponInd = 0;
        }

        this.healthBar.step(this.stage);
    }

    draw(context){
        this.healthBar.draw(context);
        this.miniMap.draw(context, this.player);
        this.hotBar.draw(context, this.player, this.player.weapons, this.spritesheet, this.currWeaponInd);
        this.inventory.draw(context, this.player, this.player.inventory, this.spritesheet);
    }

}

class HealthBar{
    constructor(stage){
        this.stage = stage;
        this.rawHealth = this.stage.player.health;
        this.position = new Pair(this.stage.canvas.width/4, this.stage.canvas.height - (this.stage.canvas.height/16));
        this.maxHealth = this.stage.canvas.width/2;
        this.currHealth = this.rawHealth / 100 * this.maxHealth;
    }

    step(){
        this.rawHealth = this.stage.player.health;
        this.currHealth = this.rawHealth / 100 * this.maxHealth;
    }

    draw(context){
        context.save();
        context.translate(this.stage.player.camX, this.stage.player.camY);
        context.lineWidth = 2;
        context.strokeStyle = "#333";
        context.fillStyle = 'rgba(0, 255, 0, 0.85)';
        context.fillRect(this.position.x, this.position.y, this.currHealth, 20);
        context.strokeRect(this.position.x, this.position.y, this.maxHealth, 20);
        context.fillStyle = 'white';
        context.font = '18px JoyStix';
        context.fillText(this.rawHealth + '/' + '100', this.maxHealth - 48, this.position.y + 16);
        context.restore();
    }

}

class Inventory{
    constructor(stage){
        this.stage = stage;
    }

    draw(context, player, inventory, spritesheet){
        context.save();
        context.translate(player.camX, player.camY);
        var i = 0;
        for(var item in inventory){
            var numItems = inventory[item].length;
            context.lineWidth = 2;
            context.strokeStyle = "yellow";
            context.strokeRect((i * 64), this.stage.canvas.height - 64, 64, 64);
            spritesheet.draw(context, this.stage.consumablesImage[item].x, this.stage.consumablesImage[item].y, (i * 64), this.stage.canvas.height - 64);
            context.fillStyle = 'white';
            context.font = '10px JoyStix';
            context.fillText(numItems, (i * 64) + 48, this.stage.canvas.height - 5);
            i++;
        }
        context.restore();
    }

}


class MiniMap{
    constructor(stage){
        this.stage = stage;
    }

    draw(context, player){
        context.save();
        context.translate(player.camX, player.camY);
        context.transform(0.06, 0, 0, 0.06, 
            this.stage.canvas.width-(0.06 * this.stage.width), this.stage.canvas.height-(0.06*this.stage.height));
        context.lineWidth = 2;
        context.strokeStyle = "#333";
        context.fillStyle = 'rgba(0, 150, 0, 0.6)';
        context.fillRect(0, 0, this.stage.width, this.stage.height);
        context.strokeRect(0, 0, this.stage.width, this.stage.height);
        
        for(var i = 0; i < this.stage.actors.length; i++){
            this.stage.actors[i].draw(context);
        }
        player.draw(context);
        context.resetTransform();
        context.restore();

    }

}

class HotBar{
    constructor(stage){
        this.stage = stage;
        this.width = this.stage.canvas.width/2;
        this.height = this.stage.canvas.height;
    }

    draw(context, player, weapons, spritesheet, currWeaponInd){
        context.save();
        context.translate(player.camX, player.camY);

        for(var i = 0; i < 3; i++){
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.strokeRect(this.width + (i * 64) - 96, 0, 64, 64);
            context.fillStyle = 'white';
            context.font = '10px JoyStix';
            context.fillText(i+1, this.width + (i * 64) - 48, 56);
        }

        for(var i = 0; i < weapons.length; i++){
            var img = weapons[i].imgPos;
            spritesheet.draw(context, img.x, img.y, this.width + (i * 64) - 96, 0);
        }
        
        context.lineWidth = 2;
        context.strokeStyle = "red";
        context.strokeRect(this.width + (currWeaponInd * 64) - 96, 0, 64, 64);
        context.font = '18px JoyStix';
        context.fillStyle = 'white';
        if(player.currWeapon){
            context.fillText("AMMO: " + player.currWeapon.ammo, this.width/3 + 80, this.height - 40);
        }else{
            context.fillText("AMMO: 0", this.width/3 + 80, this.height - 40);
        }
        context.restore(); 

    }

}