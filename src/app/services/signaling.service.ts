import { Injectable } from '@angular/core';
import AgoraRTM, { RTMStreamChannel } from 'agora-rtm-sdk';
import { ChannelType } from 'agora-rtm-sdk';

import { IRtmInfo } from '../models/rtm';

@Injectable({
  providedIn: 'root',
})
export class SignalingService {
  chatRoom = 'Chat_room';
  rtmInfo: IRtmInfo = {
    rtmUId: '',
    rtmClient: null,
    rtmChannel: null,
  };
  rtmoptions ={ withMetadata : true, withPresence : true, withMessage: true, beQuiet: true };
  constructor() {}

  initializetheSignalingengine(appId: string) {
    try {
      const userId = this.rtmInfo.rtmUId;
      return new AgoraRTM.RTM(appId, userId);
    } catch (status) {
      console.error('Error', status);
    }
  }

  Signalingevents() {
    // Message event handler.
    const rtm = this.rtmInfo.rtmClient;
    rtm.addEventListener('message', (event) => {
      console.log('message ', event);
      // this.showMessage(event.publisher, event.message);
    });

    // Presence event handler.
    rtm.addEventListener('presence', (event) => {
      if (event.eventType === 'SNAPSHOT') {
        this.showMessage('INFO', 'I Join');
      } else {
        this.showMessage('INFO', event.publisher + ' is ' + event.eventType);
      }
    });

    // Connection state changed event handler.
    rtm.addEventListener('status', (event) => {
      // The current connection state.
      const currentState = event.state;
      // The reason why the connection state changes.
      const changeReason = event.reason;
      this.showMessage('INFO', JSON.stringify(event));
    });

    rtm.addEventListener("topic", event => {
      console.log('topic ', event);
    });

    rtm.addEventListener("storage", event => {
      console.log('storage ', event);

    });

    rtm.addEventListener("lock", event => {
      console.log('lock', event);

    });

rtm.addEventListener('linkState', event => {
  console.log('linkState', event);

});

rtm.addEventListener("tokenPrivilegeWillExpire", (channelName) => {
  console.log('tokenPrivilegeWillExpire', channelName);

});
  }

  async establishconnection(token: string) {
    // Log in to Signaling
    try {
      const result = await this.rtmInfo.rtmClient.login({ token });
      console.log(result);
    } catch (status) {
      console.error(status, 'status');
    }
  }
  private showMessage(publisher: string, message: string): void {
    console.log(`${publisher}: ${message}`);
  }

  // Send a message to a channel
  async distributemessage(msChannelName: string, message: string) {
    const payload = { type: 'text', message: message };
    const publishMessage = JSON.stringify(payload);
    const publishOptions = {channelType: 'MESSAGE' as ChannelType};
    try {
      const result = await this.rtmInfo.rtmClient.publish(
        msChannelName,
        publishMessage,
        publishOptions
      );
      console.log(result);
    } catch (status) {
      console.log(status);
    }
  }
    // Subscribe to a channel
  async receivemessages(msChannelName: string) {
console.log('receivemessages',msChannelName);
    try {

      const result = await this.rtmInfo.rtmClient.subscribe(msChannelName, this.rtmoptions);
      console.log(result, this);
    } catch (status) {
      console.log(status);
    }
  }

      // Unsubscribe from a channel
  async Unsubscribemessages(msChannelName: string) {
    console.log('Unsubscribemessages', msChannelName);
    try {
      const result = await this.rtmInfo.rtmClient.unsubscribe(msChannelName);
      console.log(result);
    } catch (status) {
      console.log(status);
    }
  }

  async closingconnection() {
    // Logout of Signaling
    try {
      await this.rtmInfo.rtmClient.logout();
      // await this.rtmInfo.rtmChannel.leave();
    } catch (status) {
      const { operation, reason, errorCode } = status;
      console.log(
        `${operation} failed, the error code is ${errorCode}, because of: ${reason}.`
      );
    }
  }

  createRtmChannel(channel) {
    return this.rtmInfo.rtmClient.createStreamChannel(channel); // demoChannel
  }

  async joinchannel(token) {
    try {
      const opt = {...this.rtmoptions, ...{token}};
      console.log('joinchannel', opt, this);
      await this.rtmInfo.rtmChannel.join(opt);
    } catch (error) {
      console.log(error);
    }
  }

  async setLocalAttributes(name: string, channel) {
   const obj = {
      key : "name",
      value :name
    }
    const data = [obj];  
    const options = { addTimeStamp : true, addUserId : true };

    try {
      await this.rtmInfo.rtmClient.storage.setChannelMetadata(channel, 'MESSAGE' as ChannelType, data, options);

      await this.rtmInfo.rtmClient.storage.setUserMetadata(data);
    } catch (status) {
      console.log(JSON.stringify(status));
    }
  }

  async getLocalattributes(userId) {
    try {
      const getUserInfo =
      await this.rtmInfo.rtmClient.storage.getUserMetadata({userId});
  
    console.log('user updateUserInfo',  getUserInfo);
    return getUserInfo;
    } catch (error) {
      console.log(error);
      
    }

  }

  getchannelattributes(channel) {
    try {
      return this.rtmInfo.rtmClient.storage.getChannelMetadata(channel, 'MESSAGE' as ChannelType);
  } catch (error) {
    console.log(error);
  }
}

getusermetadata() {
  try {
    return this.rtmInfo.rtmClient.storage.subscribeUserMetadata(this.rtmInfo.rtmUId);
} catch (error) {
  console.log(error);
}
}

}
