import { Injectable } from '@angular/core';
import AgoraRTM from 'agora-rtm-sdk';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {

  constructor() { }

  initializetheSignalingengine(appId, userId){
    try {
      const rtm = new AgoraRTM.RTM(appId, userId);
      return rtm;
    } catch (status) {
      console.log("Error");
      console.log(status);
    }    
  }

  Signalingevents(rtm){
    // Message event handler.
rtm.addEventListener("message", event => {
  this.showMessage(event.publisher, event.message);
});

// Presence event handler.
rtm.addEventListener("presence", event => {
  if (event.eventType === "SNAPSHOT") {
    this.showMessage("INFO", "I Join");
  }
  else {
    this.showMessage("INFO", event.publisher + " is " + event.eventType);
  }
});

// Connection state changed event handler.
rtm.addEventListener("status", event => {
  // The current connection state.
  const currentState = event.state;
  // The reason why the connection state changes.
  const changeReason = event.reason;
  this.showMessage("INFO", JSON.stringify(event));
});

  }

  async establishconnection (rtm, token)
  {
    console.log(token, 'hbvjh');
    
    // Log in to Signaling
try {
  const result = await rtm.login({ token });
  console.log(result);
} catch (status) {
  console.log(status, 'dgxfgxfd');
  }


}
private showMessage(publisher: string, message: string): void {
  console.log(`${publisher}: ${message}`);
}

  distributemessage(rtm, userId, msChannelName){
    // Send a message to a channel
const publishMessage = async (message) => {
  const payload = { type: "text", message: message };
  const publishMessage = JSON.stringify(payload);
  const publishOptions = { channelType: 'MESSAGE'}
  try {
    const result = await rtm.publish(msChannelName, publishMessage, publishOptions);
    this.showMessage(userId, publishMessage);
    console.log(result);
  } catch (status) {
    console.log(status);
  }
}

  }

  async receivemessages(rtm, msChannelName){
// Subscribe to a channel
try {
  const result = await rtm.subscribe(msChannelName);
  console.log(result);
} catch (status) {
  console.log(status);
}

  }

  async Unsubscribemessages (rtm, msChannelName){
    // Unsubscribe from a channel
try {
  const result = await rtm.unsubscribe(msChannelName);
  console.log(result);
} catch (status) {
  console.log(status);
}

  }

  async closingconnection(rtm){
// Logout of Signaling
try {
  const result = await rtm.logout();
} catch (status) {
  const { operation, reason, errorCode } = status;
  console.log(`${operation} failed, the error code is ${errorCode}, because of: ${reason}.`);
}

  }
}
