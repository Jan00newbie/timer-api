const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    runningSince: Number
})

module.exports = mongoose.model('Timer', timerSchema)