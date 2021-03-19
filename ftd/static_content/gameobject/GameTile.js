class GameTile{
    constructor(position, imgPos, spritesheet, speedAffect){
        this.position = position;
        this.imgPos = imgPos;
        this.spritesheet = spritesheet;
        this.speedAffect = speedAffect;
        this.radius = 32;
    }

    affectSpeed(entity){
        if(entity){
            entity.baseSpeed = entity.defaultSpeed * this.speedAffect;
        }
    }

    draw(context){
        this.spritesheet.draw(context, this.imgPos.x, this.imgPos.y, this.position.x, this.position.y);
    }
}

class GrassTile extends GameTile{
    constructor(position, spritesheet){
        super(position, new Pair(1, 1), spritesheet, 1);
    }
}

class MudTile extends GameTile{
    constructor(position, spritesheet){
        super(position, new Pair(1, 3), spritesheet, 0.75);
    }
}

class SandTile extends GameTile{
    constructor(position, spritesheet){
        super(position, new Pair(1, 2), spritesheet, 0.85);
    }
}

class WaterTile extends GameTile{
    constructor(position, spritesheet){
        super(position, new Pair(1, 4), spritesheet, 0.65);
    }
}