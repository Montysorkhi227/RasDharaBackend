const express = require("express")
const { VerifyOtp , ForgetPassword, ResetPassword, ChangePassword } = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const routes = express.Router()

routes.post("/verifyotp",VerifyOtp)
routes.post("/forgetpassword",ForgetPassword)
routes.post("/resetpassword",authMiddleware,ResetPassword)
routes.post("/changepassword",authMiddleware,ChangePassword)
module.exports = routes