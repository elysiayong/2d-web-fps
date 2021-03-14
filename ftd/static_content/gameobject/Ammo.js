class PistolAmmo extends AmmoObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.imgPos = new Pair(7, 2);
        this.ammoAmount = 25;
        this.id = 'ammo1';
    }
}