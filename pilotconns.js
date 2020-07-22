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
      connBotName = "take2";
   }
}


var message = document.getElementById("message");
function formConn(){
webSocket.onopen = function(message){ wsOpen(message);};
webSocket.onmessage = function(message){ wsGetMessage(message);};
webSocket.onclose = function(message){ wsClose(message);};
webSocket.onerror = function(message){ wsError(message);};
}

formConn();

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
 session.connect(tokenVal, function(error) {

 });

}

function inititalizeAudioSession(sessionIdVal, tokenVal, napiKey, audioPubVal) {


  var session = OT.initSession(napiKey, sessionIdVal);
  // Subscribe to a newly created stream for bot reconnect
  session.on('streamCreated', function(event) {
	  session.subscribe(event.stream, 'subscriber', {
	    insertMode: 'append',
	    width: '100%',
	    height: '100%'
	  }, handleError);
	});

 var publisher = OT.initPublisher('publisher', {
   insertMode: 'append',
   width: '100%',
   height: '100%'
 }, handleError);
  publisher.publishVideo(true);

 session.connect(audioPubVal, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
 });

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

    colorOut("green");


}
function wsClose(message){
  console.log("closin ws");
  ws = null;
  setTimeout(formConn, 5000);
}

function wsError(message){
  console.log("ERRORRRR");

}

function cleanUp(){
   wsCloseConnection();
   if(allClean == false){
      try {
          console.log("cleaning");
          //window.location.replace("https://thecraftyrobot.net/");
         alert("Bot Connection Unavailable - Refresh the page to try again.");
       }
      catch(e) {
          console.log("cleanup error on redirect");
          alert("Bot Connection Unavailable - Refresh the page to try again.");}
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
