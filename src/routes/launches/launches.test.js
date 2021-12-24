const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')
const { loadPlanetsData } = require('../../models/planets.model')

const API_VERSION = 'v1/'

describe('Launches API', () => {

    beforeAll( async () => {
        await mongoConnect()
        await loadPlanetsData()
    })

    afterAll( async () => {
        await mongoDisconnect()
    })

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get(`/${API_VERSION}launches`)
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })
    
    describe('Test POST /launch', () => {
    
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'Starship 11',
            target: 'Kepler-62 f',
            launchDate: 'May 16, 2026',
        }
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'Starship 11',
            target: 'Kepler-62 f',
        }
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'Starship 11',
            target: 'Kepler-62 f',
            launchDate: 'what?',
        }
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post(`/${API_VERSION}launches`)
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201)
            
            const requestDate = new Date(completeLaunchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
    
            expect(responseDate).toBe(responseDate) 
            expect(response.body).toMatchObject(launchDataWithoutDate)
        })
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post(`/${API_VERSION}launches`)
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        })
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post(`/${API_VERSION}launches`)
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            })
        })
    })
})