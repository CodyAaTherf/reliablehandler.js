import { Client , Message } from 'discord.js'
import ReliableHandler from '..'

export = {
    maxArgs: 0 ,
    callback: (
        message: Message ,
        args: string[] ,
        text: string ,
        prefix: string ,
        client: Client ,
        instance: ReliableHandler
    ) => {
        let msg = `Commands: \n`

        for(const command of instance.commands){
            const { names , description } = command

            msg += `
            **${names.shift()}**
            Aliases: ${names.length ? `"${names.join('" , "')}"` : 'None'}
            Description: ${description || 'None'}
            `
        }

        message.reply(msg)
    }
}