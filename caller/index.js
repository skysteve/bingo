(function () {
'use strict';

// TODO find types
class GoogleCast {
    constructor() {
        this.sessions = [];
        const sessionRequest = new chrome.cast.SessionRequest('2B0E5446');
        const apiConfig = new chrome.cast.ApiConfig(sessionRequest, this.sessionListener.bind(this), this.receiverListener.bind(this));
        chrome.cast.initialize(apiConfig, this.onInitSuccess.bind(this), this.onError.bind(this));
        this.elButtons = document.querySelectorAll('.aCast');
        this.elButtons.forEach(elButton => elButton.addEventListener('click', this.onCastClick.bind(this)));
        this.elCastIcons = document.querySelectorAll('.castIcon');
    }
    isAvailable() {
        return this.sessions.length > 0;
    }
    set onMessage(fn) {
        this.onMsgCB = fn;
    }
    sendMessage(msg) {
        this.sessions.forEach((session) => {
            session.namespaces.forEach(namesp => session.sendMessage(namesp.name, msg));
        });
    }
    sessionListener(session) {
        this.sessions.push(session);
        console.log('Cast session initialised');
        this.elCastIcons.forEach(el => el.textContent = 'cast_connected');
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
    receiverListener(e) {
        if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
            console.log('cast receivers available');
            this.elCastIcons.forEach(el => el.removeAttribute('style'));
        }
        else if (e === chrome.cast.ReceiverAvailability.UNAVAILABLE) {
            console.log('cast receivers unavailable');
            this.elCastIcons.forEach(el => el.setAttribute('style', 'display:none;'));
        }
        else {
            console.log('receiver event', e);
            this.onMsgCB(e);
        }
    }
    onSessionUpdate(session, msg) {
        // if session stopped, remove from the sessions list
        if (session.status === chrome.cast.SessionStatus.STOPPED) {
            const index = this.sessions.findIndex(ses => ses.sessionId === session.sessionId);
            this.sessions.splice(index, 1);
        }
        if (!this.isAvailable()) {
            this.elCastIcons.forEach(el => el.textContent = 'cast');
        }
    }
    onInitSuccess() {
        console.log('cast initialised successfully');
    }
    onError() {
        console.log('cast error', arguments);
    }
    onRequestSessionSuccess(session) {
        if (session) {
            this.sessionListener(session);
        }
        console.log('cast session success', arguments);
    }
    onLaunchError() {
        console.log('cast launch error', arguments);
    }
    onCastClick() {
        // if connected, disconnect
        if (this.isAvailable()) {
            this.sessions[0].stop(() => { }, () => { });
            return;
        }
        // otherwise connect
        chrome.cast.requestSession(this.onRequestSessionSuccess.bind(this), this.onLaunchError.bind(this));
    }
}

class ChannelManager {
    constructor() {
        if (window.BroadcastChannel) {
            this.chanelBroadcast = new window.BroadcastChannel('__BUS_NAME__');
            this.chanelBroadcast.onmessage = this.onChannelMsg.bind(this, 'broadcast');
        }
        window['__onGCastApiAvailable'] = this.onCastAvailable.bind(this);
    }
    set onmessage(fn) {
        this.onMsgCb = fn;
    }
    sendMessage(msg) {
        if (this.chanelBroadcast) {
            this.chanelBroadcast.postMessage(msg);
        }
        if (this.channelCast && this.channelCast.isAvailable()) {
            this.channelCast.sendMessage(msg);
        }
    }
    onChannelMsg(channel, msg) {
        this.onMsgCb(Object.assign(msg, {
            channel
        }));
    }
    onCastAvailable(isAvailable) {
        if (isAvailable) {
            this.channelCast = new GoogleCast();
            this.channelCast.onMessage = this.onChannelMsg.bind(this, 'cast');
        }
        else {
            delete this.channelCast;
        }
    }
}

/**
 * Created by steve on 15/11/2016.
 */
/**
 * Created by steve on 15/11/2016.
 */ class Game {
    constructor() {
        const recoveredValues = window.sessionStorage.getItem('currentGame');
        const recoveredLastNumber = window.sessionStorage.getItem('lastNumber');
        this.currentGame = recoveredValues ? JSON.parse(recoveredValues) : [];
        this.lastNumber = recoveredLastNumber ? parseInt(recoveredLastNumber, 10) : null;
    }
    get calledNumbers() {
        return this.currentGame;
    }
    get latestNumber() {
        return this.lastNumber;
    }
    nextNumber() {
        // check the game isn't over
        if (this.currentGame.length >= 99) {
            return -1;
        }
        // get the next number which hasn't already been called
        let number = Game.getNumber();
        while (this.currentGame.includes(number)) {
            number = Game.getNumber();
        }
        this.currentGame.push(number);
        this.lastNumber = number;
        window.sessionStorage.setItem('lastNumber', number.toString());
        window.sessionStorage.setItem('currentGame', JSON.stringify(this.currentGame));
        return number;
    }
    reset() {
        this.currentGame = [];
        window.sessionStorage.removeItem('lastNumber');
        window.sessionStorage.removeItem('currentGame');
    }
    static getNumber() {
        return Math.floor(Math.random() * 99) + 1;
    }
}

/**
 * Created by steve on 15/11/2016.
 */
document.addEventListener('DOMContentLoaded', () => {
    const channelManager = new ChannelManager();
    const game = new Game();
    let displayConnected = false;
    const elements = {
        buttons: {
            callNumber: document.querySelector('#btn-call'),
            resetGame: document.querySelector('#btn-reset')
        },
        display: {
            lastCalled: document.querySelector('#latest-number'),
            previousNumbers: document.querySelector('#table-last-called')
        }
    };
    // recover game in case of refresh
    game.calledNumbers.forEach(number => elements.display.previousNumbers.setCalled(number));
    elements.display.lastCalled.textContent = game.latestNumber || '-';
    elements.buttons.callNumber.addEventListener('click', () => {
        const number = game.nextNumber();
        // add the number to our current list
        elements.display.previousNumbers.setCalled(number);
        elements.display.lastCalled.textContent = number.toString();
        // send the number to the next tab
        channelManager.sendMessage({
            messageType: 'called',
            number: number
        });
    });
    elements.buttons.resetGame.addEventListener('click', () => {
        game.reset();
        elements.display.previousNumbers.reset();
        elements.display.lastCalled.textContent = '-';
        channelManager.sendMessage({
            messageType: 'reset'
        });
    });
    channelManager.onmessage = (e) => {
        switch (e.data.messageType) {
            case 'display_connected':
                displayConnected = true;
                channelManager.sendMessage({
                    messageType: 'active_game',
                    calledNumbers: game.calledNumbers,
                    latestNumber: game.latestNumber
                });
                break;
            case 'display_disconnected':
                displayConnected = false;
                break;
            default:
                console.warn('Unknown message type', e.data);
        }
    };
    window.addEventListener('beforeunload', () => {
        channelManager.sendMessage({
            messageType: 'caller_disconnected'
        });
    });
    channelManager.sendMessage({
        messageType: 'caller_connected'
    });
});

}());
//# sourceMappingURL=index.js.map
