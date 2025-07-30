const express = require("express")
const { Signup , UserLogin} = require("../controllers/userController")
const routes = express.Router()

routes.post("/signup",Signup)
routes.post("/userlogin",UserLogin)

module.exports = routes