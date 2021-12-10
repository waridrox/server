const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Endurance',
    launchDate: new Date('December 25, 2040'),
    target: 'Kepler-442 b',
    customer: ['SpaceX', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch)

function existsLaunchWithId(launchId) {
    return launches.has(launchId)
}

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) { //launch as param that needs to be added to our collection
    latestFlightNumber++

    launches.set(
        latestFlightNumber, 
        Object.assign(launch, {
            success: true,
            upcoming: true,
            customer: ['SpaceX', 'NAShA'],
            flightNumber: latestFlightNumber,
        })
    )
}

function abortLaunchById(launchId) {
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}