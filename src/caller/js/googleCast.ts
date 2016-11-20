import {ChannelManager} from "./ChannelManager";
declare var cast; // TODO find types
declare var chrome;// TODO find types

export class GoogleCast {
  private session: any;
  private onMsgCB: Function;

  constructor() {
    const sessionRequest = new chrome.cast.SessionRequest('2B0E5446');
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      this.sessionListener.bind(this),
      this.receiverListener.bind(this));

    chrome.cast.initialize(apiConfig, this.onInitSuccess, this.onError);
  }

  public isAvailable(): boolean {
    return !!this.session;
  }

  public set onMessage(fn: Function) {
    this.onMsgCB = fn;
  }

  public sendMessage(msg: any) {
    if (this.session) {
      this.session.namespaces.forEach(namesp => this.session.sendMessage(namesp.name, msg));
    }
  }

  private sessionListener(session: any) {
    this.session = session;
    console.log('Cast session initialised');
    this.onMsgCB({
      data: {
        messageType: 'display_connected'
      }
    });
  }

  private receiverListener(e) {
    if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
      console.log('cast receivers available');
    } else if (e === chrome.cast.ReceiverAvailability.UNAVAILABLE) {
      console.log('cast receivers unavailable');
    } else {
      console.log('receiver event', e);
      this.onMsgCB(e);
    }
  }

  private onInitSuccess() {
    console.log('cast initialised successfully');
  }

  private onError() {
    console.log('cast error', arguments);
  }
}

function onRequestSessionSuccess() {
  console.log('cast session success', arguments);
}

function onLaunchError() {
  console.log('cast launch error', arguments);
}

export function onCastClick() {
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}
