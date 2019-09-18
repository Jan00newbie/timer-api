const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const cors = require('cors')

const Timer = require('./models/timer')

const app = express()


const updateTimerHelper = async (id, args) => {

    const update = {
        $set: args
    }

    const options = {
        new: true,
        useFindAndModify:true
    }

    return await Timer.findByIdAndUpdate( id, update, options )
        .catch( err =>{ throw err })
}

app.use(bodyParser.json())

app.use('/graphql', cors(), graphqlHttp({
    schema: buildSchema(`

        input TimerInput{
            _id: String!
        }

        input UpdateTimerInput{
            _id: String!
            title: String!
            category: String!
        }

        input CreateTimerInput{
            title: String!
            category: String!
        }

        input DeleteTimerInput{
            _id: String!
        }

            type Timer{
                _id: ID!
                title: String!
                category: String!
                time: Int!
                runningSince: Float
            }

            type RootQuery{
                timers: [Timer!]!
                timer(timerInput: TimerInput): Timer
            }

            type RootMutation{
                createTimer(createTimerInput: CreateTimerInput): Timer
                deleteTimer(deleteTimerInput: DeleteTimerInput): Boolean
                updateTimer(updateTimerInput: UpdateTimerInput): Timer
                startTimer(_id: String): Timer
                stopTimer(_id: String): Timer
            }


                schema{
                    query: RootQuery
                    mutation: RootMutation
                }

    `),
    rootValue: {
        timers: async () => {
            const timers = await Timer
                .find()
                .catch(err => {throw err} )

            return timers.map(timer => ({ ...timer._doc }))
        },

        timer: async args => {
            return await Timer
                .findOne({ _id: args.timerInput._id })
                .catch(err =>{throw err})
        },

        createTimer: async args =>{
            const timer = new Timer({
                title: args.createTimerInput.title,
                category: args.createTimerInput.category,
                time: 0,
                runningSince: null
            })

            return await timer
                .save()
                .catch(err =>{throw err})
        },

        updateTimer: async args => {
            return await updateTimerHelper(args.updateTimerInput._id, { 
                title: args.updateTimerInput.title, 
                category: args.updateTimerInput.category
            })
        },

        startTimer: async args => {
            return await updateTimerHelper(args._id, {
                runningSince: Date.now()
            })
        },

        stopTimer: async args => {
            return Timer.findById(args._id)
                .then( async foundTimer => 
                    await updateTimerHelper(args._id, {
                        runningSince: null,
                        time: foundTimer.time + (Date.now() - foundTimer.runningSince)
                    })
                )
                .catch(err => {throw err})
        },

    },
    graphiql:true
}))


mongoose.connect(`${process.env.MONGO_URL}${process.env.MONGO_DB}`, {useNewUrlParser: true})
    .catch(error=>{throw error})



app.listen(3001)