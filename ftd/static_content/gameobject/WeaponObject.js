class WeaponObject extends PickUpObject{
    constructor(stage, position, spritesheet, player){
        super(stage, position, spritesheet);
        this.player = player;
        this.equipped = false;
        this.ammo = 0;
        this.maxProj = 1;
        this.numProj = 0;
        this.canFire = true;
        this.fireRange = 300;
    }

    pickUp(entity){
        if(!this.player){
            if(entity.weapons.length < 3){   
                this.player = entity;
                if(!this.player.currWeapon) {
                    this.player.currWeapon = this;
                }
                this.setOID(entity.oid);
                this.player.weapons.push(this);
                this.stage.removeActor(this);
                removeFrom(this.stage.weaponsLoc, this);
            }
        }
    }

    updateFireStatus(){
        if(this.numProj >= this.maxProj || this.ammo <= 0){
            if(this.ammo < 0) this.ammo = 0;
            this.canFire = false;
        }else{
            if(this.numProj < 0) this.numProj = 0; 
            this.canFire = true;
        }
    }

    setMaxProj(maxProj){
        this.maxProj = maxProj;
    }

    setAmmoAmt(ammo){
        this.ammo = ammo;
    }
    
    updateAmmoAmt(ammo){
        this.ammo += ammo;
    }

    drop(){
        if(this.player){
            this.position = new Pair(this.player.position.x, this.player.position.y);
            this.player.removeObject(this, this.player.weapons);
            this.player.currWeapon = null;
            this.player = null;
        }
        this.oid = null;
        this.stage.addActor(this);
    }


    fire(){}
}