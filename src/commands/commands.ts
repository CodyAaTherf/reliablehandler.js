import { Client , Message } from 'discord.js'
import ReliableHandler from '..'

export = {
    maxArgs: 0 ,
    description: 'Displays all commands' ,
    callback: (
        message: Message ,
        args: string[] ,
        text: string ,
        prefix: string ,
        client: Client ,
        instance: ReliableHandler
    ) => {
        let msg = `Commands: \n`

        for(const command of instance.commandHandler.commands){
            const { names , description } = command
            const mainCommand = names.shift() || ''

            // msg += `
            // **${mainCommand}**
            // Aliases: ${names.length ? `"${names.join('" , "')}"` : 'None'}
            // Description: ${description || 'None'}
            // Enabled: ${
            //     message.guild
            //         ? instance.commandHandler
            //         .getCommand(mainCommand)
            //         ?.isDisabled(message.guild.id)
            //             ? 'No'
            //             ? 'Yes'
            //         : ''
            //     }
            // `                
        }
        message.reply(msg)
    }
}