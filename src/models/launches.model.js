const launches = new Map()

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Endurance',
    launchDate: new Date('December 25, 2040'),
    destination: 'Kepler-442 b',
    customer: ['SpacX, NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch)

module.exports = {
    launches,
}