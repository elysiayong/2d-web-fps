class ObstacleObject extends GameObject{
    constructor(stage, position, colour, radius, spritesheet){
        super(stage, position, colour, radius, spritesheet);
        this.id = 'obstacle';
        this.health = 50;
        this.invincible = false;
        this.stash = []; // TODO: obstacles drop PickUpObjects
    }

    drop(){

    }
    
    takeDamage(dmg){
        if(this.active && !this.invincible){
            this.health-=dmg;
            if(this.health <= 0){
                this.active=false;
                this.stage.removeActor(this);
            }
        }
    }


}