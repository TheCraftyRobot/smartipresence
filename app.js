//js for bot side video publishing
var audioEnabled = "";
var audioToken = "";
var accessKey = "";
var msgString = "";

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
              connSocket = new WebSocket("wss://altrubots.com:8080/MultibotMavenProject/botConnEndpoint");
              msgString = accessKey + "," + accessKey + ",";
              connSocket.onopen = function(message){ csOpen(message);};
              connSocket.onmessage = function(message){ csGetMessage(message);};
              connSocket.onclose = function(message){ csClose(message);};
              connSocket.onerror = function(message){ csError(message);};
           }else{
              console.log("Error");
              alert("WE HAVE PROBLEMS");
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
      //       return true;
          }else{
             console.log("Error");
             alert("Access Key Is Incorrect or Expired.");
      //       return false;
          }

       }else{
       console.log("non 200 retcode");
    }
      // return false;
   };

   var data = JSON.stringify({"ownerName": "Ross", "ownerKey": "sj_K6o-lm9VoRwVSR9Eecjf72wMqi6gXvEw-5FhWTaN7teKCK26xi4R5ALQNXY-BMEZP7khpujIULcLEaTBDU4fvEAww71YJ1GVM44ZSA6hFwUNW-QtUoVIZiYJwL0mPkSIJ61FoS6PnYStZe0RcfdzQEoH7tdZivY_hYlRTxTgeIhhjmbp9JI1BYORThm9Ad_9EMlvAEVU1dBHjrW6PTD5c2kgpgIFNWJdEJfdszGXj1jDehj1bWMPEGkWCyVOq21x81ooB9qO7Kaxn45PoDAwbaxclkpz0N2K_pLmkFmSvOMG7R7ld3kJH70l18faLZ-E5mEDdemAAbIYPZBFOTA", "meta": "{'Details':'Can be anything you want','your_data_key':'your_data_val'}", "apiKey":providedAccessKey });
   console.log(data);
   xhr.send(data);


   //TEST - currently autoapproving accesskey
   //return true;
}

function connect(){
   //so, this is the js for the bot side of the telepresence system.
   //if a url parameter is present for bot apiKey,

   //get url parameter
   var url = new URL(document.URL);
   var search_params = new URLSearchParams(url.search);
   // this will be true
   if(search_params.has('accessKey')) {
   	var providedKey = search_params.get('accessKey');
   	// output : 100
   	console.log(providedKey);
      validateAccessKey(providedKey);
      //TODO: base logic and error handling off validateAccessKey() return

   }else{
      console.log("failure getting param!, trying user input");
      //no url parameter, request user to enter in access key
      //Then pass in the provided key to the below call to validateAccessKey()
      var providedKey = document.getElementById("keyName").value;
      validateAccessKey(providedKey);
      //TODO - ALL LOGIC

   }

}

//Websocket Conn Methods
function csOpen(message){
   initmsg = accessKey + "," + accessKey + "," +  "Ross";
   console.log(initmsg);
   connSocket.send(initmsg);
}

///If you want to flip a message to the server/user, call this!
function csSendMessage(msg){
   newMsg = msgString + msg;
   connSocket.send(newMsg);
}

function csGetMessage(message){
    console.log("conn recvd: " + message.data);
    //console.log(messageCount);
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
   document.getElementById("botKey").value = "ywpjqFv1RO0Urbdes15IxfaIdLV1cEFIsQp30YS5v-VeY_v2o2DCSfRgCihT3kSDqLONXtWh_QwOWN6wIXBvSdPvcH-CHkcWGBSccgiVAkwWQimpcjStcRnHcz_o3nQ0jCV1VrrhLPIHZ2h1pkapjacaCkGYgFJsADhZhry4DMtflMU-sqOJ6kWzbzD7oHiUaE8fSwahuRd04bLPbO8zjQDeSGJhu55zt95e2OmoxmRvasQYQsIxUVFABqyRlIXQ_RipHHuOXLbJrKh7NUKTzLhcIJ9tlRQFPwQn01_SH1LJ9ZO0YzchOKYpej4Pqf13R82IVK5DLSdYHnbyu_pgsA";
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
	    width: '75%',
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
    } else {
      session.publish(publisher, handleError);

    }
  });
}
