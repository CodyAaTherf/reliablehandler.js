import mongoose from 'mongoose'

const reqString = {
    type: String ,
    required: true ,
}

const prefixSchema = new mongoose.Schema({
    _id: reqString ,
    prefix: reqString ,
})

export = mongoose.model('reliablehandler-prefixes' , prefixSchema)