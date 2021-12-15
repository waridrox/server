const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Endurance',
    launchDate: new Date('December 25, 2040'),
    target: 'Aneesha Sharma',
    customers: ['SpaceX', 'NASA'],
    upcoming: true,
    success: true,
}

// launches.set(launch.flightNumber, launch)

function existsLaunchWithId(launchId) {
    return launches.has(launchId)
}

async function getAllLaunches() {
    // return Array.from(launches.values())
    return await launchesDatabase
        .find({}, {
            '_id': 0, '__v': 0
        })
}

async function saveLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if (!planet) {
        throw new Error('No matching planets found!')
    }
    await launchesDatabase.updateOne({
        flightNumber: launch.flightNumber
    },
    launch, //since launch is already an object, no need to enclose in {}
    {
        upsert: true,
    }
    )
}

saveLaunch(launch)

function addNewLaunch(launch) { //launch as param that needs to be added to our collection
    latestFlightNumber++

    launches.set(
        latestFlightNumber, 
        Object.assign(launch, {
            success: true,
            upcoming: true,
            customers: ['SpaceX', 'NAShA'],
            flightNumber: latestFlightNumber,
        })
    )
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
    return aborted
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}