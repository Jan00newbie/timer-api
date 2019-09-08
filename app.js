const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const Timer = require('./models/timer')

const app = express()

timers = [{"id":1,"title":"Recruiting Manager","category":"n/a","time":"0", runningSince:false},
{"id":2,"title":"Statistician I","category":"n/a","time":"0", runningSince:null},
{"id":3,"title":"Administrative Officer","category":"Capital Goods","time":"0", runningSince:null},
{"id":4,"title":"Analog Circuit Design manager","category":"n/a","time":"0", runningSince:null},
{"id":5,"title":"Paralegal","category":"Health Care","time":"0", runningSince:null},
{"id":6,"title":"Biostatistician III","category":"Consumer Services","time":"0", runningSince:null},
{"id":7,"title":"Account Representative I","category":"Basic Industries","time":"0", runningSince:null},
{"id":8,"title":"Sales Associate","category":"Consumer Services","time":"0", runningSince:null}];

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Timer{
            _id: ID!
            title: String!
            category: String
            time: Int
            runningSince: Int
        }

        type RootQuery{
            timers: [Timer!]!
        }

        input TimerInput{
            title: String!
            category: String
        }
    
        type RootMutation{
            createTimer(timerInput: TimerInput): Timer
            updateTimer(timerInput: TimerInput): Timer
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        timers: async () =>{

           try {
                const timers = await Timer.find();
                return timers.map(timer => ({ ...timer._doc }));
            }
            catch (err) {
                throw err;
            }
        }
        ,
        async createTimer(args){
            const timer = new Timer({
                title: args.timerInput.title,
                category: args.timerInput.category,
                time: 0,
                runningSince: null
            })

            try {
                const result = await timer.save();
                return result;
            }
            catch (er) {
                return console.log(er);
            }

            
        },
        updateTimer(args){
            const timer = {
                title: args.timerInput.title,
                category: args.timerInput.category,
                time: 0,
                runningSince: null
            }

            timers.push(timer)

            return timer
        }
    },
    graphiql:true
}))


mongoose.connect(`${process.env.MONGO_URL}${process.env.MONGO_DB}`, {useNewUrlParser: true})

.then(()=>{})

.catch(err=>{console.log(error)})



app.listen(3001)