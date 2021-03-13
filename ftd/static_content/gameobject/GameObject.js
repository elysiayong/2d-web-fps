
class GameObject{
	constructor(stage, position, colour, radius, spritesheet){
		this.id = null;
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
		this.colour = colour;
		this.radius = radius;
		this.active=true;
		this.spritesheet = spritesheet;
		this.imgPos = null; 
	}

	setID(id){
		this.id = id;
	}

	setImgPos(imgPos){
		this.imgPos = imgPos;
	}

	getImgPos(){
		return this.imgPos;
	}

	getBounds(){
		return this.radius; 
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

    draw(context){
		// default use spritesheet
        this.spritesheet.draw(context, this.imgPos.x, this.imgPos.y, this.position.x, this.position.y);
	}
	
	checkCollision(gameobject){
		var xPos = gameobject.position.x;
		var yPos = gameobject.position.y;
		var radius = gameobject.radius;

		return (xPos < this.position.x + this.radius &&
			xPos + radius > this.position.x && 
			yPos < this.position.y + this.radius && 
			yPos + radius > this.position.y)
	}
	
	// abstract classes 
	step(){}
	collision(){}


}
