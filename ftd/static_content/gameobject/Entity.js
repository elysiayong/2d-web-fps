class Player extends EntityObject {
	constructor(stage, position, velocity, colour, radius, baseSpeed, spritesheet){
		super(stage, position, velocity, colour, radius, baseSpeed, spritesheet);
		this.setOID('player');
		this.camX = this.position.x - this.stage.canvas.width/2 + 16;
		this.camY = this.position.y - this.stage.canvas.height/2 + 16;
		this.iframes = 5;
		this.imgPos = new Pair(5, 8);
		
	}
	
	step(){
		// update position
		this.position.x+=this.velocity.x;
		this.position.y+=this.velocity.y;
		for(var i = 0; i < stage.actors.length; i++){
			this.collision(stage.actors[i]);
		}
		
		this.intPosition();
		this.checkIframes();
		this.checkBoosted();
		this.checkTile();
		// update camera
		this.updateCamera();
	}

    takeDamage(dmg){
        if(!this.invincible){
            this.health-=dmg;
            this.invincible = true;
            if(this.health <= 0){
                this.dead();
				this.stage.gameState='loss';
                this.stage.removeActor(this);
            }
        }
    }

	switchCurrWeapon(index){
		if(index < this.weapons.length && index > -1){
			this.currWeapon = this.weapons[index];
			this.currWeapon.updateFireStatus();

		}
	}

	updateCamera(){
		// adjust the camera appropriately so that it doesn't get out of bounds
		if(this.position.x < this.stage.canvas.width/2){
			this.camX = 0;
		}else if (this.position.x + this.stage.canvas.width/2 > this.stage.width){
			this.camX = this.stage.width - this.stage.canvas.width;
		}else{
			this.camX = this.position.x - this.stage.canvas.width/2 + 16;
		}

		if(this.position.y < this.stage.canvas.height/2){
			this.camY = 0;
		}else if (this.position.y + this.stage.canvas.height/2 > this.stage.height){
			this.camY = this.stage.height - this.stage.canvas.height;
		}else{
			this.camY = this.position.y - this.stage.canvas.height/2 + 16;

		}
		
	}


}


class BasicEnemy extends EntityObject{
	constructor(stage, position, velocity, colour, radius, spritesheet){
        super(stage, position, velocity, colour, radius, null, spritesheet);
		this.intPosition(); // this.x, this.y are int version of this.position
        this.setHealth(30);
		this.setOID('enemy');
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;

		// bounce off the walls
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
		}
		this.intPosition();
		this.checkIframes();
		this.checkTile();
		if(this.checkCollision(this.stage.player)){
			this.stage.player.takeDamage(2);
		}
		
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		context.fillStyle = this.colour;
   		context.fillRect(this.x, this.y, this.radius,this.radius);
	}
}


class SmartEnemy extends EntityObject{
	constructor(stage, position, radius, baseSpeed, spritesheet, fireCoolDown){
		super(stage, position, null, null, radius, baseSpeed, spritesheet);
		this.intPosition(); // this.x, this.y are int version of this.position
		this.setHealth(30);
		this.setOID('enemy');
		this.trackStatus = '';
		this.fireTraj = null;
		this.imgPos = new Pair(5,1); 
		this.fireCooldownDefault = fireCoolDown;
		this.fireCooldown = fireCoolDown;

	}

	trackPlayer(){
		var target = this.stage.player;
		if(this.currWeapon && this.getDistance(target) <= 500){
			var velocity = new Pair(target.position.x - this.position.x, target.position.y - this.position.y);
			this.trackStatus = target.oid;
			velocity.normalize();
			return velocity;
		}else{
			return null;
		}
	}
	
	trackWeapon(){
		var velocity = new Pair(0,0);
		var weapons = this.stage.weaponsLoc;
		var closestWeapon = null;

		if(!this.currWeapon){
			for(var i = 0; i < weapons.length; i++){
				if(!closestWeapon) closestWeapon = weapons[i];
				if(this.getDistance(weapons[i]) < this.getDistance(closestWeapon)){
					closestWeapon = weapons[i];
				}
			} 
		}
		
		if(closestWeapon){
			velocity.x = closestWeapon.position.x - this.position.x;
			velocity.y = closestWeapon.position.y - this.position.y;
			this.trackStatus = closestWeapon.id;
			velocity.normalize();
		}else{
			return closestWeapon;
		}
		return velocity;
	}
	

	trackAmmo(){
		var closestAmmo = null;
		var velocity = new Pair(0,0);
		// look for ammo associated with weapon id if current weapon has no ammo
		if(this.currWeapon && this.currWeapon.ammo <= 0){
			var ammos = this.stage.ammosLoc;
			for(var i = 0; i < ammos.length; i++){
				if(!closestAmmo && (ammos[i].id == this.currWeapon.id)){
					closestAmmo = ammos[i];
				} 
				if(ammos[i].id == this.currWeapon.id && this.getDistance(ammos[i]) < this.getDistance(closestAmmo)){
					closestAmmo = ammos[i];
				}
			} 
		}

		if(closestAmmo){
			velocity.x = closestAmmo.position.x - this.position.x;
			velocity.y = closestAmmo.position.y - this.position.y;
			this.trackStatus = closestAmmo.id;
			velocity.normalize();
		}else{
			return closestAmmo;
		}
		return velocity;
	}


	runAway(){
		// run away from player (if in range) if low health (i.e 30%)
		if((this.health < (this.health * 0.3) || (this.currWeapon && this.currWeapon.ammo <= 0)) && this.getDistance(this.stage.player) <= 500){
			var angle = 180 * (Math.PI/180);
			var vel = this.trackPlayer();
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			var x = (vel.x * cos) - (vel.y * sin);
			var y = (vel.x * sin) + (vel.y * cos);
			this.trackStatus = this.stage.player.oid;
			return new Pair(Math.round(10000 * x) / 10000, Math.round(10000 * y) / 10000);
		}
		return null;
	}


	step(){
		this.trackerStrategy();

		if(this.fireCooldown < 0){
			if(this.fireTraj && this.currWeapon && this.getDistance(this.stage.player) <= this.currWeapon.fireRange){
				this.fire(this.fireTraj);
				this.fireCooldown = this.fireCooldownDefault;
			}
		}else{
			this.fireCooldown--;
		}

		for(var i = 0; i < stage.actors.length; i++){
			this.pickUp(this.trackStatus, stage.actors[i]);

			var obstacle = this.collision(stage.actors[i]);
			if(obstacle){
				var traj = new Pair(obstacle.position.x - this.position.x, obstacle.position.y - this.position.y);
				//destroy obstacle	
				if(traj && (traj != new Pair(0,0))){
					traj.normalize();
					this.fire(traj);
					this.velocity.x = 0;
					this.velocity.y = 0;
					// pauseGame();
				}
			}
		}

		// update position
		this.position.x+=this.velocity.x * this.baseSpeed;
		this.position.y+=this.velocity.y * this.baseSpeed;

		this.checkIframes();
		this.checkTile();

	}


	trackerStrategy(){
		var playerTraj = this.trackPlayer();
		var runAwayTraj = this.runAway();
		var ammoTraj = this.trackAmmo();
		var weaponTraj = this.trackWeapon();

		if(weaponTraj){
			// means that entity has no weapon
			this.setVelocity(weaponTraj);
		}else if(ammoTraj){
			this.setVelocity(ammoTraj);
		}else if(runAwayTraj){
			this.setVelocity(runAwayTraj);
		}else if(playerTraj && (this.getDistance(this.stage.player) <= 400) && (this.getDistance(this.stage.player) > 200)){
			this.setVelocity(playerTraj);
		}else{
			this.velocity = new Pair(0,0);
		}

		if(playerTraj == new Pair(0, 0)){
			this.fireTraj = null;
		}else{
			this.fireTraj = playerTraj;
		}
	}

	pickUp(pickUpId, actor){
		if(pickUpId == actor.id && this.getDistance(actor) < 128 && this.checkCollision(actor)){
			if(actor.canPickUp){
				actor.pickUp(this);
			}
		}
	}	

}


class HunterEnemy extends SmartEnemy{
	// most versatile enemy
	// can track weapon, ammo, and health
	// same stats as player
	constructor(stage, position, spritesheet){
		super(stage, position, 30, 5, spritesheet, 20);
		this.imgPos = new Pair(5,9); 

		this.setHealth(100);
	}
}


class BigEnemy extends SmartEnemy{
	constructor(stage, position, spritesheet){
		super(stage, position, 50, 2, spritesheet, 15);
		this.setHealth(200);
		this.imgPos = new Pair(5,10); 

		this.currWeapon = new Shotgun(stage, this, position, spritesheet);
		this.currWeapon.oid = this.oid; 
		this.currWeapon.ammo += 1503;
		this.weapons.push(this.currWeapon);
	}
}

class FastEnemy extends SmartEnemy{
	constructor(stage, position, spritesheet){
		super(stage, position, 30, 8, spritesheet, 15);
		this.setHealth(50);
		this.imgPos = new Pair(5,11); 

		this.currWeapon = new Pistol(stage, this, position, spritesheet);
		this.currWeapon.ammo += 50;
		this.currWeapon.oid = this.oid; 
		this.weapons.push(this.currWeapon);
	}

}



