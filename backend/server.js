const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db.js');
const  {connectRedis}=require('./src/config/redis.js')
const app=require('./src/app')
// Load env vars
dotenv.config();

// Connect to database
connectDB();

connectRedis().catch((error) => {
    console.error('Redis connection failed, continuing without cache:', error.message);
});

app.get('/',(req,res)=>{
    res.send('server is running')
})

const PORT =process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
