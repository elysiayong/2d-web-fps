class PistolBullet extends ProjectileObject{
    constructor(stage, weapon, player, spritesheet, range){

        super(stage, weapon, player, 30, 50, range, spritesheet, 10);
        this.setImgPos(new Pair(8, 3));
    }
}


class ShotgunBullet extends ProjectileObject{
    constructor(stage, weapon, player, spritesheet, range){

        super(stage, weapon, player, 35, 30, range, spritesheet, 5);
        this.setImgPos(new Pair(8, 1));
    }
    
    adjustTrajectory(trajectory){
        this.trajectory = trajectory;
    }
}

class MachineGunBullet extends ProjectileObject{
    constructor(stage, weapon, player, spritesheet, range){

        super(stage, weapon, player, 35, 50, range, spritesheet, 5);
        this.setImgPos(new Pair(8, 2));
    }
}