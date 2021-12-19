const axios = require('axios')

const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100, //corresponds to `flight_number`
    mission: 'Kepler Exploration X', //corresponds to `name`
    rocket: 'Endurance', //corresponds to `rocket.name`
    launchDate: new Date('December 25, 2040'), //corresponds to `date_local`
    target: 'Kepler-442 b', //this property is not applicable in the spacex api //if there is another planet that is not in the database, it is automatically handled.
    customers: ['SpaceX', 'NASA'], //comes from payload.customers for each payload
    upcoming: true, //coresponds to `upcoming`
    success: true, //corresponds to `success`
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
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

async function getAllLaunches(skip, limit) {
    return await launchesDatabase
        .find({}, {
            '_id': 0, '__v': 0
        })
        .skip(skip)
        .limit(limit)
}

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
    launch, //since launch is already an object, no need to enclose in {}
    {
        upsert: true,
    }
    )
}

saveLaunch(launch)

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
    console.log('Downloading SpaceX launch data from API');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        'name': 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed!')
    }

    const launchDocs = response.data.docs
    for (const launchDoc of launchDocs) {

        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success']
        }

        console.log(`${launch.flightNumber}: ${launch.mission}`);
        //populate launches collection...

        await saveLaunch(launch)
    }
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if (firstLaunch) {
        console.log('Launch data was already loaded!');
    }
    else {
        await populateLaunches()
    }
}

async function scheduleNewLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if (!planet) {
        throw new Error('No matching planets found!')
    }

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

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false, 
        success: false
    })
    return aborted.ok === 1 && aborted.nModified === 1
}

module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}