const express = require("express")
const { AdminLogin } = require("../controllers/userController")
const routes = express.Router()

routes.post("/adminlogin",AdminLogin)
 
module.exports = routes