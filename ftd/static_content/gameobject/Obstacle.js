class Crate extends ObstacleObject{
    constructor(stage, position, spritesheet){
        super(stage, position, null, 64, spritesheet)
        this.imgPos = new Pair(2, 4);
        this.health = 50;
        this.stash = [new PistolAmmo(stage, position, spritesheet), new Pistol(stage, null, position, spritesheet)];
        this.setOID('crate');
        this.updateStash(this.oid);   
    }
}