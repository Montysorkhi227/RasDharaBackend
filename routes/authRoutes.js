const express = require("express")
const { VerifyOtp , ForgetPassword, ResetPassword } = require("../controllers/authController")
const routes = express.Router()

routes.post("/verifyotp",VerifyOtp)
routes.post("/forgetpassword",ForgetPassword)
routes.post("/resetpassword",ResetPassword)
module.exports = routes