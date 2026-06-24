const mongoose = require("mongoose");

const incomeSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        default: "income",
    },
})


module.exports = mongoose.model("Income", incomeSchema);