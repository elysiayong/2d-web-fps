class ObstacleObject extends GameObject{
    constructor(stage, position, colour, radius, spritesheet){
        super(stage, position, colour, radius, spritesheet);
        this.id = 'obstacle';
        this.health = 100;
        this.stash = []; // TODO: obstacles have PickUpObjects
    }

    updateStash(oid){
        for(var i = 0; i < this.stash.length; i++){
            this.stash[i].setOID(oid);
            this.stash[i].position = new Pair(this.position.x + (i * 75), this.position.y);
        }
    }

    drop(){
        for(var i = 0; i < this.stash.length; i++){
            this.stash[i].drop();
        }
    }
    
    takeDamage(dmg){
        this.health-=dmg;
        if(this.health <= 0){
            this.drop();
            this.stage.removeActor(this);
        }
    }
}