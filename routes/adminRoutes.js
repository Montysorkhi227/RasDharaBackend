const express = require("express")
const { adminLogin } = require("../controllers/userController")
const routes = express.Router()

routes.post("/adminlogin",adminLogin)
 
module.exports = routes