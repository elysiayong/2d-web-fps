function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }
function getRndFrmSet(set){ var r = Math.floor(Math.random() * set.length); return set[r]}

function removeFrom(lst, gameObject){
	var index = lst.indexOf(gameObject);
	if(index != -1){
		lst.splice(index, 1);
	}
}

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
		this.multiplier = {//
			'easy': 1,
			'medium': 2,
			'hard': 5
		}
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

		// empty settings
		this.settings = {
			'tileArray': [],
			'obstacles': 0,
			'weapons': 0,
			'ammo': 0,
			'consumables': {
				'heal1': 0,
				'heal2': 0,
				'speed1': 0
			},
			'enemies': {
				'BasicEnemy' : 0,
				'HunterEnemy': 0,
				'BigEnemy': 0,
				'FastEnemy': 0
			}
		}

		this.adjustSettings(getCurrentGameDifficulty());

		this.actors=[]; // game objects
		this.map = []; 
		this.decoration = [];
		this.player=null; 
		this.numEnemy = 0;
		this.weaponsLoc = [];
		this.ammosLoc = [];

		for(var enemy in this.settings['enemies']){
			this.numEnemy += this.settings['enemies'][enemy];
		}

		// Add the player to the center of the stage
		var velocity = new Pair(0,0);
		var baseSpeed = 10;
		var radius = 25;
		var colour= 'rgba(0,0,0,1)';
		var position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
		this.addPlayer(new Player(this, position, velocity, colour, radius, baseSpeed, spritesheet));

		// GUI
		this.hud = new HUD(this, this.player, spritesheet);
		this.menu = new Menu(this, this.player);

		this.generateWorld(mapSize, spritesheet, this.settings['tileArray']);
		this.populateWorld(spritesheet, this.settings);

		// this.debugMode(spritesheet);

		// set mouse cursor
		this.cursor = 0;
	}


	debugMode(spritesheet){
		this.player.position.x = 0;
		this.player.position.y = 0;
		var ammo = new ShotgunAmmo(this, new Pair(0, 128), spritesheet);
		this.addActor(ammo);
		this.ammosLoc.push(ammo);
		var weapon = new Shotgun(this, null, new Pair(0, 128), spritesheet);
		this.addActor(weapon);
		this.weaponsLoc.push(weapon);
		var ammo1 = new MachineGunAmmo(this, new Pair(64, 128), spritesheet);
		this.addActor(ammo1);
		this.ammosLoc.push(ammo1);
		var weapon1 = new Pistol(this, null, new Pair(64, 128), spritesheet);
		this.addActor(weapon1);
		this.weaponsLoc.push(weapon1);
		
		var obstacle = new Crate(this, new Pair(128, 128), spritesheet);
		this.addActor(obstacle);
		var obstacle1 = new Crate(this, new Pair(128, 192), spritesheet);
		this.addActor(obstacle1);
		var obstacle2 = new Crate(this, new Pair(192, 128), spritesheet);
		this.addActor(obstacle2);
		var obstacle3 = new Crate(this, new Pair(192, 192), spritesheet);
		this.addActor(obstacle3);


		var healthPack = new HealthPack(this, new Pair(128, 64), spritesheet);
		this.addActor(healthPack);
		var speedBoost = new SpeedBoost(this, new Pair(192, 0), spritesheet);
		this.addActor(speedBoost);
		var enemy = new BigEnemy(this, new Pair(256, 256), spritesheet);
		this.addActor(enemy);

	}

	generateWorld(mapSize, spritesheet, tileArray){
		// generate map
		this.generateMap(tileArray, mapSize, spritesheet);

		// generate small decoration
		for(var i = 0; i < mapSize; i++){
			for(var j = 0; j < mapSize; j++){
				var col = Math.floor(Math.random() * 14) + 5;
				var gameTile = new GameTile(this.getPos(i, j), new Pair(1, col), spritesheet);
				this.decoration.push(gameTile);
			}
		}

	}

	generateMap(tileArray, mapSize, spritesheet){
		for(var i = 0; i < mapSize; i++){
			for(var j = 0; j < mapSize; j++){
				var type = getRndFrmSet(tileArray);
				var gameTile = this.tileDecider(type, this.getPos(i, j), spritesheet);
				this.map.push(gameTile);
			}
		}
	}

	populateWorld(spritesheet, settings){
    
		var obstacles = settings['obstacles'];
		var weapons = settings['weapons'];
		var ammos = settings['ammo'];
		var consumables = settings['consumables'];
		var enemies = settings['enemies'];


		// spawn obstacles
		for(var i = 0; i < obstacles; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y = Math.floor((Math.random()*(this.height - 50) + 50));
			var obj = getRndFrmSet(['Crate', 'Barrel', 'Chest']);

			if(this.getActor(x, y) == null){
				var obstacle = null;
				var position = new Pair(x, y);
				if(obj == 'Crate'){
					obstacle = new Crate(this, position, spritesheet);
				}else if(obj == 'Barrel'){
					obstacle = new Barrel(this, position, spritesheet);
				}else if(obj == 'Chest'){
					obstacle = new Chest(this, position, spritesheet);
				}
				this.addActor(obstacle);
			}
		}



		// spawn weapons all over the map
		for(var i = 0; i < weapons; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y = Math.floor((Math.random()*(this.height - 50) + 50));
			var obj = getRndFrmSet(['Pistol', 'Shotgun', 'MachineGun']);

			if(this.getActor(x, y) == null){
				var weapon = null;
				var position = new Pair(x, y);

				if(obj == 'Pistol'){
					weapon = new Pistol(this, null, position, spritesheet);
				}else if(obj == 'Shotgun'){
					weapon = new Shotgun(this, null, position, spritesheet);
				}else if(obj == 'MachineGun'){
					weapon = new MachineGun(this, null, position, spritesheet);
				}
				this.addActor(weapon);
				this.weaponsLoc.push(weapon);
			}
		}


		// spawn ammo all over the map
		for(var i = 0; i < ammos; i++){
			var x = Math.floor((Math.random()*(this.width - 50) + 50));
			var y = Math.floor((Math.random()*(this.height - 50) + 50));
			var obj = getRndFrmSet(['PistolAmmo', 'ShotgunAmmo', 'MachineGunAmmo']);

			if(this.getActor(x, y) == null){
				var ammo = null;
				var position = new Pair(x, y);

				if(obj == 'PistolAmmo'){
					ammo = new PistolAmmo(this, position, spritesheet);
				}else if(obj == 'ShotgunAmmo'){
					ammo = new ShotgunAmmo(this, position, spritesheet);
				}else if(obj == 'MachineGunAmmo'){
					ammo = new MachineGunAmmo(this, position, spritesheet);
				}
				this.addActor(ammo);
				this.ammosLoc.push(ammo);
			}
		}


		// spawn consumables all over the map

		for(var obj in consumables){
			for(var i = 0; i < consumables[obj]; i++){
				var x = Math.floor((Math.random()*(this.width - 50) + 50));
				var y = Math.floor((Math.random()*(this.height - 50) + 50));

				if(this.getActor(x, y) == null){
					var consumable = null;
					var position = new Pair(x,y);

					if(obj == 'heal1'){
						consumable = new HealthPack(this, position, spritesheet);
					}else if(obj == 'speed1'){
						consumable = new SpeedBoost(this, position, spritesheet);
					}else if(obj == 'heal2'){
						consumable = new ChugJug(this, position, spritesheet);
					}
					this.addActor(consumable);
				}
			}
		}

		// spawn some basic enemies (balls) 
		for(var obj in enemies){
			for(var i = 0; i < enemies[obj]; i++){
				var x = Math.floor((Math.random()*(this.width - 50) + 50));
				var y = Math.floor((Math.random()*(this.height - 50) + 50));

				if(this.getActor(x, y) == null){
					var enemy = null;
					var position = new Pair(x,y);

					if(obj == 'BasicEnemy'){
						var velocity = new Pair(rand(3), rand(3));
						var red=randint(255), green=randint(255), blue=randint(255);
						var radius = randint(70) + 30;
						var alpha = 1;
						var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
						enemy = new BasicEnemy(this, position, velocity, colour, radius, spritesheet);

					}else if(obj == 'HunterEnemy'){
						enemy = new HunterEnemy(this, position, spritesheet);
						
					}else if(obj == 'BigEnemy'){
						enemy = new BigEnemy(this, position, spritesheet);

					}else if(obj == 'FastEnemy'){
						enemy = new FastEnemy(this, position, spritesheet);

					}
					this.addActor(enemy);
				}
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
			this.decoration[i].draw(context);
		}
		// draw actors
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		this.hud.draw(context);
		this.menu.draw(context);
		context.restore();

		if(this.gameState == 'win' || this.gameState == 'loss'){
			endGame();
		}

	}

	tileDecider(type, position, spritesheet){
		var tile = null;
		if(type == 'grass'){
			tile = new GrassTile(position, spritesheet);
		}else if(type == 'mud'){
			tile = new MudTile(position, spritesheet);
		}else if(type == 'sand'){
			tile = new SandTile(position, spritesheet);
		}else if(type == 'water'){
			tile = new WaterTile(position, spritesheet); 
		}
		return tile;
	}

	tileDecider(type, position, spritesheet){
		var tile = null;
		if(type == 'grass'){
			tile = new GrassTile(position, spritesheet);
		}else if(type == 'mud'){
			tile = new MudTile(position, spritesheet);
		}else if(type == 'sand'){
			tile = new SandTile(position, spritesheet);
		}else if(type == 'water'){
			tile = new WaterTile(position, spritesheet); 
		}
		return tile;
	}


	adjustSettings(difficulty){
		if(difficulty == 'easy'){
			this.settings['tileArray'] = ['grass', 'mud'];
			this.settings['obstacles'] = 5;
			this.settings['weapons'] = 5;
			this.settings['ammo'] = 10;
			this.settings['consumables']['heal1'] = 5;
			this.settings['consumables']['heal2'] = 0;
			this.settings['consumables']['speed1'] = 5;
			this.settings['enemies']['BasicEnemy'] = 4;
			this.settings['enemies']['HunterEnemy'] = 1;
			this.settings['enemies']['BigEnemy'] = 1;
			this.settings['enemies']['FastEnemy'] = 1;

		}else if(difficulty == 'medium'){
			this.settings['tileArray'] = ['sand', 'mud'];
			this.settings['obstacles'] = 8;
			this.settings['weapons'] = 8;
			this.settings['ammo'] = 15;
			this.settings['consumables']['heal1'] = 8;
			this.settings['consumables']['heal2'] = 2;
			this.settings['consumables']['speed1'] = 8;
			this.settings['enemies']['BasicEnemy'] = 5;
			this.settings['enemies']['HunterEnemy'] = 3;
			this.settings['enemies']['BigEnemy'] = 3;
			this.settings['enemies']['FastEnemy'] = 3;

		}else if(difficulty == 'hard'){
			this.settings['tileArray'] = ['sand', 'sand', 'water'];
			this.settings['obstacles'] = 10;
			this.settings['weapons'] = 10;
			this.settings['ammo'] = 30;
			this.settings['consumables']['heal1'] = 15;
			this.settings['consumables']['heal2'] = 8;
			this.settings['consumables']['speed1'] = 15;
			this.settings['enemies']['BasicEnemy'] = 8;
			this.settings['enemies']['HunterEnemy'] = 8;
			this.settings['enemies']['BigEnemy'] = 8;
			this.settings['enemies']['FastEnemy'] = 8;
		}
	}

	resetGame(){
        this.actors=[]; // game objects
        this.map = []; 
        this.decoration = [];
        this.player = null; 
        this.numEnemy = 0;
        this.weaponsLoc = [];
        this.ammosLoc = [];
        this.bgm = null;
        this.canvas = null;
        this.hud = null;
        this.menu = null; 
    }

	adjustSettings(difficulty){
		if(difficulty == 'easy'){
			this.settings['tileArray'] = ['grass', 'mud'];
			this.settings['obstacles'] = 5;
			this.settings['weapons'] = 5;
			this.settings['ammo'] = 10;
			this.settings['consumables']['heal1'] = 5;
			this.settings['consumables']['heal2'] = 0;
			this.settings['consumables']['speed1'] = 5;
			this.settings['enemies']['BasicEnemy'] = 4;
			this.settings['enemies']['HunterEnemy'] = 1;
			this.settings['enemies']['BigEnemy'] = 1;
			this.settings['enemies']['FastEnemy'] = 1;

		}else if(difficulty == 'medium'){
			this.settings['tileArray'] = ['sand', 'mud'];
			this.settings['obstacles'] = 8;
			this.settings['weapons'] = 8;
			this.settings['ammo'] = 15;
			this.settings['consumables']['heal1'] = 8;
			this.settings['consumables']['heal2'] = 2;
			this.settings['consumables']['speed1'] = 8;
			this.settings['enemies']['BasicEnemy'] = 5;
			this.settings['enemies']['HunterEnemy'] = 3;
			this.settings['enemies']['BigEnemy'] = 3;
			this.settings['enemies']['FastEnemy'] = 3;

		}else if(difficulty == 'hard'){
			this.settings['tileArray'] = ['sand', 'sand', 'water'];
			this.settings['obstacles'] = 10;
			this.settings['weapons'] = 10;
			this.settings['ammo'] = 30;
			this.settings['consumables']['heal1'] = 15;
			this.settings['consumables']['heal2'] = 8;
			this.settings['consumables']['speed1'] = 15;
			this.settings['enemies']['BasicEnemy'] = 8;
			this.settings['enemies']['HunterEnemy'] = 8;
			this.settings['enemies']['BigEnemy'] = 8;
			this.settings['enemies']['FastEnemy'] = 8;
		}
	}

	resetGame(){
		this.actors=[]; // game objects
		this.map = []; 
		this.decoration = [];
		this.player = null; 
		this.numEnemy = 0;
		this.weaponsLoc = [];
		this.ammosLoc = [];
		this.bgm = null;
		this.canvas = null;
	}

} // End Class Stage


