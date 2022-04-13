import { Client , Guild } from 'discord.js'
import fs from 'fs'

import ReliableHandler from '.'
import Command from './Command'
import getAllFiles from './get-all-files'
import ICommand from './interfaces/ICommand'
import disabledCommands from './modles/disabled-commands'
import permissions from './permissions'

class CommandHandler {
    private _commands: Map<String , Command> = new Map()
    private _disabled: Map<String , String[]> = new Map()

    constructor(instance: ReliableHandler , client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                const files = getAllFiles(dir)

                console.log(`[Command Handler]` , files);
                
                const amount = files.length

                if (amount > 0){
                    console.log(`[CommandHandler] Found ${amount} command(s)`)

                    this.fetchDisabledCommands()

                    for(const [file , fileName] of files){
                        this.registerCommand(instance , client , file , fileName)
                    }

                    client.on('message' , (message) => {
                        const guild: Guild | null = message.guild
                        let content: string = message.content
                        const prefix = instance.getPrefix(guild)

                        if (content.startsWith(prefix)){
                            content = content.substring(prefix.length) // Remove prefix
                            const args = content.split(/ /g)
                            const firstElement = args.shift()

                            if(firstElement){
                                const name = firstElement.toLowerCase()

                                const command = this._commands.get(name)
                                if(command){
                                    if(guild){
                                        const isDisabled = instance.commandHandler.isCommandDisabled(
                                            guild.id ,
                                            command.names[0]
                                        )

                                        if(isDisabled){
                                            message.reply(`Command ${command.names[0]} is disabled`)
                                            return
                                        }
                                    }

                                    const { member } = message
                                    const { minArgs , maxArgs , expectedArgs , requiredPermissions = []} = command

                                    let { syntaxError = instance.syntaxError } = command

                                    for(const perm of requiredPermissions){
                                        // @ts-ignore
                                        if(!member?.hasPermission(perm)){
                                            message.reply(`You do not have permission to use this command`)
                                            return
                                        }
                                    }

                                    if(
                                        (minArgs !== undefined && args.length < minArgs) ||
                                        (maxArgs !== undefined && maxArgs !== -1 && args.length > maxArgs)
                                    ){
                                        if(syntaxError){
                                            syntaxError = syntaxError.replace(/{COMMAND}/g , prefix)
                                        }

                                        syntaxError = syntaxError.replace(/ {ARGUMENTS}/g , expectedArgs ? ` ${expectedArgs}` : '')

                                        message.reply(syntaxError)
                                        return
                                    }

                                    command.execute(message , args)
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

    public registerCommand(
        instance: ReliableHandler ,
        client: Client ,
        file: string ,
        fileName: string
    ){
        const configuration = require(file)
        const{
            name = fileName ,
            commands ,
            aliases ,
            callback ,
            execute ,
            run ,
            desription ,
            requiredPermissions
        } = configuration

        let callbackCounter = 0
        if(callback) ++callbackCounter
        if(execute) ++callbackCounter
        if(run) ++callbackCounter

        if(callbackCounter > 1){
            throw new Error(`[CommandHandler] Both callback and execute cannot be defined in ${file}`)
        }

        let names = commands || aliases || []

        if(!names && (!names || names.length === 0)){
            throw new Error(`[CommandHandler] Name and names are required in ${file}`)
        }

        if(typeof names === 'string'){
            names = [names]
        }

        if(name && !names.includes(name.toLowerCase())){
            names.unshift(name.toLowerCase)
        }

        if(requiredPermissions){
            for(const perm of requiredPermissions){
                if(!permissions.includes(perm)){
                    throw new Error(`[CommandHandler] Invalid permission ${perm} in ${file}. Permissions must be one of the following - ${[...permissions].join('" , "')}`)
                }
            }
        }

        if(!desription){
            console.warn(`[CommandHandler] No description defined in ${file}`)
        }

        const hasCallback = callback || execute || run

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

    public get commands(): ICommand[] {
        const results: { names: string[]; description: string }[] = []

        this._commands.forEach(({ names , description = '' }) => {
            results.push({
                names: [...names] ,
                description
            })
        })

        return results
    }

    public async fetchDisabledCommands(){
        const results: any[] = await disabledCommands.find({})

        for(const result of results){
            const { guildId , command } = result

            const array = this._disabled.get(guildId) || []
            array.push(command)
            this._disabled.set(guildId , array)
        }

        console.log(`[CommandHandler] Fetched ${results.length} disabled commands`)
    }

    public disableCommand(guildId: string , command: string){
        const array = this._disabled.get(guildId) || []

        if(array && !array.includes(command)){
            array.push(command)
            this._disabled.set(guildId , array)
        }
    }

    public isCommandDisabled(guildId: string , command: string): boolean{
        const array = this._disabled.get(guildId)

        return(array && array.includes(command)) || false
    }

    public enableCommand(guildId: string , command: string){
        const array = this._disabled.get(guildId) || []
        const index = array ? array.indexOf(command) : -1

        if(array && index >= 0){
            array.splice(index , 1)
        }
    }
}

export = CommandHandler