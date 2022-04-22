import mongoose from 'mongoose'

const reqString = {
    type: String ,
    required: true ,
}

const disabledCommands = new mongoose.Schema({
    guildId: reqString ,
    command: reqString ,
})

export = mongoose.model('reliablehandler-disabled-commands' , disabledCommands)