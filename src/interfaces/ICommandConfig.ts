export default interface ICommandConfig {
    names: string[] | string
    minArgs?: number
    maxArgs?: number
    expectedArgs?: string
    syntaxError?: string
    description?: string
    requiredPermissions?: string[]
    callback: Function
}