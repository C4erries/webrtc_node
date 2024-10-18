"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(userId, socket) {
        this.id = userId;
        this.socket = socket;
    }
    return User;
}());
exports.User = User;
