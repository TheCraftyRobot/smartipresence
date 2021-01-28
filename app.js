//js for bot side video publishing and actuation conns
var audioEnabled = "";
var audioToken = "";
var accessKey = "";
var msgString = "";

function populate(){
   console.log("populate!");
   var url = new URL(document.URL);
   var search_params = new URLSearchParams(url.search);
   if(search_params.has('accessKey')) {
   	var providedKey = search_params.get('accessKey');
   	console.log(providedKey);
      document.getElementById("keyName").value = providedKey;
   }
}

function statusUpdate(status){
   if(status == "connected"){
      document.getElementById("Status").src="./crafty_robot_connected.png";
   }else if(status == "error"){
      document.getElementById("Status").src="./crafty_robot_error.png";
   }
}

function createConnSocket(){
   console.log("create conn");
   connSocket = new WebSocket("wss://altrubots.com:8080/MultibotMavenProject/botConnEndpoint");
   msgString = accessKey + "," + accessKey + ",";
   connSocket.onopen = function(message){ csOpen(message);};
   connSocket.onmessage = function(message){ csGetMessage(message);};
   connSocket.onclose = function(message){ csClose(message);};
   connSocket.onerror = function(message){ csError(message);};
}

function connectToBackend(){
   console.log("next xhr request");
    //if access key is valid, form audio video session and connect to bot control websocket engine
    var xhr = new XMLHttpRequest();
    var url = "https://lveysei1u3.execute-api.us-east-2.amazonaws.com/prod/dynamictelesession";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);

            if(json.Success ==  "True"){
              //parse response
              apiKey = json.apiKey;
              sessionId = json.session_id;
              token = json.publisherToken;
              audioToken = json.botAudioSubToken;
              initializeSession();
              //Websockets are the standard comunication vector used by Altrubots for bot-server interactions
              //the below connects to altrubots, authenticates and recieves a users message who goes to https://altrubots.com/play.php
              createConnSocket();
              statusUpdate("connected");
              console.log("scrolling");
              window.scrollTo(0,document.body.scrollHeight);
           }else{
              console.log("Error");
              statusUpdate("error");
              alert("An issue has been detected. Please retry.");
           }

        }
    };
    var data = JSON.stringify({"botName": accessKey, "ownerName": "Ross", "botKey": accessKey });
    xhr.send(data);
    console.log("conn should be open");
}

function validateAccessKey(providedAccessKey){
   console.log("validating access key");
   var xhr = new XMLHttpRequest();
   var url = "https://lveysei1u3.execute-api.us-east-2.amazonaws.com/prod/smartibotregistration";
   xhr.open("POST", url, true);
   xhr.setRequestHeader("Content-Type", "application/json");
   xhr.onreadystatechange = function () {
      console.log("onhr funct");
      console.log(xhr.status);
      console.log(xhr.readyState);
       if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("200 RCVD");
           var json = JSON.parse(xhr.responseText);
           if(json.Success ==  "True"){
             //parse response
             console.log("xhr validated key");
             accessKey = providedAccessKey;
             connectToBackend();
          }else{
             console.log("Error");
             statusUpdate("error");
             alert("Access Key Is Incorrect or Expired.");
          }

       }else{
       statusUpdate("error");
    }
   };

   var data = JSON.stringify({"ownerName": "Ross", "ownerKey": "sj_K6o-lm9VoRwVSR9Eecjf72wMqi6gXvEw-5FhWTaN7teKCK26xi4R5ALQNXY-BMEZP7khpujIULcLEaTBDU4fvEAww71YJ1GVM44ZSA6hFwUNW-QtUoVIZiYJwL0mPkSIJ61FoS6PnYStZe0RcfdzQEoH7tdZivY_hYlRTxTgeIhhjmbp9JI1BYORThm9Ad_9EMlvAEVU1dBHjrW6PTD5c2kgpgIFNWJdEJfdszGXj1jDehj1bWMPEGkWCyVOq21x81ooB9qO7Kaxn45PoDAwbaxclkpz0N2K_pLmkFmSvOMG7R7ld3kJH70l18faLZ-E5mEDdemAAbIYPZBFOTA", "meta": "{'Details':'Can be anything you want','your_data_key':'your_data_val'}", "apiKey":providedAccessKey });
   console.log(data);
   xhr.send(data);
}

function connect(){
   //so, this is the js for the bot side of the telepresence system.
   //use accessKey in user input if available
   //then if a url parameter is present for bot apiKey, use that
   if(document.getElementById("keyName").value != ""){
       console.log("key provided");
       validateAccessKey(document.getElementById("keyName").value);
   }else{
      //nothing in accessKey field, check url param
      //console.log("no key val found");
   //get url parameter
   var url = new URL(document.URL);
   var search_params = new URLSearchParams(url.search);
   // this will be true if access key is available
   if(search_params.has('accessKey')) {
   	var providedKey = search_params.get('accessKey');
   	//console.log(providedKey);
      validateAccessKey(providedKey);
   }else{
      //console.log("failure getting param! and input is not detected");
      statusUpdate("error");
   }
}

}

//Websocket Conn Methods
function csOpen(message){
   initmsg = accessKey + "," + accessKey + "," +  "Ross";
   connSocket.send(initmsg);
}

///If you want to flip a message to the server/user, call this!
function csSendMessage(msg){
   newMsg = msgString + msg;
   connSocket.send(newMsg);
}

function csGetMessage(message){
    console.log("conn recvd: " + message.data);
   if(message.data == "Hrt"){
      csSendMessage("Hrt" + ","+  "Ross");
   }else if(message.data == "-"){
      console.log("just a nothing");
   }else{
      console.log("Its a real user command! do something with it here.");
      if(message.data == "!"){
         console.log("Execute Stop");
      }else if(message.data == "F"){
          Puck.write('go("F");\n');
         console.log("Forward Increment");
      }else if(message.data == "B"){
        Puck.write('go("B");\n');
         console.log("Reverse Inrement");
      }else if(message.data == "R"){
        Puck.write('go("R");\n');
         console.log("Right Increment");
      }else if(message.data == "L"){
        Puck.write('go("L");\n');
         console.log("Left Increment");
      }else if(message.data == "D"){
  Puck.write('go("LD");\n');
         console.log("Boost");
      }else if(message.data == "U"){
  Puck.write('go("LU");\n');
         console.log("Up");
      }
   }
}

function csClose(message){
   console.log("Conn terminated");
    connSocket = null;
    setTimeout(createConnSocket, 4000);
}


//Handling all of our errors here by alerting them, hopefully not used much...
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}


//Preload Bot Configs
function autopop(){
   document.getElementById("botName").value = "SmartiBotTest";
   document.getElementById("ownerName").value = "Ross";
   document.getElementById("botKey").value = "ywpjqFv1RO0Urbdes15IxfaIY_v2o2DCSfRgCihT3kSDqLONXtWh_QwOWN6wIXBvSdPvcH-CHkcWGBSccgiVAkwWQimpcjStcRnHcz_o3nQ0jCV1VrrhLPIHZ2h1pkapjacaCkGYgFJsADhZhry4DMtflMU-sqOJ6kWzbzD7oHiUaE8fSwahuRd04bLPbO8zjQDeSGJhu55zt95e2OmoxmRvasQYQsIxUVFABqyRlIXQ_RipHHuOXLbJrKh7NUKTzLhcIJ9tlRQFPwQn01_SH1LJ9ZO0YzchOKYpej4Pqf13R82IVK5DLSdYHnbyu_pgsA";
}

/////Video Setup
function initializeSession() {
  console.log("init vid session");
  arr = apiKey.split(',');
  unsaltedApiKey = arr.pop(); // .pop() removes and returns the last item of the array
 var session = OT.initSession(unsaltedApiKey, sessionId);

  // Subscribe to a newly created stream when a new user joins
  //TODO: use audio enabled a conditional to open subscriptions
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

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      //wu wuh wuhhhhhh
     handleError(error);
     statusUpdate("error");
    } else {
      session.publish(publisher, handleError);

    }
  });
}
