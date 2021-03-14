function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }
function getRndFrmSet(set){ var r = Math.floor(Math.random() * set.length); return set[r]}

class Stage {
	constructor(canvas){
		this.canvas = canvas;
		this.canvas.width = window.innerWidth - Math.floor(window.innerWidth/4);
		this.canvas.height = window.innerHeight - Math.floor(window.innerHeight/4);
		// preload game assets
		var tilesrc = 'resources/spritesheet.png';
		var spritesheet = new SpriteSheet(tilesrc);
		// game attributes
		this.gameState = "play";
		// actual size of the game map
		this.width=2048;
		this.height=2048;
		var mapSize = 32;

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

		// generate map
		var set = [1, 3];
		for(var i = 0; i < mapSize; i++){
			for(var j = 0; j < mapSize; j++){
				var col = getRndFrmSet(set);
				var gameTile = new GameTile(this.getPos(i, j), new Pair(1, col), spritesheet);
				this.map.push(gameTile);
			}
		}

		// generate small obstacles
		for(var i = 0; i < mapSize; i++){
			for(var j = 0; j < mapSize; j++){
				var col = Math.floor(Math.random() * 14) + 5;
				var gameTile = new GameTile(this.getPos(i, j), new Pair(1, col), spritesheet);
				this.obstacles.push(gameTile);
			}
		}
		
		// spawn weapons all over the map
		for(var i = 0; i < 10; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y=Math.floor((Math.random()*(this.height - 50) + 50));
			if(this.getActor(x, y) == null){
				var ammo = new PistolAmmo(this, new Pair(x, y), spritesheet);
				this.addActor(ammo);
			}
		}

		// spawn ammo all over the map
		for(var i = 0; i < 10; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y=Math.floor((Math.random()*(this.height - 50) + 50));
			if(this.getActor(x, y) == null){
				var weapon = new Pistol(this, null, new Pair(x, y), spritesheet);
				this.addActor(weapon);
			}
		}


		// spawn some basic enemies (balls) 
		for (var i = 0; i < 20; i++) {
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

		// set mouse cursor
		this.cursor = 0;


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
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');

		if(this.gameState=='play'){
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
			context.restore();

		}
	}


} // End Class Stage


