"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var room_1 = require("./room");
var ws_1 = require("ws");
var SOCKET_URL = "ws://localhost:8080/";
var Main = function () {
    var server = new ws_1.WebSocketServer({ port: 8080 });
    //const clients : Array<WebSocket> = []
    var onConnect = function (client) {
        console.log('Новый пользователь');
        client.on('message', function (data) { return onMessage(data, client); });
        //clients.push(client)
        client.on('close', function () { console.log('Пользователь отключился'); });
    };
    var rooms = new Map([["r1", new room_1.Room("r1")]]);
    var onMessage = function (message, client) {
        // const data = toString
        var parsed = JSON.parse(message);
        console.log(parsed.event);
        switch (parsed.event) {
            case "getRooms": {
                var roomsIds_1 = [];
                rooms.forEach(function (value, key) { return roomsIds_1.push(key); });
                client.send(JSON.stringify({
                    "event": "sendRooms",
                    "data": {
                        "roomsIds": roomsIds_1,
                    }
                }));
                break;
            }
            case "createRoom": {
                var data = parsed.data;
                rooms.set(data.roomId, new room_1.Room(data.roomId));
                //добавить ответ (успешно либо ошибка)
                break;
            }
            case "joinRoom": {
                var join = parsed.data;
                var room = rooms.get(join.roomId);
                room.addUser(join.userId, client);
                client.send(JSON.stringify({
                    "event": "getUsers",
                    "data": {
                        roomId: room.id,
                        usersIds: room.getUsersIds(),
                    }
                }));
                break;
            }
            case "answer": {
                var ansMessage = parsed.data;
                rooms.get(ansMessage.roomId).sendAnswer(ansMessage.senderId, ansMessage.receiverId, ansMessage.answer);
                break;
            }
            case "candidate": {
                var iceMessage = parsed.data;
                if (!iceMessage.candidate)
                    break;
                rooms.get(iceMessage.roomId).sendCandidate(iceMessage.senderId, iceMessage.receiverId, iceMessage.candidate);
                break;
            }
            case "offer": {
                var offerMessage = parsed.data;
                rooms.get(offerMessage.roomId).sendOffer(offerMessage.senderId, offerMessage.receiverId, offerMessage.offer);
                break;
            }
            default: {
                console.log("Default" + parsed.event);
                break;
            }
        }
    };
    server.on('connection', onConnect);
    //server.listen(8080)
};
Main();
