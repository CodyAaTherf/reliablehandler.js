"use strict";
// 5TH COMMANDSSSSSSEERDDD
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CommandHandler_1 = __importDefault(require("./CommandHandler"));
var ReliableHandler = /** @class */ (function () {
    function ReliableHandler(client, commandsDir, listenerDir) {
        this._defaultPrefix = '>';
        this._commandsDir = 'commands';
        this._listenersDir = '';
        this._mongo = '';
        this._prefixes = {};
        if (!client) {
            throw new Error('[ReliableHandler] DJS Client is required');
        }
        if (!commandsDir) {
            console.warn('[ReliableHandler] No commands directory provided , using default');
        }
        if (module && module.parent) {
            var path = module.parent.path;
            if (path) {
                commandsDir = path + "/" + (commandsDir || this._commandsDir);
            }
        }
        this._commandsDir = commandsDir || this._commandsDir;
        this._commandHandler = new CommandHandler_1.default(this, client, this._commandsDir);
    }
    Object.defineProperty(ReliableHandler.prototype, "prefixes", {
        get: function () {
            return this._prefixes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReliableHandler.prototype, "defaultPrefix", {
        get: function () {
            return this._defaultPrefix;
        },
        enumerable: false,
        configurable: true
    });
    ReliableHandler.prototype.setDefaultPrefix = function (prefix) {
        this._defaultPrefix = this.defaultPrefix;
        return this;
    };
    ReliableHandler.prototype.getPrefix = function (guild) {
        return this._prefixes[guild ? guild.id : ''] || this._defaultPrefix;
    };
    Object.defineProperty(ReliableHandler.prototype, "commands", {
        get: function () {
            return this._commandHandler.commands;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReliableHandler.prototype, "commandAmount", {
        get: function () {
            return this.commands.length;
        },
        enumerable: false,
        configurable: true
    });
    return ReliableHandler;
}());
module.exports = ReliableHandler;
