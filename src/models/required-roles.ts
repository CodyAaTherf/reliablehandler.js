import mongoose from 'mongoose'

const reqString = {
    type: String ,
    required: true 
}

const requiredRoleSchema = new mongoose.Schema({
    guildId: reqString ,
    command: reqString ,
    requiredRoles: {
        type: [String] ,
        required: true
    }
})

export = mongoose.model('reliablehandler-required-roles' , requiredRoleSchema)