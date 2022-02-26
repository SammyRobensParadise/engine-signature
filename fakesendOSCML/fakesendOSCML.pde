import oscP5.*;
import netP5.*;
  
OscP5 oscP5;
NetAddress myRemoteLocation;

void setup() {
  size(300,80);
  frameRate(60);
  oscP5 = new OscP5(this,12001);
  myRemoteLocation = new NetAddress("127.0.0.1",12000);
}

void draw() {
  background(0);
  text("Sending OSC...", 20,30);
  if(random(1) <0.2){
    oscSend();
  }
}

void oscSend() {
  /* in the following different ways of creating osc messages are shown by example */
  OscMessage myMessage = new OscMessage("/wek/outputs");
  
  float r = random(1);
  if(r < 0.25) {
    myMessage.add(1.0);
    myMessage.add(0.0);
    myMessage.add(0.0);
    myMessage.add(0.0);
  } else if (r < 0.5){
    myMessage.add(0.0);
    myMessage.add(1.0);
    myMessage.add(0.0);
    myMessage.add(0.0);  
  } else if (r < 0.75){
    myMessage.add(0.0);
    myMessage.add(0.0);
    myMessage.add(1.0);
    myMessage.add(0.0);  
  } else {
    myMessage.add(0.0);
    myMessage.add(0.0);
    myMessage.add(0.0);
    myMessage.add(1.0);  
  } 
  /* send the message */
  oscP5.send(myMessage, myRemoteLocation); 
}