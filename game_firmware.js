var smarti = require("Smartibot");
var counting = false;
var lookUp = false;
var lookDw = false;
var lookSt = false;
var stopping = false;
var stopping2 = false;
var count = 0;
var step = 2;


//Basic firmware to make the robot work, don't edit
Modules.addCached("Smartibot",`function e(){a.writeTo(88,[0,0]);a.writeTo(88,[0,16]);a.writeTo(88,[254,112]);a.writeTo(88,[0,0]);a.writeTo(88,[0,161])}exports.M1=[D4,D6];exports.M2=[D10,D11];var a=new I2C;a.setup({sda:D27,scl:D28});exports.E1={i2c:a,ad:D0,"int":D1};exports.E2={i2c:a,ad:D30,"int":D26};exports.setLEDs=function(a,b){var d=new Uint8Array(16);d[4]=255;d[8]=255;d.fill(255,12);d.set(a,5);d.set(b,9);var c=new SPI;c.setup({mosi:D8,sck:D7});c.write(d)};exports.setMotor=function(a,b){var d=[void 0,D4,D10,D2,D9][a],
c=[void 0,D6,D11,D3,D12][a];0===b&&(digitalWrite(d,0),digitalWrite(c,0));0<b?(digitalwrite(d,0),analogwrite(c,b)):(digitalwrite(c,0),analogwrite(d,-b))};e();e.on("init",e);exports.setservo=function(c,b){if(1>c||10<c)throw"num out="" of="" range";b="130+4*b;if(1">b||4095<b)throw"val out="" of="" range";a.writeto(88,[6+4*(c-1),0,0,b,b="">>8])}`);
(function(){var s=require("Smartibot"),m=s.setMotor.bind(s);
if("undefined"==typeof aiReset)aiReset=_=>s.setLEDs([90,24,77],[90,24,77]);
if("undefined"==typeof aiDetect)aiDetect=(a,x,y)=>{
 s.setLEDs([11,82,42],[11,82,42]); var d=50;
 if (x < -5) {m(1,0.7);m(2,0.7);
 } else if (x > 5) {m(1,-0.7);m(2,-0.7);
 } else {d=100;m(1,0.7);m(2,-0.7);}
 setTimeout(_=>{m(1,0);m(2,0);}, d);
};})();

//Set the start position of servos
smarti.setServo(1,80);
smarti.setServo(5,20);

//Set the Bluetooth advertising name for the robot
NRF.setAdvertising({}, {name: "Smartibot Test"});



//The code that runs when different driving commands are received from the pilot
//Change these to change how the robot responds to control inputs
function goC(drive) {
  if (drive == "B"){
 smarti.setLEDs([0,0,50],[0,0,50]);
 smarti.setMotor(1,-0.95);
 smarti.setMotor(2,0.95);
  step = 5;
 counting = true;
 }
 if (drive == "R"){
 smarti.setLEDs([50,0,50],[60,0,50]);
 smarti.setMotor(1,-0.7);
 smarti.setMotor(2,-0.7);
   step = 5;
 counting = true;
 }
 if (drive == "L"){
 smarti.setLEDs([50,0,50],[50,0,50]);
 smarti.setMotor(1,0.7);
 smarti.setMotor(2,0.7);
   step = 5;
 counting = true;
 }
  if (drive == "LU"){
 smarti.setServo(1,35);
 smarti.setServo(5,65);

 } 
  if (drive == "LD"){
 smarti.setServo(1,80);
 smarti.setServo(5,20);  
 
 }
 else if (drive == "F"){
 smarti.setLEDs([50,0,0],[50,0,0]);
 smarti.setMotor(1,0.95);
 smarti.setMotor(2,-0.95);
   step = 10;
 counting = true;
 }
 else if (drive == "S"){
 smarti.setLEDs([0,50,0],[0,50,0]);
 smarti.setMotor(1,0);
 smarti.setMotor(2,0);
 }
}
setInterval(function () {
  if (counting == true){
 count = count + 1;
 }
 if (count > step){
 counting = false;
 count = 0;
 smarti.setMotor(1,0);
 smarti.setMotor(2,0);
}
 }, 25);
