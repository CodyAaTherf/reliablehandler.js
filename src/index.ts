// 5TH COMMANDSSSSSSEERDDD

import { Client , Guild } from 'discord.js'
import CommandHandler from './CommandHandler'
import ICommand from './interfaces/ICommand'

class ReliableHandler {
    private _defaultPrefix = '>'
    private _commandsDir = 'commands'
    private _listenersDir = ''
    private _mongo = ''
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

    public get commands(): ICommand[]{
        return this._commandHandler.commands
    }

    public get commandAmount(): number{
        return this.commands.length
    }
}

export = ReliableHandler