const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const cors = require('cors')

const Timer = require('./models/timer')

const app = express()

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
                category: String!
                time: Int!
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
            const timers = await Timer
                .find()
                .catch(err =>{throw err})

            return timers.map(timer => ({ ...timer._doc }))
        },

        timer: async args => {
            return await Timer
                .findOne({_id: args.timerInput._id})
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

        updateTimer: async args =>{
            const id = args.updateTimerInput._id

            const update = {
                $set:{
                    title: args.updateTimerInput.title,
                    category: args.updateTimerInput.category
                }
            }

            const options = {
                new: true,
                useFindAndModify:true
            }

            return await Timer.findByIdAndUpdate( id, update, options )
                .catch( err =>{
                    throw err
                })
        },
        startTimer: async args => {
                
        },
        stopTimer: async args => {
                
        },

    },
    graphiql:true
}))


mongoose.connect(`${process.env.MONGO_URL}${process.env.MONGO_DB}`, {useNewUrlParser: true})
.then(()=>{})
.catch(error=>{console.log(error)})



app.listen(3001)