const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

// const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Endurance',
    launchDate: new Date('December 25, 2040'),
    target: 'Kepler-442 b', //if there is another planet that is not in the database, it is automatically handled.
    customers: ['SpaceX', 'NASA'],
    upcoming: true,
    success: true,
}

// launches.set(launch.flightNumber, launch)

// function existsLaunchWithId(launchId) {
//     return launches.has(launchId)
// }

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber')
    
    if (!latestLaunch) { //if latesLaunch is NULL
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
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

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true, 
        upcoming: true, 
        customers: ['SpaceX', 'NAShA'],
        flightNumber: newFlightNumber,
    })

    //saving the new launch data by passing in the value of the new object
    await saveLaunch(newLaunch)
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
    return aborted
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}