const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://nasa-api:mongodb india123@nasacluster.wrlxd.mongodb.net/nasa?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true, 
        useFindAndModify: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
}

async function mongoDisconnect() {
    await mongoose.disconnect() 
    //mongoose already knows to which db the connection is currently made and disconnects
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}