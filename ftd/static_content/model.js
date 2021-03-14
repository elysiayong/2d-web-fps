function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }
function getRndFrmSet(set){ var r = Math.floor(Math.random() * set.length); return set[r]}

class Stage {
	constructor(canvas){
		this.bgm = new Audio('../resources/Chug Jug With You [Hatsune Miku Cover].mp3');
		this.bgm.play();
		this.bgm.loop = true;
		this.canvas = canvas;
		this.canvas.width = window.innerWidth - Math.floor(window.innerWidth/4);
		this.canvas.height = window.innerHeight - Math.floor(window.innerHeight/4);
		// preload game assets
		var tilesrc = 'resources/spritesheet.png';
		var spritesheet = new SpriteSheet(tilesrc);
		// game attributes
		this.gameState = "play";
		// actual size of the game mapdwa
		this.width=2048;
		this.height=2048;
		var mapSize = 32;
		this.consumablesImage = {
			'heal1': new Pair(7, 5),
			'speed1': new Pair(7, 6)
		}

		this.actors=[]; // game objects
		this.map = []; // size is 16 x 16 tiles
		this.obstacles = [];
		this.player=null; 

		// Add the player to the center of the stage
		var velocity = new Pair(0,0);
		var baseSpeed = 10;
		var radius = 25;
		var colour= 'rgba(0,0,0,1)';
		var position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
		// var position = new Pair(0, 0);
		this.addPlayer(new Player(this, position, velocity, colour, radius, baseSpeed, spritesheet));

		// GUI
		this.hud = new HUD(this, this.player, spritesheet);
		this.menu = new Menu(this, this.player);

		this.generateWorld(mapSize, spritesheet);
		this.populateWorld(spritesheet);

		// this.debugMode(spritesheet);

		// set mouse cursor
		this.cursor = 0;


	}

	debugMode(spritesheet){
		var ammo = new PistolAmmo(this, new Pair(128, 128), spritesheet);
		this.addActor(ammo);
		var weapon = new Pistol(this, null, new Pair(0, 128), spritesheet);
		this.addActor(weapon);
		var obstacle = new Crate(this, new Pair(128, 0), spritesheet);
		this.addActor(obstacle);
		var healthPack = new HealthPack(this, new Pair(128, 64), spritesheet);
		this.addActor(healthPack);
		var speedBoost = new SpeedBoost(this, new Pair(192, 0), spritesheet);
		this.addActor(speedBoost);
	}

	generateWorld(mapSize, spritesheet){
		// generate map
		var set = [1, 3];
		for(var i = 0; i < mapSize; i++){
			for(var j = 0; j < mapSize; j++){
				var col = getRndFrmSet(set);
				var gameTile = new GameTile(this.getPos(i, j), new Pair(1, col), spritesheet);
				this.map.push(gameTile);
			}
		}

		// generate small decoration
		for(var i = 0; i < mapSize; i++){
			for(var j = 0; j < mapSize; j++){
				var col = Math.floor(Math.random() * 14) + 5;
				var gameTile = new GameTile(this.getPos(i, j), new Pair(1, col), spritesheet);
				this.obstacles.push(gameTile);
			}
		}

	}

	populateWorld(spritesheet){

		// spawn obstacles
		for(var i = 0; i < 5; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y=Math.floor((Math.random()*(this.height - 50) + 50));
			if(this.getActor(x, y) == null){
				var obstacle = new Crate(this, new Pair(x, y), spritesheet);
				this.addActor(obstacle);
			}
		}


		// spawn weapons all over the map
		for(var i = 0; i < 5; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y=Math.floor((Math.random()*(this.height - 50) + 50));
			if(this.getActor(x, y) == null){
				var ammo = new PistolAmmo(this, new Pair(x, y), spritesheet);
				this.addActor(ammo);
			}
		}

		// spawn ammo all over the map
		for(var i = 0; i < 5; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y=Math.floor((Math.random()*(this.height - 50) + 50));
			if(this.getActor(x, y) == null){
				var weapon = new Pistol(this, null, new Pair(x, y), spritesheet);
				this.addActor(weapon);
			}
		}

		// spawn consumables all over the map
		var consumableSet = ['heal1', 'speed1'];
		for(var i = 0; i < 10; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y=Math.floor((Math.random()*(this.height - 50) + 50));
			if(this.getActor(x, y) == null){
				var key = getRndFrmSet(consumableSet);
				var consumable = null;
				if(key == 'heal1'){
					consumable = new HealthPack(this, new Pair(x, y), spritesheet);
				}else if(key == 'speed1'){
					consumable = new SpeedBoost(this, new Pair(x, y), spritesheet);
				}
				this.addActor(consumable);
			}
		}


		// spawn some basic enemies (balls) 
		for (var i = 0; i < 8; i++) {
			var x=Math.floor((Math.random()*this.width));
			var y=Math.floor((Math.random()*this.height));
			// var x = 50;
			// var y = 50;
			if(this.getActor(x,y)===null){
				var velocity = new Pair(rand(11), rand(11));
				var red=randint(255), green=randint(255), blue=randint(255);
				var radius = randint(70);
				var alpha = Math.random();
				var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
				var position = new Pair(x,y);
				var b = new BasicEnemy(this, position, velocity, colour, radius);
				this.addActor(b);
			}
		}
	}

	getPos(x, y){
		return new Pair((x * 64), (y * 64));
	}

	setGameState(gameState){
		this.gameState=gameState;
	}

	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}

	getCursor(){
		return this.cursor;
	}

	setCursor(position){
		this.cursor = position;
		var rect = this.canvas.getBoundingClientRect();
	}
	

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		if(this.gameState=='play'){
			for(var i=0;i<this.actors.length;i++){
				this.actors[i].step();
			}
			this.hud.step();
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');

		context.clearRect(0, 0, this.width, this.height);
		// draw bg
		context.save();
		context.translate(-this.player.camX, -this.player.camY);
		for(var i = 0; i < this.map.length; i++){
			this.map[i].draw(context);
			this.obstacles[i].draw(context);
		}
		// draw actors
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		this.hud.draw(context);
		this.menu.draw(context);
		context.restore();
	}


} // End Class Stage


