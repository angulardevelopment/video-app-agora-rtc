import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StreamService } from '../services/stream.service';
import { SignalingService } from '../signaling.service';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {

  hideBtns = true;

  constructor(public stream: StreamService, public api: ApiService, 
    public signaling: SignalingService) {
  }

  ngOnInit() {
    this.rtmLogin();

  }

  async rtmLogin(){
    try {
      const uid = this.generateUid();
    const data: any = await this.generateRtmTokenAndUid(uid);
   
    const rtm = this.signaling.initializetheSignalingengine(this.stream.options.appId, uid);
    console.log(data,rtm, 'rtmLogin')
    await this.signaling.establishconnection(rtm, data.token);
    this.signaling.Signalingevents(rtm)
    } catch (error) {
      console.log(error, 'hbhjbv');
    }
    
  }

  async startCall() {
      // const uid = this.generateUid();
      // const rtcDetails = await this.generateTokenAndUid(uid);
      // this.stream.createRTCClient();
      // this.stream.agoraServerEvents(this.stream.rtc);
      // await this.stream.localUser(rtcDetails.token, uid);

      // this.hideBtns = false;
  }

// rtc token
async generateTokenAndUid(uid: number) {
  const url = 'http://localhost:8080/rtcToken'
      const opts = {
    params: new HttpParams({ fromString:  'channelName=test&uid=' + uid }),
  };
  const data = await this.api.getRequest(url, opts.params).toPromise();
  console.log(data, 'generateTokenAndUid')
  return { uid: uid, token: data['key'] };
}

async generateRtmTokenAndUid(uid: string) {
  const url = 'http://localhost:8080/rtmToken'
  const opts = { params: new HttpParams({ fromString:  'account=' + uid }) };
  const data = await this.api.getRequest(url, opts.params).toPromise();
  console.log(data, 'generateRtmTokenAndUid')

  return { uid: uid, token: data['key'] };
}

  generateUid() {
    const length = 5;
    const randomNo = (Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)));
    return randomNo.toString();
  }




  async logout() {
    await this.stream.leaveCall();
  }


}
