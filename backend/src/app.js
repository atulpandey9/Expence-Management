const express=require('express');
const cors = require('cors');
const routes=require('./routes/income.Routes.js')
const authrouter=require('./routes/auth.Routes.js')

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/incomes', require('./routes/income.Routes.js'));
app.use('/api/expenses', require('./routes/expense.Routes.js'));
app.use('/api/stats', require('./routes/stats.Routes.js'));
app.use('/api/auth',authrouter)
module.exports=app;
