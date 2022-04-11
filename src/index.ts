import { Client , Guild } from 'discord.js'
import { Document } from 'mongoose'
import path from 'path'

import CommandHandler from './CommandHandler'
import ICommand from './interfaces/ICommand'
import mongo from './mongo'
import prefixes from './modles/prefixes'
import getAllFiles from './get-all-files'

class ReliableHandler {
    private _defaultPrefix = '>'
    private _commandsDir = 'commands'
    private _listenersDir = ''
    private _mongo = ''
    private _syntaxError = 'Syntax Error. Please check your command syntax'
    private _prefixes: { [name: string]: string } = {}
    private _commandHandler: CommandHandler

    constructor(client: Client , commandsDir?: string , listenerDir?: string){
        if(!client){
            throw new Error('[ReliableHandler] DJS Client is required')
        }

        if(!commandsDir){
            console.warn('[ReliableHandler] No commands directory provided , using default')
        }

        if(module && module.parent){
            const { path } = module.parent
            if(path){
                commandsDir = `${path}/${commandsDir || this._commandsDir}`
            }
        }

        this._commandsDir = commandsDir || this._commandsDir
        this._commandHandler = new CommandHandler(this , client , this._commandsDir)

        setTimeout(() => {
            if(this._mongo){
                mongo(this._mongo)
            } else {
                console.warn('[ReliableHandler] No mongo path provided')
            }
        } , 500)

        for (const [file , fileName] of getAllFiles(path.join(__dirname , 'commands'))){
            this._commandHandler.registerCommand(this , client , file , fileName)
        }

        const loadPrefixes = async() => {
            const results: any[] = await prefixes.find({})

            for(const result of results){
                const { _id , prefix } = result

                this._prefixes[_id] = prefix
            }

            console.log('[ReliableHandler] Prefixes loaded -', this._prefixes)
        }
        loadPrefixes()
    }

    public get mongoPath(): string{
        return this._mongo
    }

    public setMongoPath(mongoPath: string): ReliableHandler {
        this._mongo = mongoPath
        return this
    }

    public get syntaxError(): string{
        return this._syntaxError
    }

    public setSynatxError(syntaxError: string): ReliableHandler {
        this._syntaxError = syntaxError
        return this
    }

    public get prefixes(){
        return this._prefixes
    }

    public get defaultPrefix(): string {
        return this._defaultPrefix
    }

    public setDefaultPrefix(prefix: string): ReliableHandler {
        this._defaultPrefix = this.defaultPrefix
        return this
    }

    public getPrefix(guild: Guild | null): string {
        return this._prefixes[guild ? guild.id : ''] || this._defaultPrefix
    }

    public setPrefix(guild: Guild | null , prefix: string){
        if(guild){
            this._prefixes[guild.id] = prefix
        }
    }

    public get commands(): ICommand[]{
        return this._commandHandler.commands
    }

    public get commandAmount(): number{
        return this.commands.length
    }
}

export = ReliableHandler