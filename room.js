"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var user_1 = require("./user");
require("ws");
var Room = /** @class */ (function () {
    function Room(roomId) {
        var _this = this;
        this.users = new Map([]);
        this.getUsersIds = function () {
            var usersIds = [];
            _this.users.forEach(function (user) { return usersIds.push(user.id); });
            return usersIds;
        };
        this.addUser = function (userId, client) {
            console.log(userId);
            _this.users.set(userId, new user_1.User(userId, client));
            return true;
        };
        this.sendAnswer = function (senderId, receiverId, answer) {
            // add for all users ( receiverId == "all" )
            var receiver = _this.users.get(receiverId);
            if (receiver)
                receiver.socket.send(JSON.stringify({
                    "event": "answer",
                    "data": {
                        "senderId": senderId,
                        "receiverId": receiverId,
                        "answer": answer,
                    }
                }));
        };
        this.sendCandidate = function (senderId, receiverId, ice) {
            var receiver = _this.users.get(receiverId);
            if (receiver)
                receiver.socket.send(JSON.stringify({
                    "event": "candidate",
                    "data": {
                        "senderId": senderId,
                        "receiverId": receiverId,
                        "candidate": ice,
                    }
                }));
        };
        this.sendOffer = function (senderId, receiverId, offer) {
            var receiver = _this.users.get(receiverId);
            if (receiver)
                receiver.socket.send(JSON.stringify({
                    "event": "offer",
                    "data": {
                        "senderId": senderId,
                        "receiverId": receiverId,
                        "offer": offer,
                    }
                }));
        };
        this.id = roomId;
    }
    return Room;
}());
exports.Room = Room;
