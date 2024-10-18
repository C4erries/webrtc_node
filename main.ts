import {Answer, Message, Candidate, CreateRoom} from "./types";
import {Room} from "./room";
import {Offer} from "./types";
import {Join} from "./types";
import {v4} from "uuid"
import {WebSocketServer, WebSocket} from 'ws'
const SOCKET_URL =  "ws://localhost:8080/"

const Main = () => {
    const server = new WebSocketServer({port: 8080})
    //const clients : Array<WebSocket> = []
    const onConnect = (client : WebSocket)=>{
        console.log('Новый пользователь')
        client.on('message', (data) => onMessage(data, client))
        //clients.push(client)
        client.on('close', ()=>{console.log('Пользователь отключился')})
    }
    const rooms = new Map<string, Room>([["r1", new Room("r1")]])


    const onMessage = (message:string, client : WebSocket) => {
       // const data = toString

        const parsed : Message = JSON.parse(message)
        console.log(parsed.event)
        switch (parsed.event) {
            case "getRooms":{
                const roomsIds : Array<string> = []
                rooms.forEach((value, key) => roomsIds.push(key))

                client.send(JSON.stringify({
                    "event": "sendRooms",
                    "data": {
                        "roomsIds": roomsIds,
                    }
                }))
                break;
            }
            case "createRoom":{
                const data : CreateRoom = parsed.data
                rooms.set(data.roomId, new Room(data.roomId))
                //добавить ответ (успешно либо ошибка)
                break;
            }
            case "joinRoom": {
                const join : Join = parsed.data
                const room = rooms.get(join.roomId)
                room.addUser(join.userId, client);
                client.send(JSON.stringify({
                    "event": "getUsers",
                    "data": {
                        roomId: room.id,
                        usersIds: room.getUsersIds(),
                    }
                }))
                break;
            }
            case "answer": {
                const ansMessage : Answer = parsed.data
                rooms.get(ansMessage.roomId).sendAnswer(ansMessage.senderId, ansMessage.receiverId, ansMessage.answer)
                break;
            }
            case "candidate": {
                const iceMessage : Candidate = parsed.data
                if(!iceMessage.candidate) break;
                rooms.get(iceMessage.roomId).sendCandidate(iceMessage.senderId, iceMessage.receiverId, iceMessage.candidate)
                break;
            }
            case "offer": {
                const offerMessage : Offer = parsed.data
                rooms.get(offerMessage.roomId).sendOffer(offerMessage.senderId, offerMessage.receiverId, offerMessage.offer)
                break;
            }
            default: {
                console.log("Default" + parsed.event)
                break;
            }
        }
    }

    server.on('connection', onConnect);
    //server.listen(8080)
}
Main()