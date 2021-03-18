class Pistol extends WeaponObject{
    constructor(stage, player, position, spritesheet){
        super(stage, position, spritesheet, player);
        this.ammo += 25;
        this.id = 'ammo1';
        this.fireRange = 500;
        this.setImgPos(new Pair(7, 11));
        this.setMaxProj(1);
    }

    fire(trajectory){
        if(this.canFire){
            var projectile = new PistolBullet(this.stage, this, this.player, this.spritesheet, this.fireRange);
            if(trajectory) projectile.setTrajectory(trajectory);
            projectile.setOID(this.oid);
            this.numProj++;
            if(this.player.oid == 'player'){
                this.ammo--;
            }
            this.stage.addActor(projectile);
        }
        this.updateFireStatus();

    }
}


class Shotgun extends WeaponObject{
    constructor(stage, player, position, spritesheet){
        super(stage, position, spritesheet, player);
        this.ammo += 48;
        this.id = 'ammo2';
        this.fireRange = 300;
        this.setImgPos(new Pair(7, 10));
        this.setMaxProj(3);
    }

    fire(trajectory){
        if(this.canFire){
            for(var i = -1; i < 2; i++){
                var projectile = new ShotgunBullet(this.stage, this, this.player, this.spritesheet, this.fireRange);
                if(trajectory) projectile.setTrajectory(trajectory);
                var angle = i * 10 * (Math.PI/180);
                var traj = projectile.trajectory;
                if(angle != 0){
                    var cos = Math.cos(angle);
                    var sin = Math.sin(angle);
                    var x = (traj.x * cos) - (traj.y * sin);
                    var y = (traj.x * sin) + (traj.y * cos);
                    projectile.adjustTrajectory(new Pair(Math.round(10000 * x) / 10000, Math.round(10000 * y) / 10000));
                }

                projectile.setOID(this.oid);
                this.numProj++;
                if(this.player.oid == 'player'){
                    this.ammo--;
                }
            
                this.stage.addActor(projectile);
            }
        }
        this.updateFireStatus();
    }
}


class MachineGun extends WeaponObject{
    constructor(stage, player, position, spritesheet){
        super(stage, position, spritesheet, player);
        this.ammo += 60;
        this.id = 'ammo3';
        this.fireRange = 600;
        this.setImgPos(new Pair(7, 12));
        this.setMaxProj(5);
    }

    fire(trajectory){
        if(this.canFire){
            // console.log(trajectory);
            var projectile = new MachineGunBullet(this.stage, this, this.player, this.spritesheet, this.fireRange);
            if(trajectory) projectile.setTrajectory(trajectory);
            projectile.setOID(this.oid);
            this.numProj++;
            if(this.player.oid == 'player'){
                this.ammo--;
            }

            this.stage.addActor(projectile);
        }
        this.updateFireStatus();

    }
}