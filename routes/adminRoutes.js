const express = require("express")
const { AdminLogin } = require("../controllers/adminController")
const routes = express.Router()

routes.post("/adminlogin",AdminLogin)
 
module.exports = routes