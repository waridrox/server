const fs = require('fs');
const path = require('path')
const parse = require('csv-parse');

const planets = require('./planets.mongo')

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return (planet['koi_disposition'] === 'CONFIRMED' 
    && planet['koi_insol'] > 0.36 
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6)
}


function loadPlanetsData() {
    return new Promise ((resolve, reject) => {
        //wait for the streaming code to resolve
        fs.createReadStream(path.join( __dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                //TODO: Replace below create with INSERT + UPDATE = UPSERT
                // habitablePlanets.push(data)
                savePlanet(data)
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err)
        })
        .on('end', async () => {
            // console.log(habitablePlanets.map((planet) => {
            //     return planet['kepler_name']
            // })); 
            
            //we don't need this since we are just setting the planets info data
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`${countPlanetsFound} habitable planets found!`);
        })
        resolve(); //signals that the promise has been resolved. 
    })
}

async function getAllPlanets() {
    // return habitablePlanets;
    return await planets.find({})
}

async function savePlanet(planet) {

    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        })
    }
    catch (err) {
        console.error(`Could not save planet: ${err}`)
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}