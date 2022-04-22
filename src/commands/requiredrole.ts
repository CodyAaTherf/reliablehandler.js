import { Client , Message } from 'discord.js'
import ReliableHandler from '..'
import requiredRoleSchema from '../models/required-roles'

export = {
    minArgs: 2 ,
    maxArgs: 2 ,
    expectedArgs: '<"none" | Role Name | roleId>' ,
    requiredPermissions: ['ADMINISTATOR'] ,
    description: 'Add a required role to a command' ,
    callback: async (
        message: Message ,
        args: string[] ,
        text: string ,
        prefix: string ,
        client: Client ,
        instance: ReliableHandler
    ) => {
        const name = (args.shift() || '').toLowerCase()
        let roleId = message.mentions.users.first() || (args.shift() || '').toLowerCase()

        if(typeof roleId !== 'string'){
            roleId = roleId.id
        }

        const { guild } = message

        if(!guild){
            message.reply('This command can only be used in a guild')
            return
        }

        const command = instance.commandHandler.getCommand(name)

        if(command){
            if(roleId === 'none'){
                command.removeRequiredRole(guild.id , roleId)

                await requiredRoleSchema.deleteOne({
                    guildId: guild.id ,
                    command: command.names[0]
                })

                message.reply(`Removed required role from ${name}`)
            } else {
                command.addRequiredRole(guild.id , roleId)

                await requiredRoleSchema.findOneAndUpdate(
                    {
                        guildId: guild.id ,
                        command: command.names[0]
                    } ,
                    {
                        guildId: guild.id ,
                        command: command.names[0] ,
                        $addToSet: {
                            requiredRoles: roleId
                        }
                    } ,
                    {
                        upsert: true
                    }
                )

                message.reply(`Added required role to ${name}`)
            }
        } else{
            message.reply(`Command ${name} does not exist`)
        }
    }
}