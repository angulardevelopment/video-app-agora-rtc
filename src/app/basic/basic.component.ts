import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StreamService } from '../services/stream.service';
import { SignalingService } from '../services/signaling.service';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {
  userName='';
  hideBtns = true;

  constructor(public stream: StreamService, public api: ApiService, 
    public signaling: SignalingService) {
      
  }

  ngOnInit() {
    // this.rtmLogin();

  }

  async rtmLogin(){
    try {
      const uid = this.generateUid();
      const rtcuid = this.generateUid();
    this.signaling.rtmInfo.rtmUId= uid;
    const data = await this.generateRtmTokenAndUid();
    const rtcdata = await this.generatertcTokenAndUid(rtcuid, this.stream.options.channel);

   this.signaling.rtmInfo.rtmClient = this.signaling.initializetheSignalingengine(this.stream.options.appId);
   this.signaling.rtmInfo.rtmChannel = this.signaling.createRtmChannel(this.stream.options.channel);
    await this.signaling.establishconnection(data.token);

    // await this.signaling.joinchannel(rtcdata.token);
    await this.signaling.setLocalAttributes(this.userName, this.stream.options.channel); 
    await this.buttonClick(); 
    this.signaling.Signalingevents();
    this.signaling.receivemessages(this.stream.options.channel);
    this.signaling.getchannelattributes(this.stream.options.channel);
    this.signaling.getusermetadata(); 
    this.hideBtns = false;
    console.log(data,this, 'c')
    } catch (error) {
      console.log(error, 'error');
    }
    
  }

  buttonClick = async () => {
    let textInput = document.getElementById("textInput") as HTMLInputElement;
    await this.signaling.distributemessage(this.stream.options.channel, textInput.value);
  }

  // async startCall() {
      // const uid = this.generateUid();
      // const rtcDetails = await this.generateTokenAndUid(uid);
      // this.stream.createRTCClient();
      // this.stream.agoraServerEvents(this.stream.rtc);
      // await this.stream.localUser(rtcDetails.token, uid);

      // this.hideBtns = false;
  // }


async generatertcTokenAndUid(uid, channelName) {
  const url = 'https://agora-tokens-80k1.onrender.com/rtcToken';
  const opts = {
    params: new HttpParams({ fromString: `channelName=${channelName}&uid=` + uid }),
  };
  const data = await this.api.getRequest(url, opts.params).toPromise();
  console.log(data, 'rtcTokenAndUid');
  return { uid: uid, token: data['key'] };
}

async generateRtmTokenAndUid() {
  const url = 'https://agora-tokens-80k1.onrender.com/rtmToken';
  const opts = { params: new HttpParams({ fromString: 'account=' + this.signaling.rtmInfo.rtmUId }) };
  const data = await this.api.getRequest(url, opts.params).toPromise();
  return { uid: this.signaling.rtmInfo.rtmUId, token: data['key'] };
}

  generateUid() {
    const length = 5;
    const randomNo = (Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)));
    return randomNo.toString();
  }




  async logout() {
    await this.stream.leaveCall();
  }

  async logoutRtm() {
  this.hideBtns = true;

    await this.signaling.closingconnection();
  }

  hjh(userId){
    this.signaling.getLocalattributes(userId)
  }

}
