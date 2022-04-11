import { Client , GuildMember , Message } from 'discord.js'
import ReliableHandler from "."

interface configuration{
    names: string[] | string
    minArgs?: number
    maxArgs?: number
    expectedArgs: string
    description?: string
    callback: Function
}

class Command {
    private instance: ReliableHandler
    private client: Client
    private _names: string[] = []
    private _minArgs: number = 0
    private _maxArgs: number = -1
    private _expectedArgs?: string
    private _description?: string
    private _cooldown: string[] = []
    private _callback: Function = () => {}

    constructor(
        instance: ReliableHandler ,
        client: Client ,
        names: string ,
        callback: Function ,
        { minArgs , maxArgs , expectedArgs , description }: configuration
    ){
        this.instance = instance
        this.client = client
        this._names = typeof names === 'string' ? [names] : names
        this._minArgs = minArgs || 0
        this._maxArgs = maxArgs === undefined ? -1 : maxArgs
        this._expectedArgs = expectedArgs
        this._description = description
        this._callback = callback

        if(this._minArgs < 0){
            throw new Error(`[Command] minArgs cannot be less than 0`)
        }

        if(this._maxArgs < -1){
            throw new Error(`[Command] maxArgs cannot be less than -1`)
        }

        if(this._maxArgs !== -1 && this._maxArgs < this._minArgs){
            throw new Error(`[Command] maxArgs cannot be less than minArgs`)
        }
    }

    public execute(message: Message , args: string[]){
        this._callback(
            message ,
            args ,
            args.join(' ') ,
            this.client ,
            message.guild
                ? this.instance.prefixes[message.guild.id]
                : this.instance.defaultPrefix
        )
    }

    public get names(): string[] {
        return this._names
    }

    public get minArgs(): number {
        return this._minArgs
    }

    public get maxArgs(): number {
        return this._maxArgs
    }

    public get expectedArgs(): string | undefined {
        return this._expectedArgs
    }

    public get description(): string | undefined {
        return this._description
    }

    public setCooldown(member: GuildMember | string , seconds: number){
        if(typeof member !== 'string'){
            member = member.id
        }

        console.log(`[Command] Setting cooldown for ${member} for ${seconds} seconds`);
    }

    public clearCooldown(member: GuildMember | string , seconds: number){
        if(typeof member !== 'string'){
            member = member.id
        }

        console.log(`[Command] Clearing cooldown for ${member} for ${seconds} seconds`);         
    }

    public get callback(): Function {
        return this._callback
    }
}

export = Command