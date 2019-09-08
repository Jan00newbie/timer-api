const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: String,
    time: Number,
    runningSince: Number
})

module.exports = mongoose.model('Timer', timerSchema)