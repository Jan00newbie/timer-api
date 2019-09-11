const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const Timer = require('./models/timer')

const app = express()

timers = [{
        "id": 1,
        "title": "Recruiting Manager",
        "category": "n/a",
        "time": "0",
        runningSince: false
    },
    {
        "id": 2,
        "title": "Statistician I",
        "category": "n/a",
        "time": "0",
        runningSince: null
    },
    {
        "id": 3,
        "title": "Administrative Officer",
        "category": "Capital Goods",
        "time": "0",
        runningSince: null
    },
    {
        "id": 4,
        "title": "Analog Circuit Design manager",
        "category": "n/a",
        "time": "0",
        runningSince: null
    },
    {
        "id": 5,
        "title": "Paralegal",
        "category": "Health Care",
        "time": "0",
        runningSince: null
    },
    {
        "id": 6,
        "title": "Biostatistician III",
        "category": "Consumer Services",
        "time": "0",
        runningSince: null
    },
    {
        "id": 7,
        "title": "Account Representative I",
        "category": "Basic Industries",
        "time": "0",
        runningSince: null
    },
    {
        "id": 8,
        "title": "Sales Associate",
        "category": "Consumer Services",
        "time": "0",
        runningSince: null
    }
];

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        input TimerInput{
            _id: String!
        }

        input UpdateTimerInput{
            _id: String!
            title: String
            category: String
        }

        input CreateTimerInput{
            title: String!
            category: String
        }

        input SwitchTimerInput{
            _id: String!
            timeStamp: Int!
        }

        input DeleteTimerInput{
            _id: String!
        }


            type Timer{
                _id: ID!
                title: String!
                category: String
                time: Int
                runningSince: Int
            }

            type RootQuery{
                timers: [Timer!]!
                timer(timerInput: TimerInput): Timer
            }

            type RootMutation{
                createTimer(createTimerInput: CreateTimerInput): Timer
                deleteTimer(deleteTimerInput: DeleteTimerInput): Boolean
                updateTimer(updateTimerInput: UpdateTimerInput): Timer
                startTimer(switchTimerInput: SwitchTimerInput): Timer
                stopTimer(switchTimerInput: SwitchTimerInput): Timer
            }


                schema{
                    query: RootQuery
                    mutation: RootMutation
                }

    `),
    rootValue: {
        timers: async () => {

            try {
                const timers = await Timer.find()
                return timers.map(timer => ({ ...timer._doc }))
            }
            catch (err) {
                throw err;
            }
        },
        timer: async args => {
            try {
                return await Timer.findOne({_id: args.timerInput._id})
            }
            catch (err) {
                throw err;
            }
        },
        createTimer: async args =>{
            const timer = new Timer({
                title: args.timerInput.title,
                category: args.timerInput.category,
                time: 0,
                runningSince: null
            })

            try {
                return await timer.save();
            }
            catch (err) {
                throw err;
            }

        },
        updateTimer: async args =>{
        
            const id = args.updateTimerInput._id

            const update = {
                $set:{}
            }

            if(args.updateTimerInput.title){
                update.$set.title = args.updateTimerInput.title
            }

            if(args.updateTimerInput.category){
                update.$set.category = args.updateTimerInput.category
            }

            const options = {
                new: true,
                useFindAndModify:true
            }

            return await Timer.findByIdAndUpdate( id, update, options )
                .then( result =>{
                    console.log(result)
                    return result
                })
                .catch( err =>{
                    throw err
                })
//
        },
        startTimer: async args => {
                
        },

    },
    graphiql:true
}))


mongoose.connect(`${process.env.MONGO_URL}${process.env.MONGO_DB}`, {useNewUrlParser: true})
.then(()=>{})
.catch(error=>{console.log(error)})



app.listen(3001)