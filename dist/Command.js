"use strict";
// interface configuration{
//     names: string[] | string
//     minArgs?: number
//     maxArgs?: number
//     expectedArgs: string
//     description?: string
//     callback: Function
// }
var Command = /** @class */ (function () {
    function Command(instance, client, names, callback, _a) {
        var minArgs = _a.minArgs, maxArgs = _a.maxArgs, syntaxError = _a.syntaxError, description = _a.description;
        this._names = [];
        this._minArgs = 0;
        this._maxArgs = -1;
        this._cooldown = [];
        this._callback = function () { };
        this.instance = instance;
        this.client = client;
        this._names = typeof names === 'string' ? [names] : names;
        this._minArgs = minArgs || 0;
        this._maxArgs = maxArgs === undefined ? -1 : maxArgs;
        this._syntaxError = syntaxError;
        this._description = description;
        this._callback = callback;
        if (this._minArgs < 0) {
            throw new Error("[Command] minArgs cannot be less than 0");
        }
        if (this._maxArgs < -1) {
            throw new Error("[Command] maxArgs cannot be less than -1");
        }
        if (this._maxArgs !== -1 && this._maxArgs < this._minArgs) {
            throw new Error("[Command] maxArgs cannot be less than minArgs");
        }
    }
    Command.prototype.execute = function (message, args) {
        this._callback(message, args, args.join(' '), this.client, this.instance.getPrefix(message.guild), this.instance);
    };
    Object.defineProperty(Command.prototype, "names", {
        get: function () {
            return this._names;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "minArgs", {
        get: function () {
            return this._minArgs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "maxArgs", {
        get: function () {
            return this._maxArgs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "expectedArgs", {
        get: function () {
            return this._expectedArgs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "syntaxError", {
        get: function () {
            return this._syntaxError;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Command.prototype.setCooldown = function (member, seconds) {
        if (typeof member !== 'string') {
            member = member.id;
        }
        console.log("[Command] Setting cooldown for " + member + " for " + seconds + " seconds");
    };
    Command.prototype.clearCooldown = function (member, seconds) {
        if (typeof member !== 'string') {
            member = member.id;
        }
        console.log("[Command] Clearing cooldown for " + member + " for " + seconds + " seconds");
    };
    Object.defineProperty(Command.prototype, "callback", {
        get: function () {
            return this._callback;
        },
        enumerable: false,
        configurable: true
    });
    return Command;
}());
module.exports = Command;
