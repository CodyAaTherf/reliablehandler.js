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
module.exports = {
    maxArgs: 0,
    description: 'Displays all commands',
    callback: function (message, args, text, prefix, client, instance) {
        var e_1, _a;
        var msg = "Commands: \n";
        try {
            for (var _b = __values(instance.commands), _c = _b.next(); !_c.done; _c = _b.next()) {
                var command = _c.value;
                var names = command.names, description = command.description;
                var mainCommand = names.shift() || '';
                msg += "\n                **" + mainCommand + "**\n                Aliases: " + (names.length ? "\"" + names.join('" , "') + "\"" : 'None') + "\n                Description: " + (description || 'None') + "\n                Enabled: " + (message.guild
                    ? instance.commandHandler.isCommandDisabled(message.guild.id, mainCommand)
                        ? 'No'
                        : 'Yes'
                    : '') + "\n            ";
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        message.reply(msg);
    }
};
