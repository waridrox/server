const http = require('http')
const { mongoConnect } = require('./services/mongo')
const app = require('./app')

const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchData } = require('./models/launches.model')

const PORT = process.env.PORT || 5000;

const server = http.createServer(app)

async function startServer() {
    await mongoConnect()

    await loadPlanetsData()
    server.listen(PORT, () => {
        console.log(`Server listening on ${PORT}...`);
    })

    await loadLaunchData()
}

startServer()