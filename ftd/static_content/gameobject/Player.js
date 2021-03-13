class Player extends GameEntity {
	constructor(stage, position, velocity, colour, radius, baseSpeed, spritesheet){
		super(stage, position, velocity, colour, radius, spritesheet);
		this.baseSpeed=baseSpeed;
		this.pickupRange = 50;
		this.weapons = [];
		this.inventory = [];
		this.currWeapon = new Pistol(stage, this, new Pair(0,0), spritesheet);
		this.setID('player');
		this.currWeapon.setID(this.id);
		// this.currWeapon = null;

		this.kd = new Pair(0, 0); // x is kills, y is deaths
		this.camX = this.position.x - this.stage.canvas.width/2 + 16;
		this.camY = this.position.y - this.stage.canvas.height/2 + 16;
	}

	fire(){
		if(this.currWeapon){
			this.currWeapon.fire();
		}
	}
	
	step(){
		if(this.active){
			// update position
			this.position.x+=this.velocity.x;
			this.position.y+=this.velocity.y;
			for(var i = 0; i < stage.actors.length; i++){
				this.collision(stage.actors[i]);
			}
			
			this.intPosition();
			this.checkIframes();

			// update camera
			this.updateCamera();
			if(this.health < 0){
				this.active=false;
				this.stage.gameState='end';
			}
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

	draw(context){
		if(this.active){
			context.fillStyle = this.colour;
			context.fillRect(this.x, this.y, this.radius,this.radius);
		}
		
	}
}