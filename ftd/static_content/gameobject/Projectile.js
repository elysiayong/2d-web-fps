class PistolBullet extends ProjectileObject{
    constructor(stage, player, spritesheet){

        super(stage, player, 20, 20, 300, spritesheet, 10);
        this.setImgPos(new Pair(8, 1));
    }
}