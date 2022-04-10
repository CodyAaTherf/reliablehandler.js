import { Client , Guild } from 'discord.js'
import CommandHandler from './CommandHandler'

class ReliableHandler {
    private _defaultPrefix = '>'
    private _commandsDir = 'commands'
    private _listenersDir = ''
    private _mongo = ''
    private _prefixes: { [name: string]: string } = {}

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
        new CommandHandler(this , client , this._commandsDir)
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
}

export = ReliableHandler