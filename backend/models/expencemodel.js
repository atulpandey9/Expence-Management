const mongoose = require("mongoose");

const expenceSchema = mongoose.Schema({
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
        default: "expense",
    },
})


module.exports = mongoose.model("Expense", expenceSchema);