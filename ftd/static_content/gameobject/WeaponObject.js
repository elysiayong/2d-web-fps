class WeaponObject extends GameObject{
    constructor(stage, position, spritesheet){
        super(stage, position, null, null, spritesheet);
        this.equipped = false;
        this.weaponType = null;
        this.ammo = 0;
        this.maxProj = 1;
        this.numProj = 0;
        this.canFire = true;
    }

    updateNumProj(){
        if(this.numProj >= this.maxProj){
            this.canFire = false;
        }else{
            this.canFire = true;
        }
    }

    setMaxProj(maxProj){
        this.maxProj = maxProj;
    }

    setType(weaponType){
        this.weaponType = weaponType;
    }

    setAmmoAmt(ammo){
        this.ammo = ammo;
    }

    drop(){
        if(this.id){
            this.id = null;
        }
    }
    fire(){}
    draw(){}
}