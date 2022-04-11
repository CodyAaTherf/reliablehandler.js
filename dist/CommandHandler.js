"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var Command_1 = __importDefault(require("./Command"));
var get_all_files_1 = __importDefault(require("./get-all-files"));
var CommandHandler = /** @class */ (function () {
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
                    try {
                        // for(const file of files){
                        //     let fileName: string | string[] = file
                        //         .replace(/\\/g , '/')
                        //         .split('/')
                        //     fileName = fileName[fileName.length - 1]
                        //     fileName = fileName.split('.')[0].toLowerCase()
                        //     const configuration = require(file)
                        //     const {
                        //         name ,
                        //         commands ,
                        //         aliases ,
                        //         callback ,
                        //         execute ,
                        //         desription ,
                        //         minArgs ,
                        //         maxArgs ,
                        //     } = configuration
                        //     if(callback && execute){
                        //         throw new Error(`[CommandHandler] Both callback and execute cannot be defined in ${file}`)
                        //     }
                        //     let names = commands || aliases
                        //     if(!name && (!names || names.length === 0)){
                        //         throw new Error(`[CommandHandler] Name and names are required in ${file}`)
                        //     }
                        //     if(typeof names === 'string'){
                        //         names = [names]
                        //     }
                        //     if(name && !names.includes(name.toLowerCase())){
                        //         names.unshift(name.toLowerCase)
                        //     }
                        //     if(!names.includes(fileName)){
                        //         names.unshift(fileName)
                        //     }
                        //     if(!desription){
                        //         console.warn(`[CommandHandler] No description defined in ${file}`)
                        //     }
                        //     const hasCallback = callback || execute
                        //     if(hasCallback){
                        //         const command = new Command(
                        //             instance ,
                        //             client ,
                        //             names ,
                        //             callback || execute ,
                        //             configuration
                        //         )
                        //         for(const name of names){
                        //             this._commands.set(name.toLowerCase() , command)
                        //         }
                        //     }
                        // }
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
                                    // const { minArgs , maxArgs } = command
                                    // if(minArgs !== undefined && args.length < minArgs){
                                    //     message.reply(`You need to provide at least ${minArgs} argument(s)`)
                                    //     return
                                    // }
                                    var minArgs = command.minArgs, maxArgs = command.maxArgs, expectedArgs = command.expectedArgs;
                                    var _a = command.syntaxError, syntaxError = _a === void 0 ? instance.syntaxError : _a;
                                    // if(maxArgs !== undefined && maxArgs !== -1 && args.length > maxArgs){
                                    //     message.reply(`You can provide at most ${maxArgs} argument(s)`)
                                    //     return
                                    // }
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
        var e_2, _a;
        var configuration = require(file);
        var _b = configuration.name, name = _b === void 0 ? fileName : _b, commands = configuration.commands, aliases = configuration.aliases, callback = configuration.callback, execute = configuration.execute, desription = configuration.desription;
        if (callback && execute) {
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
        if (!desription) {
            console.warn("[CommandHandler] No description defined in " + file);
        }
        var hasCallback = callback || execute;
        if (hasCallback) {
            var command = new Command_1.default(instance, client, names, callback || execute, configuration);
            try {
                for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                    var name_2 = names_1_1.value;
                    this._commands.set(name_2.toLowerCase(), command);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    Object.defineProperty(CommandHandler.prototype, "commands", {
        get: function () {
            var results = new Map();
            this._commands.forEach(function (_a) {
                var names = _a.names, _b = _a.description, description = _b === void 0 ? '' : _b;
                results.set(names[0], {
                    names: names,
                    description: description
                });
            });
            return Array.from(results.values());
        },
        enumerable: false,
        configurable: true
    });
    return CommandHandler;
}());
module.exports = CommandHandler;
