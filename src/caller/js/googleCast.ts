import {ChannelManager} from "./ChannelManager";
declare var cast; // TODO find types
declare var chrome;// TODO find types

export class GoogleCast {
  private sessions: Array<any>;
  private onMsgCB: Function;
  private elButton: any;
  private elCastIcon: any;

  constructor() {
    this.sessions = [];
    const sessionRequest = new chrome.cast.SessionRequest('2B0E5446');
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      this.sessionListener.bind(this),
      this.receiverListener.bind(this));

    chrome.cast.initialize(apiConfig, this.onInitSuccess.bind(this), this.onError.bind(this));

    this.elButton = document.querySelector('#aCast');
    this.elButton.addEventListener('click', this.onCastClick.bind(this));

    this.elCastIcon = document.querySelector('#castIcon');
  }

  public isAvailable(): boolean {
    return this.sessions.length > 0;
  }

  public set onMessage(fn: Function) {
    this.onMsgCB = fn;
  }

  public sendMessage(msg: any) {
    this.sessions.forEach((session) => {
      session.namespaces.forEach(namesp => session.sendMessage(namesp.name, msg));
    });
  }

  private sessionListener(session: any) {
    this.sessions.push(session);
    console.log('Cast session initialised');

    this.elCastIcon.textContent = 'cast_connected';

    session.addUpdateListener(this.onSessionUpdate.bind(this, session));

    if (!this.onMsgCB) {
      return;
    }
    this.onMsgCB({
      data: {
        messageType: 'display_connected',
        type: 'cast'
      }
    });
  }

  private receiverListener(e) {
    if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
      console.log('cast receivers available');
      document.querySelector('#castIcon').removeAttribute('style');
    } else if (e === chrome.cast.ReceiverAvailability.UNAVAILABLE) {
      console.log('cast receivers unavailable');
    } else {
      console.log('receiver event', e);
      this.onMsgCB(e);
    }
  }

  private onSessionUpdate(session, msg) {
    // if session stopped, remove from the sessions list
    if (session.status === chrome.cast.SessionStatus.STOPPED) {
      const index = this.sessions.findIndex(ses => ses.sessionId === session.sessionId);
      this.sessions.splice(index, 1);
    }

    if (!this.isAvailable()) {
      this.elCastIcon.textContent = 'cast';
    }
  }

  private onInitSuccess() {
    console.log('cast initialised successfully');
  }

  private onError() {
    console.log('cast error', arguments);
  }

  private onRequestSessionSuccess(session) {
    if (session) {
      this.sessionListener(session);
    }
    console.log('cast session success', arguments);
  }

  private onLaunchError() {
    console.log('cast launch error', arguments);
  }

  private onCastClick() {
    // if connected, disconnect
    if (this.isAvailable()) {
      this.sessions[0].stop(() => {}, () => {});
      return;
    }

    // otherwise connect
    chrome.cast.requestSession(this.onRequestSessionSuccess.bind(this), this.onLaunchError.bind(this));
  }
}
