const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model')
const { getPagination } = require('../../services/query')

//Get request
async function httpGetAllLaunches (req, res) {
    console.log(req.query)

    const { skip, limit } = getPagination(req.query)
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches)
}

//Post request
async function httpAddNewLaunch (req, res) {
    const launch = req.body //since express will return the JSON body.

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        })
    }

    launch.launchDate = new Date (launch.launchDate);
    //modifying the date object to make it equal to the launch date that is being passed.
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        })
    }

    await scheduleNewLaunch(launch)
    //sending the launch object

    return res.status (201).json(launch)
    //returning the JSON object of the launch that we just added. 
}

async function httpAbortLaunch (req, res) {
    const launchId = Number(req.params.id)

    const existsLaunch = await existsLaunchWithId(launchId)
    if (!existsLaunch) {
        //if launch doesn't exist
        return res.status(400).json({
            error: 'Launch not found',
        })
    }

    //if the launch does exist
    const aborted = await abortLaunchById(launchId)

    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted!'
        })
    }
    return res.status(200).json({
        ok: true,
    })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}