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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var path_1 = __importDefault(require("path"));
var CommandHandler_1 = __importDefault(require("./CommandHandler"));
var mongo_1 = __importDefault(require("./mongo"));
var prefixes_1 = __importDefault(require("./modles/prefixes"));
var get_all_files_1 = __importDefault(require("./get-all-files"));
var ReliableHandler = /** @class */ (function () {
    function ReliableHandler(client, commandsDir, listenerDir) {
        var e_1, _a;
        var _this = this;
        this._defaultPrefix = '>';
        this._commandsDir = 'commands';
        this._listenersDir = '';
        this._mongo = '';
        this._syntaxError = 'Syntax Error. Please check your command syntax';
        this._prefixes = {};
        if (!client) {
            throw new Error('[ReliableHandler] DJS Client is required');
        }
        if (!commandsDir) {
            console.warn('[ReliableHandler] No commands directory provided , using default');
        }
        if (module && module.parent) {
            var path_2 = module.parent.path;
            if (path_2) {
                commandsDir = path_2 + "/" + (commandsDir || this._commandsDir);
            }
        }
        this._commandsDir = commandsDir || this._commandsDir;
        this._commandHandler = new CommandHandler_1.default(this, client, this._commandsDir);
        setTimeout(function () {
            if (_this._mongo) {
                (0, mongo_1.default)(_this._mongo);
            }
            else {
                console.warn('[ReliableHandler] No mongo path provided');
            }
        }, 500);
        try {
            for (var _b = __values((0, get_all_files_1.default)(path_1.default.join(__dirname, 'commands'))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), file = _d[0], fileName = _d[1];
                this._commandHandler.registerCommand(this, client, file, fileName);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var loadPrefixes = function () { return __awaiter(_this, void 0, void 0, function () {
            var results, results_1, results_1_1, result, _id, prefix;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, prefixes_1.default.find({})];
                    case 1:
                        results = _b.sent();
                        try {
                            for (results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                                result = results_1_1.value;
                                _id = result._id, prefix = result.prefix;
                                this._prefixes[_id] = prefix;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        console.log('[ReliableHandler] Prefixes loaded -', this._prefixes);
                        return [2 /*return*/];
                }
            });
        }); };
        loadPrefixes();
    }
    Object.defineProperty(ReliableHandler.prototype, "mongoPath", {
        get: function () {
            return this._mongo;
        },
        enumerable: false,
        configurable: true
    });
    ReliableHandler.prototype.setMongoPath = function (mongoPath) {
        this._mongo = mongoPath;
        return this;
    };
    Object.defineProperty(ReliableHandler.prototype, "syntaxError", {
        get: function () {
            return this._syntaxError;
        },
        enumerable: false,
        configurable: true
    });
    ReliableHandler.prototype.setSynatxError = function (syntaxError) {
        this._syntaxError = syntaxError;
        return this;
    };
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
    ReliableHandler.prototype.setPrefix = function (guild, prefix) {
        if (guild) {
            this._prefixes[guild.id] = prefix;
        }
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
