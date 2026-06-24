const {Router}=require('express')
const authcontroller=require('../controllers/auth.controller');
const authrouter=Router();


authrouter.post('/register',authcontroller.registeruserController);

module.exports=authrouter;