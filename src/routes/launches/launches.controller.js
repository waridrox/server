const { getAllLaunches, addNewLaunch } = require('../../models/launches.model')

//Get request
function httpGetAllLaunches (req, res) {
    return res.status(200).json(getAllLaunches())
}

//Post request
function httpAddNewLaunch (req, res) {
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

    addNewLaunch(launch)
    //sending the launch object

    return res.status (201).json(launch)
    //returning the JSON object of the launch that we just added. 
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
}