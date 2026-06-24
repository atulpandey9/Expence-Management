const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db.js');
const app=require('./src/app')
// Load env vars
dotenv.config();

// Connect to database
connectDB();


app.get('/',(req,res)=>{
    res.send('server is running')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
