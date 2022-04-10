import { Client , Guild } from 'discord.js'
import fs from 'fs'
import ReliableHandler from '.'
import Command from './Command'
import getAllFiles from './get-all-files'
import ICommand from './interfaces/ICommand'

class CommandHandler {
    private _commands: Map<String , Command> = new Map()

    constructor(instance: ReliableHandler , client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                const files = getAllFiles(dir)

                console.log(`[Command Handler]` , files);
                

                const amount = files.length

                if (amount > 0){
                    console.log(`[CommandHandler] Found ${amount} command(s)`)

                    for(const file of files){
                        let fileName: string | string[] = file
                            .replace(/\\/g , '/')
                            .split('/')
                        
                        fileName = fileName[fileName.length - 1]
                        fileName = fileName.split('.')[0].toLowerCase()

                        const configuration = require(file)
                        const {
                            name ,
                            commands ,
                            aliases ,
                            callback ,
                            execute ,
                            desription
                        } = configuration

                        if(callback && execute){
                            throw new Error(`[CommandHandler] Both callback and execute cannot be defined in ${file}`)
                        }

                        let names = commands || aliases

                        if(!name && (!names || names.length === 0)){
                            throw new Error(`[CommandHandler] Name and names are required in ${file}`)
                        }

                        if(typeof names === 'string'){
                            names = [names]
                        }

                        if(name && !names.includes(name.toLowerCase())){
                            names.unshift(name.toLowerCase)
                        }

                        if(!names.includes(fileName)){
                            names.unshift(fileName)
                        }

                        if(!desription){
                            console.warn(`[CommandHandler] No description defined in ${file}`)
                        }

                        const hasCallback = callback || execute

                        if(hasCallback){
                            const command = new Command(
                                instance ,
                                client ,
                                names ,
                                callback || execute ,
                                configuration
                            )

                            for(const name of names){
                                this._commands.set(name.toLowerCase() , command)
                            }
                        }

                    }

                    client.on('message' , (message) => {
                        const guild: Guild | null = message.guild
                        let content: string = message.content
                        const prefix = instance.getPrefix(guild)

                        if (content.startsWith(prefix)){
                            content = content.substring(prefix.length) // Remove prefix
                            const words = content.split(/ /g)
                            const firstElement = words.shift()

                            if(firstElement){
                                const alias = firstElement.toLowerCase()

                                const command = this._commands.get(alias)
                                if(command){
                                    command.execute(message , words)
                                }
                            }
                        }
                    })
                }
            } else {
                throw new Error(`[CommandHandler] Directory ${dir} does not exist`)
            }
        }
    }

    public get commands(): ICommand[] {
        const results = new Map()

        this._commands.forEach(({ names , description = '' }) => {
            results.set(names[0] , {
                names ,
                description
            })
        })

        return Array.from(results.values())
    }
}

export = CommandHandler