import { Client , Message } from 'discord.js'
import ReliableHandler from '..'
import disabledCommands from '../modles/disabled-commands'

export = {
    minArgs: 2 ,
    maxArgs: 2 ,
    expectedArgs: '<"enable"|"disable"> <command>' ,
    description: 'Enables or disables a command for this server' ,
    callback: async(
        message: Message ,
        args: string[] ,
        text: string ,
        client: Client ,
        prefix: string ,
        instance: ReliableHandler
    ) => {
        const newState = args.shift()?.toLowerCase()
        const name = args.shift()?.toLowerCase()

        if(newState !== 'enable' && newState !== 'disable'){
            message.reply('Please provide a valid state')
            return
        }

        const { guild } = message

        if(!guild){
            message.reply('This command can only be used in a guild')
            return
        }

        for(const { names } of instance.commands){
            // @ts-ignore
            if(names.includes(name)){
                const mainCommand = names[0]
                const isDisabled = instance.commandHandler.isCommandDisabled(guild.id , mainCommand)

                if(newState === 'enable'){
                    if(!isDisabled){
                        message.reply('This command is already enabled')
                        return
                    }

                    await disabledCommands.deleteOne({
                        guildId: guild.id ,
                        command: mainCommand ,
                    })

                    instance.commandHandler.enableCommand(guild.id , mainCommand)

                    message.reply('Command enabled')
                } else {
                    if(isDisabled){
                        message.reply('This command is already disabled')
                        return
                    }

                    await new disabledCommands({
                        guildId: guild.id ,
                        command: mainCommand ,
                    }).save()

                    instance.commandHandler.disableCommand(guild.id , mainCommand)

                    message.reply('Command disabled')
                }

                return
            }
        }

        message.reply('Command not found')
    }
}