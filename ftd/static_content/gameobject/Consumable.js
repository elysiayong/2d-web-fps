class HealthPack extends ConsumableObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.imgPos = new Pair(7, 5);
        this.health = 35;
        this.id = 'heal1';
    }

    consume(entity){
        if(entity.health + this.health >= 100){
            entity.health = 100;
        }else{
            entity.health += this.health;
        }
    }
}

class SpeedBoost extends ConsumableObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.imgPos = new Pair(7, 6);
        this.speedUp = 15;
        this.speedUpDuration = 180;
        this.id = 'speed1';
    }

    consume(entity){
        entity.baseSpeed = entity.defaultSpeed + this.speedUp;
        entity.boosted = true;
        entity.boostDuration = this.speedUpDuration;
    }
}


class ChugJug extends ConsumableObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.imgPos = new Pair(7,13);
        this.id = 'heal2';
    }

    consume(entity){
        entity.health = 100;
        entity.invincible = true;
        entity.iframes = 20;
    }
}