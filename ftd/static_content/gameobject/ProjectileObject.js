class ProjectileObject extends GameObject{

    constructor(stage, weapon, player, radius, baseSpeed, range, spritesheet, damage){
        //currently has dummy vals
        super(stage, new Pair(0,0), 'rgba(0,0,0,1)', radius, spritesheet);
        this.player = player;
        this.weapon = weapon;
        this.spawnPos = new Pair(player.position.x - 16, player.position.y - 16);
        this.position = new Pair(player.position.x - 16, player.position.y - 16);

        var cursor = this.stage.getCursor(); 
        var relX = player.position.x - player.camX;
        var relY = player.position.y - player.camY;

        this.trajectory = new Pair(cursor.x - relX, cursor.y - relY);
        this.trajectory.normalize();

        this.range=range;
        this.baseSpeed=baseSpeed;
        this.damage = damage;
    }

    setDamage(damage){
        this.damage = damage;
    }
    getTrajectory(){
        return this.trajectory;
    }

    step(){
        this.position.x += (this.trajectory.x) * this.baseSpeed;
        this.position.y += (this.trajectory.y) * this.baseSpeed;

        this.collision();
    } 

    collision(){
        // check collision, disappear on contact
        // disappear on border collision
        if(this.position.x<0 || (this.position.x + this.radius)>this.stage.width ||
        this.position.y<0 || (this.position.y + this.radius) > this.stage.height){
			this.clearProjectile();
        }
        
        // disappear when out of range
        if(this.spawnPos.x + this.range < this.position.x ||
            this.spawnPos.x - this.range > this.position.x ||
            this.spawnPos.y + this.range < this.position.y ||
            this.spawnPos.y - this.range > this.position.y){
                this.clearProjectile();
            }

        // damage entities
        for(var i = 0; i < stage.actors.length; i++){
            var actor = stage.actors[i];
            if(this.getDistance(actor) <= 64 && (actor.id == 'entity' || actor.id == 'obstacle') 
            && actor.oid != this.oid){
                if(this.checkCollision(actor)){
                    actor.takeDamage(this.damage, this.player);
                    this.clearProjectile();
                }
            }
        }
    }

    clearProjectile(){
        this.stage.removeActor(this);
        this.weapon.numProj--;
        this.weapon.updateFireStatus();
    }

}