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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var Command_1 = __importDefault(require("./Command"));
var get_all_files_1 = __importDefault(require("./get-all-files"));
var disabled_commands_1 = __importDefault(require("./models/disabled-commands"));
var required_roles_1 = __importDefault(require("./models/required-roles"));
var permissions_1 = __importDefault(require("./permissions"));
var CommandHandler = /** @class */ (function () {
    // private _disabled: Map<String , String[]> = new Map()
    function CommandHandler(instance, client, dir) {
        var e_1, _a;
        var _this = this;
        this._commands = new Map();
        if (dir) {
            if (fs_1.default.existsSync(dir)) {
                var files = (0, get_all_files_1.default)(dir);
                console.log("[Command Handler]", files);
                var amount = files.length;
                if (amount > 0) {
                    console.log("[CommandHandler] Found " + amount + " command(s)");
                    this.fetchDisabledCommands();
                    this.fetchRequiredRoles();
                    try {
                        for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                            var _b = __read(files_1_1.value, 2), file = _b[0], fileName = _b[1];
                            this.registerCommand(instance, client, file, fileName);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    client.on('message', function (message) {
                        var e_2, _a, e_3, _b;
                        var guild = message.guild;
                        var content = message.content;
                        var prefix = instance.getPrefix(guild);
                        if (content.startsWith(prefix)) {
                            content = content.substring(prefix.length); // Remove prefix
                            var args = content.split(/ /g);
                            var firstElement = args.shift();
                            if (firstElement) {
                                var name_1 = firstElement.toLowerCase();
                                var command = _this._commands.get(name_1);
                                if (command) {
                                    if (guild) {
                                        // const isDisabled = instance.commandHandler.isCommandDisabled(
                                        //     guild.id ,
                                        //     command.names[0]
                                        // )
                                        var isDisabled = command.isDisabled(guild.id);
                                        if (isDisabled) {
                                            message.reply("Command " + command.names[0] + " is disabled");
                                            return;
                                        }
                                    }
                                    var member = message.member;
                                    var minArgs = command.minArgs, maxArgs = command.maxArgs, expectedArgs = command.expectedArgs, _c = command.requiredPermissions, requiredPermissions = _c === void 0 ? [] : _c;
                                    var _d = command.syntaxError, syntaxError = _d === void 0 ? instance.syntaxError : _d;
                                    // for(const perm of requiredPermissions){
                                    //     // @ts-ignore
                                    //     if(!member?.hasPermission(perm)){
                                    //         message.reply(`You do not have permission to use this command`)
                                    //         return
                                    //     }
                                    // }
                                    if (guild && member) {
                                        try {
                                            for (var requiredPermissions_1 = __values(requiredPermissions), requiredPermissions_1_1 = requiredPermissions_1.next(); !requiredPermissions_1_1.done; requiredPermissions_1_1 = requiredPermissions_1.next()) {
                                                var perm = requiredPermissions_1_1.value;
                                                // @ts-ignore
                                                if (!member.hasPermission(perm)) {
                                                    message.reply("You do not have permission to use this command");
                                                    return;
                                                }
                                            }
                                        }
                                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                        finally {
                                            try {
                                                if (requiredPermissions_1_1 && !requiredPermissions_1_1.done && (_a = requiredPermissions_1.return)) _a.call(requiredPermissions_1);
                                            }
                                            finally { if (e_2) throw e_2.error; }
                                        }
                                        var roles = command.getRequiredRoles(guild.id);
                                        if (roles && roles.length) {
                                            var hasRole = false;
                                            try {
                                                for (var roles_1 = __values(roles), roles_1_1 = roles_1.next(); !roles_1_1.done; roles_1_1 = roles_1.next()) {
                                                    var role = roles_1_1.value;
                                                    if (member.roles.cache.has(role)) {
                                                        hasRole = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                            finally {
                                                try {
                                                    if (roles_1_1 && !roles_1_1.done && (_b = roles_1.return)) _b.call(roles_1);
                                                }
                                                finally { if (e_3) throw e_3.error; }
                                            }
                                            if (!hasRole) {
                                                message.reply("You do not have the required role to use this command");
                                            }
                                        }
                                    }
                                    if ((minArgs !== undefined && args.length < minArgs) ||
                                        (maxArgs !== undefined && maxArgs !== -1 && args.length > maxArgs)) {
                                        if (syntaxError) {
                                            syntaxError = syntaxError.replace(/{COMMAND}/g, prefix);
                                        }
                                        syntaxError = syntaxError.replace(/ {ARGUMENTS}/g, expectedArgs ? " " + expectedArgs : '');
                                        message.reply(syntaxError);
                                        return;
                                    }
                                    command.execute(message, args);
                                }
                            }
                        }
                    });
                }
            }
            else {
                throw new Error("[CommandHandler] Directory " + dir + " does not exist");
            }
        }
    }
    CommandHandler.prototype.registerCommand = function (instance, client, file, fileName) {
        var e_4, _a, e_5, _b;
        var configuration = require(file);
        var _c = configuration.name, name = _c === void 0 ? fileName : _c, commands = configuration.commands, aliases = configuration.aliases, callback = configuration.callback, execute = configuration.execute, run = configuration.run, desription = configuration.desription, requiredPermissions = configuration.requiredPermissions;
        var callbackCounter = 0;
        if (callback)
            ++callbackCounter;
        if (execute)
            ++callbackCounter;
        if (run)
            ++callbackCounter;
        if (callbackCounter > 1) {
            throw new Error("[CommandHandler] Both callback and execute cannot be defined in " + file);
        }
        var names = commands || aliases || [];
        if (!names && (!names || names.length === 0)) {
            throw new Error("[CommandHandler] Name and names are required in " + file);
        }
        if (typeof names === 'string') {
            names = [names];
        }
        if (name && !names.includes(name.toLowerCase())) {
            names.unshift(name.toLowerCase);
        }
        if (requiredPermissions) {
            try {
                for (var requiredPermissions_2 = __values(requiredPermissions), requiredPermissions_2_1 = requiredPermissions_2.next(); !requiredPermissions_2_1.done; requiredPermissions_2_1 = requiredPermissions_2.next()) {
                    var perm = requiredPermissions_2_1.value;
                    if (!permissions_1.default.includes(perm)) {
                        throw new Error("[CommandHandler] Invalid permission " + perm + " in " + file + ". Permissions must be one of the following - " + __spreadArray([], __read(permissions_1.default), false).join('" , "'));
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (requiredPermissions_2_1 && !requiredPermissions_2_1.done && (_a = requiredPermissions_2.return)) _a.call(requiredPermissions_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        if (!desription) {
            console.warn("[CommandHandler] No description defined in " + file);
        }
        var hasCallback = callback || execute || run;
        if (hasCallback) {
            var command = new Command_1.default(instance, client, names, callback || execute, configuration);
            try {
                for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                    var name_2 = names_1_1.value;
                    this._commands.set(name_2.toLowerCase(), command);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (names_1_1 && !names_1_1.done && (_b = names_1.return)) _b.call(names_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    };
    Object.defineProperty(CommandHandler.prototype, "commands", {
        get: function () {
            var results = [];
            var added = [];
            this._commands.forEach(function (_a) {
                // results.push({
                //     names: [...names] ,
                //     description
                // })
                var names = _a.names, _b = _a.description, description = _b === void 0 ? '' : _b;
                if (!added.includes(names[0])) {
                    results.push({
                        names: __spreadArray([], __read(names), false),
                        description: description,
                    });
                    added.push(names[0]);
                }
            });
            return results;
        },
        enumerable: false,
        configurable: true
    });
    CommandHandler.prototype.getCommand = function (name) {
        return this._commands.get(name);
    };
    CommandHandler.prototype.fetchDisabledCommands = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var results, results_1, results_1_1, result, guildId, command;
            var e_6, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, disabled_commands_1.default.find({})];
                    case 1:
                        results = _c.sent();
                        try {
                            for (results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                                result = results_1_1.value;
                                guildId = result.guildId, command = result.command;
                                // const array = this._disabled.get(guildId) || []
                                // array.push(command)
                                // this._disabled.set(guildId , array)
                                (_a = this._commands.get(command)) === null || _a === void 0 ? void 0 : _a.disable(guildId);
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (results_1_1 && !results_1_1.done && (_b = results_1.return)) _b.call(results_1);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommandHandler.prototype.fetchRequiredRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, results_2, results_2_1, result, guildId, command, requiredRoles_2, cmd, requiredRoles_1, requiredRoles_1_1, roleId;
            var e_7, _a, e_8, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, required_roles_1.default.find()];
                    case 1:
                        results = _c.sent();
                        try {
                            for (results_2 = __values(results), results_2_1 = results_2.next(); !results_2_1.done; results_2_1 = results_2.next()) {
                                result = results_2_1.value;
                                guildId = result.guildId, command = result.command, requiredRoles_2 = result.requiredRoles;
                                cmd = this._commands.get(command);
                                if (cmd) {
                                    try {
                                        for (requiredRoles_1 = (e_8 = void 0, __values(requiredRoles_2)), requiredRoles_1_1 = requiredRoles_1.next(); !requiredRoles_1_1.done; requiredRoles_1_1 = requiredRoles_1.next()) {
                                            roleId = requiredRoles_1_1.value;
                                            cmd.addRequiredRole(guildId, roleId);
                                        }
                                    }
                                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                                    finally {
                                        try {
                                            if (requiredRoles_1_1 && !requiredRoles_1_1.done && (_b = requiredRoles_1.return)) _b.call(requiredRoles_1);
                                        }
                                        finally { if (e_8) throw e_8.error; }
                                    }
                                }
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (results_2_1 && !results_2_1.done && (_a = results_2.return)) _a.call(results_2);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return CommandHandler;
}());
module.exports = CommandHandler;
