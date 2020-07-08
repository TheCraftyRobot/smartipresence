var webSocket = new WebSocket("wss://altrubots.com:8080/MultibotMavenProject/userConnEndpoint");


//adding this up here to autopopulate
var controlmsg = document.getElementById("controlmsg");
var initialmsg;
var vapiKey ;
var sessionId = "";
var audioEnabled = "1"
var audioToken = "";
var token = "";
var connKill = "9";
var messageCount = 0;
var exit = false;
var username = "default";
var connectKey = "private";
var connBotName = "rover";
var messageToken = username + "," + connectKey + ",";
var allClean = false;


//Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function updateBotname(){
   console.log(document.URL)
   var url = new URL(document.URL);
   var search_params = new URLSearchParams(url.search);
   // this will be true
   if(search_params.has('botName')) {
   	var bname = search_params.get('botName');
   	// output : 100
   	console.log(bname);
      connBotName = bname;
   }else{
      console.log("failure getting param!");
      connBotName = "take2";//ull take2nlikeit
   }
}


var message = document.getElementById("message");
webSocket.onopen = function(message){ wsOpen(message);};
webSocket.onmessage = function(message){ wsGetMessage(message);};
webSocket.onclose = function(message){ wsClose(message);};
webSocket.onerror = function(message){ wsError(message);};

function initializeSession(sessionIdVal, tokenVal, napiKey) {
//	echoText.value += "init session \n";
  var session = OT.initSession(napiKey, sessionIdVal);
  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
	  session.subscribe(event.stream, 'subscriber', {
	    insertMode: 'append',
	    width: '100%',
	    height: '100%'
	  }, handleError);
	});

  // Connect to the session
 // echoText.value += "connext \n";
 session.connect(tokenVal, function(error) {

 });
 //echoText.value += "conext 2urmom\n";
}

function inititalizeAudioSession(sessionIdVal, tokenVal, napiKey, audioPubVal) {
   //TODO: i think i cn just pass in different tokens n use the same method as regular init?
   //this is called if a bot allows inbound audio from a user.
//	echoText.value += "init session \n";
  var session = OT.initSession(napiKey, sessionIdVal);
  // Subscribe to a newly created stream for bot reconnect
  session.on('streamCreated', function(event) {
	  session.subscribe(event.stream, 'subscriber', {
	    insertMode: 'append',
	    width: '100%',
	    height: '100%'
	  }, handleError);
	});
   // Create a publisher
 var publisher = OT.initPublisher('publisher', {
   insertMode: 'append',
   width: '100%',
   height: '100%'
 }, handleError);
  publisher.publishVideo(true);
  // Connect to the session
 // echoText.value += "connext \n";
 session.connect(audioPubVal, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
 });
 //echoText.value += "conext 2urmom\n";
}

function wsOpen(message){
   // echoText.value += "Connecting to Availability Server ...... \n";
   console.log("starting new session");
}

function validSend(command){
   var newMessage = messageToken + command + "," + connBotName;
//   console.log("new message: " + newMessage);
   webSocket.send(newMessage);

}

function wsSendMessage(){
    webSocket.send(message.value);
   // echoText.value += "Message sent to the server : " + message.value + "\n";
//    console.log("message sent to servver: " + message.value);
    message.value = "";
}
function wsCloseConnection(){
    webSocket.close();
}
function wsGetMessage(message){
    //echoText.value += "Connected to the Availability Server... " + "\n";
    //console.log("recvd: " + message.data);
    //console.log(messageCount);
    if(messageCount == 0){
   //   echoText.value += "Connected to the Availability Server... " + "\n";
      console.log("first msg");
      updateBotname();
      messageCount = messageCount + 1;
      validSend("0");
   }else if(messageCount == 1){
      messageCount = messageCount + 1;
   //   console.log(" message");
      initialmsg = message.data;
      if(initialmsg == connKill){
      //   console.log("dead con!");
         //echoText.value += "User Ejected by Server...: " + "\n";
         console.log("user ejected by connectiivty server");
         //urinbedwiththedingonow
         //wsCloseConnection();
         cleanUp();
   	   //window.location.replace("/contactafterplay.php");

      }else{
         console.log("initializing video");
         //echoText.value += "Video Call Initializing... " + "\n";
      //   echoText.value += "Close this popup and click the ignition button to play!" + "\n";

         var sessionInfo = message.data.split(",");
         vapiKey = sessionInfo[0];
         token = sessionInfo[1];
      	sessionId = sessionInfo[2];
         //console.log(vapiKey);
         //console.log(sessionId);
      //   console.log(token);
         if(sessionInfo[3] == "0"){
            audioToken = sessionInfo[4];
            console.log(audioToken);
            inititalizeAudioSession(sessionId, token, vapiKey, audioToken);
         }
         else{
            console.log(vapiKey);
            console.log(sessionId);
            console.log(token);
            initializeSession(sessionId, token, vapiKey);
         }
      }
    }
    //echoText.value += initmsg + "\n";
    //conSendStopMessage(); no longer need to send an initial stop msg as the bot sees a new session and resets 4 user
    //who trusts a client neway
    colorOut("green");
    //check if should alert to low light and screw time conversion
    //need to check if bot has night vision now that multibot is go
//    var now = new Date();
//    var hour = now.getUTCHours();
//    var day = now.getDay();
//    var minutes = now.getMinutes();
//    if(hour > 22 || hour < 14){
//    	echoText.value += "Low Light Detected: Night Vision Engaged\n"; //its actuzlly always on
//    }
}
function wsClose(message){
 //  echoText.value += "Sorry, Trashbot is Unavailable.\n";
 //echoText.value += "Connection has been terminated. Bot may be Unavailable." + "\n";
  console.log("closin ws");
  ///  exit = true;
  //  colorOut("red")

}

function wserror(message){
  //  echoText.value += "Error ... \n";
  console.log("ERRORRRR");
}

function cleanUp(){
   wsCloseConnection();
   if(allClean == false){
      try {
          console.log("cleaning");
          window.location.replace("https://thecraftyrobot.net/"); }
      catch(e) {
          console.log("cleanup error on redirect");
          window.location = "https://thecraftyrobot.net/"; }
   }
   allClean = true;
}



//buttons
var forwardBtn=document.getElementById("forward");
var backwardBtn=document.getElementById("backward");
var rightBtn=document.getElementById("right");
var leftBtn=document.getElementById("left");
var stopBtn=document.getElementById("stop");
var quitBtn=document.getElementById("quit");
var quitBtn=document.getElementById("boost");

function colorOut(color){
	console.log("deprecated");
}




//Time for The con socket stuff

//var conSocket = new WebSocket("wss://altrubots.com:8080/controlPoint");
//var conSocket = new WebSocket("ws://localhost:8080/trashbotv1/controlPoint");
//moved up to autopopulte var conText = document.getElementById("conText");

//moved as well var controlmsg = document.getElementById("controlmsg");
//conSocket.onopen = function(message){ conOpen(controlmsg);};
//conSocket.onmessage = function(message){ conGetMessage(message);};
//conSocket.onclose = function(message){ conClose(controlmsg);};
//conSocket.onerror = function(message){ conError(controlmsg);};
function conOpen(message){
 //   conText.value += "Connected ... \n";
   //   echoText.value += "Trashbot con channel open.\n";

}
function conSendMessage(){
    conSocket.send(initMsg);
   // conText.value += "KEY Message sendt to the server : " + initMsg + "\n";

}

//
//NOT FUNCTIONAL
//
function conSendForwardMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "F";
	  validSend(sender);
	//echoText.value += "Message sendt to the server : " + sender + "\n";
//	echoText.value += "Forward sent to Server \n";
    if(exit){
    	colorOut("red");
    }else{
	colorOut("green");
//	forwardBtn.style.background="yellow";
	}
}


function conSendBackwardMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "B";
	  validSend(sender);
//	    conText.value += "Message sendt to the server : " + sender + "\n";
//	echoText.value += "Reverse sent to Server \n";
	 if(exit){
	    	colorOut("red");
	    }else{
	colorOut("green");
//	backwardBtn.style.background="yellow";
	    }
}

//NOT FUNCTIONAL
function conSendLeftMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "L";
	  validSend(sender);
//	    conText.value += "Message sendt to the server : " + sender + "\n";
//	echoText.value += "Left sent to Server \n";
	 if(exit){
	    	colorOut("red");
	    }else{
	colorOut("green");
//	leftBtn.style.background="yellow";
	 }
}


function conSendRightMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "R";
	  validSend(sender);
	  //  conText.value += "Message sendt to the server : " + sender + "\n";
	// echoText.value += "Right sent to Server \n";
	 if(exit){
	    	colorOut("red");
	    }else{
	colorOut("green");
//	rightBtn.style.background="yellow";
	    }
}

function conSendStopMessage(){
	//  echoText.value += "stop.\n";
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "!";
	  validSend(sender);
	//    conText.value += "Message sendt to the server : " + sender + "\n";
	// echoText.value += "Stop sent to Server \n";
	 if(exit){
	    	colorOut("red");
	}else{
     colorOut("green");
//     stopBtn.style.background="yellow";
	 }
}


function conSendUpMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "U";
	  validSend(sender);
//	    conText.value += "Message sendt to the server : " + sender + "\n";
//	echoText.value += "Reverse sent to Server \n";
	 if(exit){
	    	colorOut("red");
	    }//else{
//	colorOut("green");
	//backwardBtn.style.background="yellow";
	    //}
}

function conSendDownMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "D";
	  validSend(sender);
//	    conText.value += "Message sendt to the server : " + sender + "\n";
//	echoText.value += "Reverse sent to Server \n";
	 if(exit){
	    	colorOut("red");
	    }//else{
//	colorOut("green");
	//backwardBtn.style.background="yellow";
	    //}
}

function conSendLaserMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "T";
	  validSend(sender);
}


function conSendBoostMessage(){
	 if(exit){
	    	colorOut("red");
	}
	  var sender = "O";
	  validSend(sender);
//	    conText.value += "Message sendt to the server : " + sender + "\n";
//	echoText.value += "Reverse sent to Server \n";
	 if(exit){
	    	colorOut("red");
	    }else{
		colorOut("green");
//		forwardBtn.style.background="yellow";
	 }
}

function conSendQuitMessage(){
	 if(exit){
	    	colorOut("red");
	}
	 //no need to send anything, just close the socket
	 if(exit){
	    	colorOut("red");
	 }
	cleanUp();
}



function conCloseConnection(){
	exit = true;
	if(exit){
		    quitBtn.style.background="red";
	    	colorOut("red");
	}
//	wsCloseConnection();
    conSocket.close();
    cleanUp();

}
function conGetMessage(message){
  //  conText.value += "Message received from to the server : " + message.data + "\n";
    //check retcodes
    switch(message.data){
      case "0":
    	 // echoText.value += "Control Message Added to Bot Queue \n";
    	  break;
      case "1":
    	 // echoText.value += "Control Message Not added to Queue... Unknow Failure.. wtf are you doing??";
        console.log("message not added to queue");
    	  break;
      case "2":
    	  console.log("wait for video to load b4 using controls");
    	  break;
      case "3":
    	  //ka msg
    	//  echoText.value += "ka";
    	  setInterval(function() {
    	      // Do something every 5 seconds
    		  var senderk = initmsg + ",K";
        	  conSocket.send(senderk);
    		//  echoText.value += "ka run";
    	}, 5000);
    //	  echoText.value += "ka scheduled";
    	  break;
      case "9":
    	//  echoText.value += "Your key has expired... Thanks for Playing! \n";
    	//  echoText.value += "Go back to https://altrubots.com to see if you can regain control! \n";
      console.log("key expired!");
    	  exit = true;
    	  colorOut("red");
    	  break;
      default:
    	  //echoText.value += "wack yo non int?";
        console.log("hmmmmm");
    }
}
function conClose(message){
  //  conText.value += "You gave a bad key and now it doesn't work forever ... \n";
   //echoText.value += "The control server con is closed. Routing to home page... \n";
   console.log("closing");
   colorOut("red");
   exit = true;
   cleanUp();
   //window.location.replace("/contactafterplay.php");

}

function conerror(message){
  //  conText.value += "Error ... \n";
   //echoText.value += "Error in Conn";
   console.log("error in conn");
   colorOut("red");
   exit = true;
}
