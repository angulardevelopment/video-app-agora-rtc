import AgoraRTM, { RTMClient, RTMStreamChannel }   from 'agora-rtm-sdk';
export type ChannelType = 'STREAM' | 'MESSAGE' | 'USER';


export interface IRtmInfo {
    rtmClient: RTMClient,
  rtmUId: string;
      channelType?: ChannelType;
      rtmChannel?: RTMStreamChannel;
}

