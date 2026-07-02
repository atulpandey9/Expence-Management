const {Router}=require('express')
const authcontroller=require('../controllers/auth.controller');
const authrouter=Router();
const authmiddleware=require('../middleware/auth.middleware')

authrouter.post('/register',authcontroller.registeruserController);
authrouter.post('/login',authcontroller.loginuserController)
authrouter.get('/logout',authcontroller.logoutUserController);
authrouter.get('/get-me',authmiddleware.authuser,authcontroller.getMeController)

module.exports=authrouter;