class Crate extends ObstacleObject{
    constructor(stage, position, spritesheet){
        super(stage, position, null, 64, spritesheet)
        this.imgPos = new Pair(2, 4);
        this.health = 50;
        this.stash = [new PistolAmmo(stage, position, spritesheet), new HealthPack(stage, position, spritesheet)];
        if(randint(3) == 0){
            this.stash.push(new Pistol(stage, null, position, spritesheet));
        }
        this.setOID('crate');
        this.updateStash(this.oid);   
    }
}


class Barrel extends ObstacleObject{
    constructor(stage, position, spritesheet){
        super(stage, position, null, 64, spritesheet)
        this.imgPos = new Pair(2, 5);
        this.health = 70;
        this.stash = [new MachineGunAmmo(stage, position, spritesheet), new HealthPack(stage, position, spritesheet)];
        if(randint(3) == 0){
            this.stash.push(new MachineGun(stage, null, position, spritesheet));
        }
        this.setOID('barrel');
        this.updateStash(this.oid);   
    }
}


class Chest extends ObstacleObject{
    constructor(stage, position, spritesheet){
        super(stage, position, null, 64, spritesheet)
        this.imgPos = new Pair(2, 4);
        this.health = 60;
        this.stash = [new ShotgunAmmo(stage, position, spritesheet), new Shotgun(stage, null, position, spritesheet)];

        if(randint(5) == 0){
            this.stash.push(new ChugJug(stage, position, spritesheet));
        }

        this.setOID('chest');
        this.updateStash(this.oid);   
    }
}