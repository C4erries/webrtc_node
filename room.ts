import {User} from "./user"
import 'ws'
export class Room{
    id: string;
    users = new Map<string, User>([]);
    constructor(roomId: string) {
        this.id = roomId;
    }

    public getUsersIds = () =>{
        const usersIds: Array<string> = []
        this.users.forEach((user)=> usersIds.push(user.id))
        return usersIds;
    }

    public addUser = (userId: string, client):boolean =>{
        console.log(userId)
        this.users.set(userId,new User(userId, client))
        return true
    }

    public sendAnswer = (senderId: string, receiverId: string, answer: RTCSessionDescriptionInit) => {
        // add for all users ( receiverId == "all" )
        const receiver = this.users.get(receiverId)
        if(receiver)
            receiver.socket.send(JSON.stringify({
                "event": "answer",
                "data": {
                    "senderId": senderId,
                    "receiverId": receiverId,
                    "answer": answer,
                }
            }))
    }
    public sendCandidate = (senderId: string, receiverId: string, ice: RTCIceCandidate) => {
        const receiver = this.users.get(receiverId)
        if(receiver)
            receiver.socket.send(JSON.stringify({
                "event": "candidate",
                "data": {
                    "senderId": senderId,
                    "receiverId": receiverId,
                    "candidate": ice,
                }
            }))
    }
    public sendOffer = (senderId: string, receiverId: string, offer: RTCSessionDescriptionInit) => {
        const receiver = this.users.get(receiverId)
        if(receiver)
            receiver.socket.send(JSON.stringify({
                "event": "offer",
                "data": {
                    "senderId": senderId,
                    "receiverId": receiverId,
                    "offer": offer,
                }
            }))
    }



}