class ConsumableObject extends PickUpObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.id = null;
        this.player = null;
    }

    drop(){
        // consumables drop on death
        this.position = new Pair(this.player.position.x, this.player.position.y);
        this.player.removeObject(this, this.player.inventory[this.id]);
        this.stage.addActor(this);
    }


    pickUp(entity){
        // add to player
        if(entity){
            this.player = entity;
            // add to entity inventory
            entity.inventory[this.id].push(this);
            this.stage.removeActor(this);
        }
    }

    consume(entity){}

}