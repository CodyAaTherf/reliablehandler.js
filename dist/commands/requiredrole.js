"use strict";
module.exports = {
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: '<"none" | Role Name | roleId>',
    requiredPermissions: ['ADMINISTATOR'],
    description: 'Add a required role to a command',
    callback: function (message, args, text, prefix, client, instance) {
        var name = (args.shift() || '').toLowerCase();
        var roleId = message.mentions.users.first() || (args.shift() || '').toLowerCase();
        if (typeof roleId !== 'string') {
            roleId = roleId.id;
        }
        var guild = message.guild;
        if (!guild) {
            message.reply('This command can only be used in a guild');
            return;
        }
        var command = instance.commandHandler.getCommand(name);
        if (command) {
            if (roleId === 'none') {
                command.removeRequiredRole(guild.id, roleId);
                message.reply("Removed required role from " + name);
            }
            else {
                command.addRequiredRole(guild.id, roleId);
                message.reply("Added required role to " + name);
            }
        }
        else {
            message.reply("Command " + name + " does not exist");
        }
    }
};
