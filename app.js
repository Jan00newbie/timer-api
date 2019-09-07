const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

app.use(bodyParser.json())
const xd ="XD"
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery{
            timers: [String]
        }
    
        type RootMutation{
            createTimer(name: String): String
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: ''
}))

app.listen(4000 )