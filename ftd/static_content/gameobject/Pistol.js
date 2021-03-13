class Pistol extends WeaponObject{
    constructor(stage, player, position, spritesheet){
        super(stage, position, spritesheet);

        this.player = player;
        this.setType(this);
        this.setAmmoAmt(25);
        this.setMaxProj(1);

    }

    fire(){
        console.log(this.canFire);
        if(this.canFire){
            var projectile = new PistolBullet(this.stage, this.player, this.spritesheet);
            projectile.setID(this.id);
            this.numProj++;
            this.updateNumProj();

            this.stage.addActor(projectile);
        }

    }
}