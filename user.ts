import {WebSocket} from 'ws'
export class User{
    id: string;
    socket: WebSocket;
    constructor(userId: string, socket: WebSocket) {
        this.id = userId;
        this.socket = socket;
    }

}