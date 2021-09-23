//Example Usage of Altrubots Bot queue
//The queue api allows users to line up until the bot is available.
//It also provides a convenient way to wait for a bot to be available.

//Workflow
//Connect to the websocket endpoint
//send an initial message saying the bot you would like to queue for.
//check position in line via messages from server
///if position = 0 the bot is available, if the position is 1 you are first in line, ect.
//respond to any heartbeat messages to keep place in line
//update the code in the function csGetMessage to do your UI and Logic based off queue position


var connSocket = new WebSocket("wss://altrubots.com:8080/MultibotMavenProject/botQueueEndpoint");
var botWaitName = "default";

connSocket.onopen = function(message){ csOpen(message);};
connSocket.onmessage = function(message){ csGetMessage(message);};
connSocket.onclose = function(message){ csClose(message);};
connSocket.onerror = function(message){ csError(message);};


//Websocket Conn Methods
function csOpen(message){
    //use the botname as the first arg and second arg
    //botname is a url param
    var url = new URL(document.URL);
    //var botWaitName = "default";
    console.log("new url");
    var search_params = new URLSearchParams(url.search);
    // this will be true
console.log("looking for bot name");
    if(search_params.has('botName')) {
console.log("got bot name");
     var bname = search_params.get('botName');
      botWaitName = bname;
	console.log("bot name set");
    }
    //build initial message, send it to server when you open
	prefix = botWaitName + ",";
  initmsg = prefix + botWaitName;
  connSocket.send(initmsg);
}

///If you want to flip a message to the server/user, call this!
//For queuing this is only needed for the inital message and heartbeats
function csSendMessage(msg){
   newMsg = prefix + msg;
   connSocket.send(newMsg);
}


function csGetMessage(message){
    console.log("recvd: " + message.data);
    //if its a heartbeat, return the message
   if(message.data == "Q-Hrt"){
      csSendMessage("Q-Hrt");
   }else if(message.data == "-"){
      console.log("Default Server Response");
   }else if(message.data.includes("queue")){
      //check the position in line
      var json = JSON.parse(message.data);
      console.log("parsing json");
      console.log(json.queue);
      console.log(botWaitName);
      document.getElementById("queuespot").innerHTML = json.queue;	
      if(json.queue == "0"){
          console.log("Bot is available!");
         //The bot is Ready - grab it ASAP
         //
      window.location.replace("https://www.smarti.app/smartipresence/museumdriver.html?botName=" + botWaitName);
        //

      }
      //
         // Add your UI/Functionality here as well based off the value of json.queue
     //

   }
}

function csClose(message){
   console.log("Connection terminated");
}
	

