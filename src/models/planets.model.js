const fs = require('fs');
const path = require('path')
const parse = require('csv-parse');

const habitablePlanets = [];

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
        .on('data', (data) => {
            if (isHabitablePlanet(data)) {
                habitablePlanets.push(data)
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err)
        })
        .on('end', () => {
            // console.log(habitablePlanets.map((planet) => {
            //     return planet['kepler_name']
            // })); 
            
            //we don't need this since we are just setting the planets info data
            console.log(`${habitablePlanets.length} habitable planets found!`);
        })
        resolve(); //signals that the promise has been resolved. 
    })
}

module.exports = {
    loadPlanetsData,
    planets: habitablePlanets,
}