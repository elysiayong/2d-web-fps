class BasicEnemy extends GameEntity{
	constructor(stage, position, velocity, colour, radius, spritesheet){
        super(stage, position, velocity, colour, radius, spritesheet);
		this.stage = stage;
        this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
        this.setHealth(30);
        this.setID('enemy');
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
		// context.beginPath(); 
		// context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		// context.fill();   
	}
}