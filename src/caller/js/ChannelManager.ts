/**
 * Created by steve on 20/11/2016.
 */
declare var window;

import {GoogleCast} from './googleCast';

export class ChannelManager {
  private channelCast: GoogleCast;
  private chanelBroadcast: any;
  private onMsgCb: Function;

  constructor() {
    if (window.BroadcastChannel) {
      this.chanelBroadcast = new window.BroadcastChannel('__BUS_NAME__');
      this.chanelBroadcast.onmessage = this.onChannelMsg.bind(this, 'broadcast');
    }
    window['__onGCastApiAvailable'] = this.onCastAvailable.bind(this);
  }

  public set onmessage(fn: Function) {
    this.onMsgCb = fn;
  }

  public sendMessage(msg): void {
    if (this.chanelBroadcast) {
      this.chanelBroadcast.postMessage(msg);
    }

    if (this.channelCast && this.channelCast.isAvailable()) {
      this.channelCast.sendMessage(msg);
    }
  }

  private onChannelMsg(channel: string, msg: any): void {
    this.onMsgCb(Object.assign(msg, {
      channel
    }));
  }

  private onCastAvailable(isAvailable: boolean) {
    if (isAvailable) {
      this.channelCast = new GoogleCast();
      this.channelCast.onMessage = this.onChannelMsg.bind(this, 'cast');
    } else {
      delete this.channelCast;
    }
  }
}
