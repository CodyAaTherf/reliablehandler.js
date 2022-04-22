import { Client , Message } from 'discord.js'
import ReliableHandler from '..'
import prefixes from '../models/prefixes'

export = {
    name: 'prefix' ,
    minArgs: 0 ,
    maxArgs: 1 ,
    expectedArgss: '<prefix>' ,
    requiredPermissions: ['ADMINISTRATOR'] ,
    description: 'Changes the prefix for this server' ,
    callback: async(
        message: Message ,
        args: string[] ,
        text: string ,
        client: Client ,
        prefix: string ,
        instance: ReliableHandler
    ) => {
        if(args.length === 0){
            message.reply(`My prefix is \`${prefix}\``)
        } else {
            const { guild } = message

            if(guild){
                const { id } = guild

                await prefixes.findOneAndUpdate(
                    {
                        _id: id ,
                    } ,
                    {
                        _id: id ,
                        prefix: text ,
                    } ,
                    {
                        upsert: true ,
                    }
                )

                instance.setPrefix(guild , text)

                message.reply(`My new prefix is \`${text}\``)
            } else {
                message.reply('You cannot change my prefix in DMs')
            }
        }
    }
}