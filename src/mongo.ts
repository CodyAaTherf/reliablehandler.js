import mongoose , { ConnectOptions } from 'mongoose'

const mongo = async(mongoPath: string) => {
    await mongoose.connect(mongoPath , {
        keepAlive: true ,
        useNewUrlParser: true ,
        useUnifiedTopology: true ,
        useFindAndModify: false ,
    } as ConnectOptions)
}

export default mongo