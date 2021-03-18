var stage=null;
var view = null;
var interval=null;
var credentials={ "username": "", "password":"" };
var keys = [false, false, false, false];
var lmb = false;
var gameDifficulty = "easy";

function updateNumberOfWins(score){
        $.ajax({
                method: "POST",
                url: "/api/auth/updateWins",
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) }, // for current user
                data: JSON.stringify({"scoreToAdd": score}),
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"

        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON));
        });
}

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
        if (interval) clearInterval(interval);
	interval=null;
        stage.bgm.pause();
        stage.gameState = 'pause';
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

        if  ($("#registerUsername").val().length > 20) {
                $("#registerErrors").html("Username has to be less than 20 characters.");
                return;
        }
        
        if ($("#registerPassword").val() != $("#confirmPassword").val()){
                $("#registerErrors").html("Passwords do not match!");
        
        // Back-end validation:
        } else {
                credentials =  { 
                        "username": $("#registerUsername").val(), 
                        "password": $("#registerPassword").val(),
                        "difficulty": gameDifficulty
                };
                
                // No need for authorization header here, since we have no user yet!
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

function setDifficulty(difficulty, state) {
        if (state="at-register") {
                if (difficulty == "easy") {
                        document.getElementById("pick-easy").className = "select-diff-button selected-diff";
                        document.getElementById("pick-medi").className = "select-diff-button";
                        document.getElementById("pick-hard").className = "select-diff-button";
                        gameDifficulty="easy";
                }
                if (difficulty == "medi") {
                        document.getElementById("pick-easy").className = "select-diff-button";
                        document.getElementById("pick-medi").className = "select-diff-button selected-diff";
                        document.getElementById("pick-hard").className = "select-diff-button";
                        gameDifficulty="medi";
                }
                if (difficulty == "hard") {
                        document.getElementById("pick-easy").className = "select-diff-button";
                        document.getElementById("pick-medi").className = "select-diff-button";
                        document.getElementById("pick-hard").className = "select-diff-button  selected-diff";
                        gameDifficulty="hard";
                }
        }

        if (state="at-user-page") {}
}

// Since this is a state variable and get request, we can just get it like this
function getCurrentGameDifficulty() {
        var answer = "easy"
        $.ajax({
                method: "GET",
                url: "/api/auth/getGameDifficulty",
		headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) }, // for current user
                processData:false,
                contentType: "application/json; charset=utf-8",
                dataType:"json"

        }).done(function(data, text_status, jqXHR){
                console.log(jqXHR.status+" "+text_status+JSON.stringify(data));
		answer = JSON.stringify(data);

        }).fail(function(err){
                console.log("fail "+err.status+" "+JSON.stringify(err.responseJSON)); // keep default easy
        });

        return answer;
}

function loadPlay() {
        startGame();
        $("#ui_login").hide();
        $("#ui_play").show();
        $("#ui_register").hide();
        $("#ui_leaderboards").hide();
        $("#ui_instructions").hide();
        $("#ui_profile").hide();
        $("#stage").show();
        document.addEventListener('keydown', keyPressed); // re-enable, pause/unpause
        document.getElementById("home").style = "";
        document.getElementById("instructions").style = "";
        document.getElementById("profile").style = "";
}

function loadInstructions() {
        console.log("go to instructions.");
        $("#ui_login").hide();
        $("#ui_play").show();
        $("#ui_register").hide();
        $("#ui_leaderboards").hide();
        $("#ui_instructions").show();
        $("#ui_profile").hide();
        $("#stage").hide();
        pauseGame();
        document.removeEventListener('keydown', keyPressed); // don't let them un-pause
        // highlight navbar
        document.getElementById("home").style = "color: white;";
        document.getElementById("instructions").style = "color: #c98840;";
        document.getElementById("profile").style = "";
}

function loadProfile() {
        console.log("go to profile.");
        $("#ui_login").hide();
        $("#ui_play").show();
        $("#ui_register").hide();
        $("#ui_leaderboards").hide();
        $("#ui_instructions").hide();
        $("#ui_profile").show();
        $("#stage").hide();
        pauseGame();
        document.removeEventListener('keydown', keyPressed); // don't let them un-pause
        // highlight navbar
        document.getElementById("home").style = "color: white;";
        document.getElementById("instructions").style = "";
        document.getElementById("profile").style = "color: #c98840;";
}

function loadLogout() {
        console.log("go to logout.");
}

function loadLogin() {
        $("#ui_login").show();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_leaderboards").hide();
        $("#ui_instructions").hide();
        $("#ui_profile").hide();
        $("#stage").hide();
}

function loadRegister() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $("#ui_register").show();
        $("#ui_leaderboards").hide();
        $("#ui_instructions").hide();
        $("#ui_profile").hide();
        $("#stage").hide();
}

function loadLeaderBoards() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_leaderboards").show();
        $("#ui_instructions").hide();
        $("#ui_profile").hide();
        $("#stage").hide();
}

$(function(){
        // Setup all events here and display the appropriate UI
        $("#loginSubmit").on('click',function(){ login(); });
        $("#registerSubmit").on('click',function(){ register(); });
        $("#goToRegister").on('click',function(){ loadRegister(); });
        $("#pick-easy").on('click',function(){ setDifficulty("easy", "at-register")});
        $("#pick-medi").on('click',function(){ setDifficulty("medi", "at-register")});
        $("#pick-hard").on('click',function(){ setDifficulty("hard", "at-register")});
        $("#getHallOfFame").on('click',function(){ loadLeaderBoards(); });
        $("#goBackToLogin").on('click',function(){ loadLogin(); });
        // Have to do this since 2 objects can't have the same ID (go back appears in register+leaderboards)...
        $("#goBackToLogin2").on('click',function(){ loadLogin(); });
        
        $("#home").on('click',function(){ loadPlay(); });
        $("#instructions").on('click',function(){ loadInstructions(); });
        $("#profile").on('click',function(){ loadProfile(); });
        $("#logout").on('click',function(){ loadLogout(); });

        loadLogin();
});
