var smarti = require("Smartibot");

var failsafeInterval = 100; //how often setInterval used for failsafe is run
var failsafeLevel = 20; //how many times the failsafenterval must be triggered to activate failsafe... to get full failsafe time multiply the two values together
var failsafeCount = 0;
var failsafeActive = false;

var steeringActuator = 5; // use more or less than 50 percent to move the actuator, leave at 50 to hold actuator
var throttle = 10; //use 50 percent servo to sit idle

//called when no user command recieved in
function failSafe(){
   smarti.setServo(throttle, 50);
   smarti.setServo(steeringActuator, 50);
   failsafeActive = false;
   failsafeCount = 0;
}


//called when user command is reieved to engage failsafe logic
function activateFailsafe(){
    failsafeActive = true;
    failsafeCount = 0;
}
//handle input from phone
function go(drive){
 activateFailsafe();
//throttle
 if (drive == "B"){
    smarti.setLEDs([0,0,50],[0,0,50]);
    smarti.setServo(throttle, 20);

 }
 if (drive == "F"){
   smarti.setLEDs([50,0,0],[50,0,0]);
   smarti.setServo(5, 50);
  }

//turning
 if (drive == "R"){
   smarti.setLEDs([50,0,50],[60,0,50]);
   smarti.setServo(steeringActuator, 81);
 }
 if (drive == "L"){
   smarti.setLEDs([50,0,50],[50,0,50]);
   smarti.setServo(steeringActuator, 19);
 }

  if (drive == "S"){
    smarti.setLEDs([0,50,0],[0,50,0]);
    smarti.setServo(throttle, 50);
    smarti.setServo(steeringActuator, 50);
 }

 //Testing max vals of servo
 if (drive == "P"){
    smarti.setServo(steeringActuator, 50);
    smarti.setServo(throttle, 0);
 }
 if (drive == "Z"){
    smarti.setServo(steeringActuator, 50);
    smarti.setServo(throttle, 100);
 }
}


//setInterval() -> run function in first arg every ms interval in second arg
setInterval(function() {
  if(failsafeActive){
     failsafeCount++;
     if(failsafeCount >= failsafeLevel){
        activateFailsafe();
     }
 }
}, failSafeinterval);
