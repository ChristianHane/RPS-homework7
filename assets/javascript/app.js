var database = firebase.database();
var player1;
var player2;
var player;

$("#submit-name").on("click", function(event){
    event.preventDefault();
    var textField = $("#name").val().trim();
    if(player1 !== undefined){  
        player2= textField;    
        player = 2;
        database.ref("players").update({
            "player2": {
                "name": textField,
                "losses": 0,
                "wins": 0,
            }
        })
        $("#name-form").append("<p id='current-player'>Hello, " + textField + " you are player 2!</p>");
        $("#submit-name, #name").css("display", "none"); 
        generateP2Buttons();
        $(".player2-choice").css("display", "none");
        $(".submit-chat").attr("id", "p2-chat");
    }else{
        player1 = textField;
        player = 1;
        database.ref().set({
            "chat": "",
            "players": {
                "status": true,                
                "player1": {
                    "name": textField,
                    "losses": 0,
                    "wins": 0,
                }
            }
        })
        $("#name-form").append("<p id='current-player'>Hello, " + textField + " you are player 1!</p>");
        $("#submit-name, #name").css("display", "none");
        generateP1Buttons();
        $(".player1-choice").css("display", "none");
        $(".submit-chat").attr("id", "p1-chat");        
    }
})

function generateP1Buttons(){
    $("#player-1").append("<button class='player1-choice' value='rock'>Rock</button>");
    $("#player-1").append("<button class='player1-choice' value='paper'>Paper</button>");
    $("#player-1").append("<button class='player1-choice' value='scissors'>Scissors</button>");
}

function generateP2Buttons(){
    $("#player-2").append("<button class='player2-choice' value='rock'>Rock</button>");
    $("#player-2").append("<button class='player2-choice' value='paper'>Paper</button>");
    $("#player-2").append("<button class='player2-choice' value='scissors'>Scissors</button>");
}

database.ref("players/player1/name").on("value", function(snapshot){
    console.log(snapshot.val());
    if(snapshot.exists()){
        var name = snapshot.val();
        player1 = name;
        $("#p1-name").text(name);
        $("#waiting-p1").css("display", "none");
    } 
})

database.ref("players/player2/name").on("value", function(snapshot){
    console.log(snapshot.val());
    if(snapshot.exists()){
        var name = snapshot.val();
        player2 = name;
        $("#p2-name").text(name);
        $("#waiting-p2").css("display", "none");
        $(".player1-choice").css("display", "initial");        
    }
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

var player1Choice;
var player2Choice;

database.ref("players/player1/choice").on("value", function(snapshot){
    if(snapshot.exists()){
        $(".player2-choice").css("display", "initial");
        player1Choice = snapshot.val();
    }
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

database.ref("players/player2/choice").on("value", function(snapshot){
    if(snapshot.exists()){
        $(".player2-choice").css("display", "none");
        player2Choice = snapshot.val();
        calculateWinner();
    }
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

database.ref("turn").on("value", function(snapshot){
    turn = snapshot.val();
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
})

$("#player-1").on("click", ".player1-choice", function(){
    var choice = $(this).val();
    console.log(choice);
    $("#displayP1-choice").text(choice);
    database.ref("players/player1").update({
        "choice": choice,
    })
    $(".player1-choice").css("display", "none");
})

$("#player-2").on("click", ".player2-choice", function(){
    var choice = $(this).val();
    console.log(choice);
    $("#displayP2-choice").text(choice);
    database.ref("players/player2").update({
        "choice": choice,
    })
})

var player1Wins = 0;
var player1Losses = 0;
var player2Wins = 0;
var player2Losses = 0;

function calculateWinner(){
    if (player1Choice === player2Choice){
        $("#display-winner").text("Tie game!")
        window.setTimeout(restart, 5000);    
    }else if((player1Choice === "rock") && (player2Choice === "scissors")){
        player1Wins++;
        player2Losses++;
        database.ref("players/player1").update({
            "wins": player1Wins,
        })
        database.ref("players/player2").update({
            "losses": player2Losses,
        })
        player1Won();
    }else if((player1Choice === "rock") && (player2Choice === "paper")){
        player2Wins++;
        player1Losses++;
        database.ref("players/player2").update({
            "wins": player2Wins,
        })
        database.ref("players/player1").update({
            "losses": player1Losses,
        })
        player2Won();
    }else if((player1Choice === "paper") && (player2Choice === "scissors")){
        player2Wins++;
        player1Losses++;
        database.ref("players/player2").update({
            "wins": player2Wins,
        })
        database.ref("players/player1").update({
            "losses": player1Losses,
        })
        player2Won();
    }else if((player1Choice === "paper") && (player2Choice === "rock")){
        player1Wins++;
        player2Losses++;
        database.ref("players/player1").update({
            "wins": player1Wins,
        })
        database.ref("players/player2").update({
            "losses": player2Losses,
        })
        player1Won();
    }else if((player1Choice === "scissors") && (player2Choice === "paper")){
        player1Wins++;
        player2Losses++;
        database.ref("players/player1").update({
            "wins": player1Wins,
        })
        database.ref("players/player2").update({
            "losses": player2Losses,
        })
        player1Won();
    }else if((player1Choice === "scissors") && (player2Choice === "rock")){
        player2Wins++;
        player1Losses++;
        database.ref("players/player2").update({
            "wins": player2Wins,
        })
        database.ref("players/player1").update({
            "losses": player1Losses,
        })
        player2Won();
    }
}

function player1Won(){
    $("#display-winner").text("Player 1 Wins!");
    $("#displayP1-choice").text(player1Choice);
    $("#displayP2-choice").text(player2Choice);
    $("#p1-wins").text("Wins: " + player1Wins);
    $("#p2-losses").text("Losses: " + player2Losses);
    window.setTimeout(restart, 5000);    
}

function player2Won(){
    $("#display-winner").text("Player 2 Wins!");
    $("#displayP1-choice").text(player1Choice);
    $("#displayP2-choice").text(player2Choice);
    $("#p1-losses").text("Losses: " + player1Losses);
    $("#p2-wins").text("Wins: " + player2Wins);    
    window.setTimeout(restart, 5000);
}

function restart(){
    $("#display-winner").empty();
    $("#displayP2-choice").css("display", "none");
    $(".player1-choice").css("display", "initial");
}

$("#display-winner").on("click", "#restart", function(){
    console.log("clicked");
    window.location.reload(true);
})

database.ref("players").child("status").onDisconnect().set(false);

database.ref("players/status").once("value").then(function(snap){
    if(snap.val() === false){
        $("#display-winner").html("<p>A player has disconnected!</p>");
        setTimeout(clear, 5000);
        database.ref("players").remove();
        database.ref("chat").remove();
    }
})

function clear(){
    $("#display-winner").empty();
    // return $("#display-winner").append("<button id='restart'>Restart</button>");
}

$("#chat").on("click", "#p1-chat", function(){
    var message = $("#chat-text").val();
    console.log(message);
    database.ref("chat").push(player1 + ": " + message); 
})

$("#chat").on("click", "#p2-chat", function(){
    var message = $("#chat-text").val();
    console.log(message);
    database.ref("chat").push(player2 + ": " + message);      
})


database.ref("chat").on("child_added", function(snapshot){
    console.log(snapshot.val());
    var message = snapshot.val();
    $("#display-chat").append("<div>" + message + "</div>");
})
