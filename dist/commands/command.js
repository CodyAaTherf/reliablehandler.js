"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var disabled_commands_1 = __importDefault(require("../modles/disabled-commands"));
module.exports = {
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: '<"enable"|"disable"> <command>',
    callback: function (message, args, text, client, prefix, instance) { return __awaiter(void 0, void 0, void 0, function () {
        var newState, name, guild, _a, _b, names, mainCommand, isDisabled, e_1_1;
        var e_1, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    newState = (_d = args.shift()) === null || _d === void 0 ? void 0 : _d.toLowerCase();
                    name = (_e = args.shift()) === null || _e === void 0 ? void 0 : _e.toLowerCase();
                    if (newState !== 'enable' && newState !== 'disable') {
                        message.reply('Please provide a valid state');
                        return [2 /*return*/];
                    }
                    guild = message.guild;
                    if (!guild) {
                        message.reply('This command can only be used in a guild');
                        return [2 /*return*/];
                    }
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 9, 10, 11]);
                    _a = __values(instance.commands), _b = _a.next();
                    _f.label = 2;
                case 2:
                    if (!!_b.done) return [3 /*break*/, 8];
                    names = _b.value.names;
                    if (!names.includes(name)) return [3 /*break*/, 7];
                    mainCommand = names[0];
                    isDisabled = instance.commandHandler.isCommandDisabled(guild.id, mainCommand);
                    if (!(newState === 'enable')) return [3 /*break*/, 4];
                    if (!isDisabled) {
                        message.reply('This command is already enabled');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, disabled_commands_1.default.deleteOne({
                            guildId: guild.id,
                            command: mainCommand,
                        })];
                case 3:
                    _f.sent();
                    instance.commandHandler.enableCommand(guild.id, mainCommand);
                    message.reply('Command enabled');
                    return [3 /*break*/, 6];
                case 4:
                    if (isDisabled) {
                        message.reply('This command is already disabled');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new disabled_commands_1.default({
                            guildId: guild.id,
                            command: mainCommand,
                        }).save()];
                case 5:
                    _f.sent();
                    instance.commandHandler.disableCommand(guild.id, mainCommand);
                    message.reply('Command disabled');
                    _f.label = 6;
                case 6: return [2 /*return*/];
                case 7:
                    _b = _a.next();
                    return [3 /*break*/, 2];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 11:
                    message.reply('Command not found');
                    return [2 /*return*/];
            }
        });
    }); }
};
