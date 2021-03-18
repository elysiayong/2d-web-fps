class EntityObject extends GameObject{

    // GameEntity differs from GameObject as GameEntity will have additional attributes
    // such as health, velocity, etc.

    constructor(stage, position, velocity, colour, radius, baseSpeed, spritesheet){
        super(stage, position, colour, radius, spritesheet);
        this.intPosition(); // this.x, this.y are int version of this.position
        if(!velocity){
            this.veloclity = new Pair(0,0);
        }else{
            this.velocity = velocity;
        }
        this.id = 'entity';
        this.weapons = [];
        this.inventory = {};
        for(var key in this.stage.consumablesImage){
            this.inventory[key] = [];
        }

        this.health = 100;
        this.kills = 0;
        this.invincible = false;
        this.boosted = false;
        this.boostDuration = 0;
        this.iframes = 5;
        this.defaultSpeed = baseSpeed;
        this.baseSpeed = baseSpeed;
        this.currWeapon = null;
	}

    // getters and setters
	setVelY(velocity){this.velocity.y=velocity;}
    setVelX(velocity){this.velocity.x=velocity;}
    
    setVelocity(velocity){
        this.velocity = velocity;
    }

	setHealth(health){this.health=health;}
	getHealth(){return this.health;}
    
	getStatus(){return this.status;}
	setStatus(status){this.status=status;}

	fire(trajectory){
		if(this.currWeapon){ 
            this.currWeapon.fire(trajectory);
		}
	}

    getInventory(key){
        return this.inventory[key];
    }

    updateInventory(key, newValue){
        this.inventory[key] += newValue;
    }

    pickUp(){
		for(var i = 0; i < stage.actors.length; i++){
            var actor = stage.actors[i];
			if(this.getDistance(actor) < 128 && this.checkCollision(actor)){
                if(actor.canPickUp){
                    actor.pickUp(this);
                }
			}
		}
    }
    
    drop(){
        if(this.currWeapon){
            this.currWeapon.drop();
            if(this.weapons.length > 0){
                this.currWeapon = this.weapons[0];
            }
        }
    }

    consumeItem(key){
        if(this.inventory[key].length > 0){
            var item = this.inventory[key].pop();
            item.consume(this);
        }
    }

    takeDamage(dmg, dealer){
        if(!this.invincible){
            this.health-=dmg;
            this.invincible = true;
            if(this.health <= 0){
                this.dead();

                if(this.id == 'entity' && this.oid == 'enemy'){
                    this.stage.numEnemy--;
                    if(this.stage.numEnemy <= 0){
                        this.stage.gameState = 'win';
                    }
                    dealer.kills++;
                }
                this.stage.removeActor(this);
            }
        }
    }

    dead(){
        for(var i = 0; i < this.weapons.length; i++){
            this.weapons[i].drop(); 
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

    checkBoosted(){
        if(this.boosted){
            this.boostDuration--;
            if(this.boostDuration <= 0){
                this.boosted = false;
                this.boostDuration = 0;
                this.baseSpeed = this.defaultSpeed;
            }
        }
    }


    collision(gameObstacle){
        var obstacle = null;
        if(this.currWeapon && this.getDistance(gameObstacle) <= this.currWeapon.fireRange && gameObstacle.id == "obstacle"){
            obstacle = gameObstacle;
        }
        if(this.getDistance(gameObstacle) <= 128 && gameObstacle.id == "obstacle"){
            // if player collides, check the direction of player movement, adjust
            // position and velocity accordingly
            if(this.checkCollision(gameObstacle)){
                var x = this.velocity.x;
                var y = this.velocity.y;
                if(x < 0){ // heading left
                    this.position.x+=this.radius/3;
                    this.velocity.x=0;
                }if(x > 0){ // heading right
                    this.position.x-=this.radius/3;
                    this.velocity.x=0;
                }if(y < 0){ // heading up
                    this.position.y+=this.radius/3;
                    this.velocity.y=0;
                }if(y > 0){ // heading down
                    this.position.y-=this.radius/3;
                    this.velocity.y=0;
                }
            }
        }
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
        
        return obstacle;
    }


    checkTile(){
        for(var i = 0; i < this.stage.map.length; i++){
            if(this.checkCollision(this.stage.map[i])){
                this.stage.map[i].affectSpeed(this);
            }
        }
    }

}

