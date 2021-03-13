class GameEntity extends GameObject{

    // GameEntity differs from GameObject as GameEntity will have additional attributes
    // such as health, velocity, etc.

    constructor(stage, position, velocity, colour, radius, spritesheet){
        super(stage, position, colour, radius, spritesheet);
        this.intPosition(); // this.x, this.y are int version of this.position
        if(!velocity){
            this.veloclity = new Pair(0,0);
        }else{
            this.velocity = velocity;
        }
        var statuses = ['normal', 'poisoned', 'stunned']; //change to dict
        this.status=statuses[0];
        this.poison=3;
        this.stunned=3;
        this.health = 100;
        this.invincible = false;
		this.iframes = 2;
	}

    // getters and setters
    // i forgot this isn't java lol might remove later bc redundant
	setVelY(velocity){this.velocity.y=velocity;}
	setVelX(velocity){this.velocity.x=velocity;}

	setHealth(health){this.health=health;}
	getHealth(){return this.health;}
    
	getStatus(){return this.status;}
	setStatus(status){this.status=status;}

    // // TODO: implement status effect damage
    // setStatus(status){
    // }

	// checkStatus(){
	// 	// if poisoned do damage per 2 seconds for 3 times
	// 	if(this.status == this.statuses[1]){
    //         setTimeout(statusDamaged(this.status), 2000);
	// 	}
	// }


    // statusDamaged(status){
    //     if(status){
    //         if(status == this.statuses[1] && this.poison > 0){
    //             this.health -= 5;
    //             this.poison--;
    //         }if(status == this.statuses[2] && this.stunned > 0){
    //             this.velocity = 0;
    //             this.stunned--;
    //         }
    //     } 

    // }

    // resetStatus(){
    //     if(this.poison < 0){

    //     }
    // } 

    takeDamage(dmg){
        if(this.active && !this.invincible){
            this.health-=dmg;
            this.invincible = true;
            if(this.health <= 0){
                this.active=false;
                this.stage.removeActor(this);
            }
        }
    }

    checkIframes(){
        // check iframes and reset accordingly
        if(this.invincible){
            this.iframes--;
            if(this.iframes <= 0){
                this.invincible = false;
                this.iframes = 2;
            }
        }
    }


    collision(gameObstacle){
        // TODO: blocked by obstacle

        // bounded by canvas
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=0;
		}
		if((this.position.x + this.radius)>this.stage.width){
			this.position.x=this.stage.width-this.radius;
			this.velocity.x=0;
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=0;
		}
		if((this.position.y + this.radius) > this.stage.height){
			this.position.y=this.stage.height-this.radius;
			this.velocity.y=0;
		}
    }

}