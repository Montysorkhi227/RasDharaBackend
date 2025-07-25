const express = require("express")
const { Signup, VerifyOtp, userLogin} = require("../controllers/userController")
const routes = express.Router()

routes.post("/signup",Signup)
routes.post("/verifyotp",VerifyOtp)
routes.post("/userlogin",userLogin)

module.exports = routes