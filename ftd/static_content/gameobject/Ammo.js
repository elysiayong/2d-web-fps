class PistolAmmo extends AmmoObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.imgPos = new Pair(7, 2);
        this.ammoAmount = 10;
        this.id = 'ammo1';
    }
}

class ShotgunAmmo extends AmmoObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.imgPos = new Pair(7, 3);
        this.ammoAmount = 24;
        this.id = 'ammo2';
    }
}

class MachineGunAmmo extends AmmoObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.imgPos = new Pair(7, 4);
        this.ammoAmount = 30;
        this.id = 'ammo3';
    }
}
