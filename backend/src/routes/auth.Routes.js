const {Router}=require('express')
const authcontroller=require('../controllers/auth.controller');
const authrouter=Router();


authrouter.post('/register',authcontroller.registeruserController);
authrouter.post('/login',authcontroller.loginuserController)

module.exports=authrouter;