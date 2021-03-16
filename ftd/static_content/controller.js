var stage=null;
var view = null;
var interval=null;
var credentials={ "username": "", "password":"" };
var keys = [false, false, false, false];
var lmb = false;

function setupGame(){
        stage=new Stage(document.getElementById('stage'));
        document.getElementById('stage').style.cursor = 'crosshair';

	//event listener keyboard
        document.addEventListener('keydown', keyPressed);
        document.addEventListener('keyup', keyReleased);

        //event listener mouse
        document.addEventListener('mousedown', mousePressed);
        document.addEventListener('mouseup', mouseReleased);
}

function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
}

function pauseGame(){
	clearInterval(interval);
	interval=null;
}

function keyPressed(event){
        var key = event.key;
        var speed = stage.player.baseSpeed;
        var player = stage.player;

        if(key == 'w') { keys[0] = true; player.setVelY(-speed); }
        if(key == 's') { keys[1] = true; player.setVelY(speed); }
        if(key == 'd') { keys[2] = true; player.setVelX(speed); }
        if(key == 'a') { keys[3] = true; player.setVelX(-speed); }
        if(key == 'e') { player.pickUp(); }
        if(key == 'q') { player.drop(); }
        if(key == '1' || key == '2' || key == '3') { player.switchCurrWeapon(parseInt(key-1));}
        if(key == 'k'){ player.takeDamage(10, player);}
        if(key == 'r') { player.consumeItem('heal1');}
        if(key == 'f') { player.consumeItem('speed1');}
        if(key == 'p') {
                if(stage.gameState == 'pause'){
                        stage.bgm.play();
                        stage.gameState = 'play';
                }else if(stage.gameState == 'play'){
                        stage.bgm.pause();
                        stage.gameState = 'pause';
                }
        }
}

function keyReleased(event){
        var key = event.key;
        var player = stage.player;
        var speed = stage.player.baseSpeed;

        if(key == 'w') {
                keys[0] = false;
                if(keys[1]) {
                        player.setVelY(speed);
                }else player.setVelY(0);
        }

        if(key == 's') {
                keys[1] = false; 		
                if(keys[0]) {
                        player.setVelY(-speed);
                }else player.setVelY(0);
        }
        
        if(key == 'd') {
                keys[2] = false;
                if(keys[3]) {
                        player.setVelX(-speed);
                }else player.setVelX(0);
        }
        if(key == 'a') {
                keys[3] = false;
                if(keys[2]) {
                        player.setVelX(speed);
                }else player.setVelX(0);
        }
}

function mousePressed(event){
        button = event.button;
        var rect = stage.canvas.getBoundingClientRect();
        stage.setCursor(new Pair(event.clientX - rect.left, event.clientY - rect.top));
        if(button == 0){
                stage.player.fire();
        }
}

function mouseReleased(event){
        button = event.button;
        if(button == 2){
                lmb = false;
        }

}

function login(){
	credentials =  { 
		"username": $("#username").val(), 
		"password": $("#password").val() 
	};

        $.ajax({
                method: "POST",
                url: "/api/auth/login",
                data: JSON.stringify({}),
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
		setupGame();
		startGame();
                loadPlay();
                $("#loginErrors").html("");

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
                $("#loginErrors").html("Incorrect username or password!");
        });
}

function register(){
        // Some more front-end validation:
        if ($("#registerPassword").val()=='' || $("#confirmPassword").val()=='' || $("#registerUsername").val()=='') return;
        
        if ($("#registerPassword").val() != $("#confirmPassword").val()){
                $("#registerErrors").html("Passwords do not match!");
        
        // Back-end validation:
        } else {
                credentials =  { 
                        "username": $("#registerUsername").val(), 
                        "password": $("#registerPassword").val() 
                };
        
                $.ajax({
                        method: "POST", 
                        url: "/api/registration",
                        data: JSON.stringify(credentials),
                        processData:false, 
                        contentType: "application/json; charset=utf-8",
                        dataType:"json"
        
                }).done(function(data, text_status, jqXHR){
                        console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
                        // Reset form for next input
                        $("#registerErrors").html("");
                        // reset form, this will throw an error on chrome, but not on firefox
                        $("#registerForm")[0].reset();
                        loadLogin();
        
                }).fail(function(err){
                        console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
                        $("#registerErrors").html("Username already exists!");
                });
        }
}

// Using the /api/auth/test route, must send authorization header
function test(){
        $.ajax({
                method: "GET",
                url: "/api/auth/test",
                data: {},
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                dataType:"json"
        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

function loadPlay() {
        $("#ui_login").hide();
        $("#ui_play").show();
        $("#ui_register").hide();
        $("#ui_leaderboards").hide();
}

function loadLogin() {
        $("#ui_login").show();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_leaderboards").hide();
}

function loadRegister() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $("#ui_register").show();
        $("#ui_leaderboards").hide();
}

function loadLeaderBoards() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_leaderboards").show();
}

$(function(){
        // Setup all events here and display the appropriate UI
        $("#loginSubmit").on('click',function(){ login(); });
        $("#registerSubmit").on('click',function(){ register(); });
        $("#goToRegister").on('click',function(){ loadRegister(); });
        $("#getHallOfFame").on('click',function(){ loadLeaderBoards(); });
        $("#goBackToLogin").on('click',function(){ loadLogin(); });
        // Have to use this since 2 objects can't have the same ID...
        $("#goBackToLogin2").on('click',function(){ loadLogin(); });
        loadLogin();
});

