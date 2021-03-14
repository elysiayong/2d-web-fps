class AmmoObject extends PickUpObject{
    constructor(stage, position, spritesheet){
        super(stage, position, spritesheet);
        this.ammoAmount = 0;
    }

    drop(){
        // entities can never drop ammo
        this.stage.addActor(this);
        this.setOID(null);
    }

    pickUp(entity){
        //if ammo exists in player inventory, destroy current object
        //replenish existing ammo
        if(entity){
            // replenish current weapon if present and matches
            if(entity.currWeapon && entity.currWeapon.id == this.id){
                entity.currWeapon.updateAmmoAmt(this.ammoAmount);
                entity.currWeapon.updateFireStatus(); 
                // remove ammo
                this.stage.removeActor(this);
            }else{
                // replenish ammo if weapon present in inventory
                // prevents ammo hoarding
                for(var i = 0; i < entity.weapons.length; i++){
                    if(entity.weapons[i].id == this.id){
                        entity.weapons[i].updateAmmoAmt(this.ammoAmount);
                        entity.currWeapon.updateFireStatus(); 
                        this.stage.removeActor(this);
                        break;
                    }
                }
            }
        }
    }

}
