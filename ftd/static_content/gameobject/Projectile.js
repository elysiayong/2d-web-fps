class PistolBullet extends ProjectileObject{
    constructor(stage, weapon, player, spritesheet){

        super(stage, weapon, player, 20, 50, 500, spritesheet, 10);
        this.setImgPos(new Pair(8, 1));
    }
}