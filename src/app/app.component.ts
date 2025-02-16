import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StreamService } from './services/stream.service';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { SignalingService } from './services/signaling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'video-app';

  constructor(private router: Router,
    public stream: StreamService,
    public api: ApiService,
    public signaling: SignalingService
  ){
    this.getAppDetails();
  }
  open(value){
    localStorage.setItem('user', value);
    this.router.navigate([`/user/${value}`]);
  }

  async getAppDetails() {
    const url = 'https://agora-tokens-80k1.onrender.com/appDetails';
    const opts = {
      params: new HttpParams({ fromString: 'channelName=' + 'test' }),
    };
    const data = await this.api.getRequest(url, opts.params).toPromise();
    console.log(data, 'getAppDetails');
    this.stream.options.appId = data['appid'];
    this.stream.options.channel = data['channelName'];
  }
}
