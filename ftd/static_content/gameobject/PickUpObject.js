class PickUpObject extends GameObject{
    constructor(stage, position, spritesheet){
        super(stage, position, null, 50, spritesheet);
        this.canPickUp = true;
    }

    pickUp(entity){}
    
    draw(context){
        context.save();
        context.translate(this.position.x, this.position.y);
        context.fillStyle = 'rgba(0, 200, 0, 0.35)';
        context.strokeStyle = 'rgba(0, 200, 0, 0.35)';
        context.beginPath(); 
		context.arc(30, 30, 50, 0, 2 * Math.PI, false); 
        context.fill();
        context.restore();
        super.draw(context);
    }

}