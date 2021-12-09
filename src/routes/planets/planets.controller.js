const { planets } = require('../../models/planets.model')

function getAllPlanets (req, res) {
    return res.status(200).json(planets) //for the error that the headers have already been set.
}

module.exports = {
    getAllPlanets,
}