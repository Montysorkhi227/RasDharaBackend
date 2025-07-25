const express = require("express")
const { Signup, VerifyOtp, UserLogin} = require("../controllers/userController")
const routes = express.Router()

routes.post("/signup",Signup)
routes.post("/verifyotp",VerifyOtp)
routes.post("/userlogin",UserLogin)

module.exports = routes