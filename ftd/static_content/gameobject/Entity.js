class Player extends EntityObject {
	constructor(stage, position, velocity, colour, radius, baseSpeed, spritesheet){
		super(stage, position, velocity, colour, radius, spritesheet);
		this.setOID('player');
		this.baseSpeed=baseSpeed;
		this.pickupRange = 50;

		// this.currWeapon = new Pistol(stage, this, new Pair(0,0), spritesheet);
		// this.currWeapon.setID(this.id);
		this.currWeapon = null;

		this.camX = this.position.x - this.stage.canvas.width/2 + 16;
		this.camY = this.position.y - this.stage.canvas.height/2 + 16;
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

	switchCurrWeapon(index){
		if(index < this.weapons.length && index > -1){
			this.currWeapon = this.weapons[index];
			console.log("switched!");
			console.log(this.weapons);
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


class BasicEnemy extends EntityObject{
	constructor(stage, position, velocity, colour, radius, spritesheet){
        super(stage, position, velocity, colour, radius, spritesheet);
		this.stage = stage;
        this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
        this.setHealth(30);
		this.setOID('enemy');
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
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
		if(this.active){
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