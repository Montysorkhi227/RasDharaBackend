const express = require("express");
const router = express.Router();

const authAdminMiddleware = require("../middleware/authAdminMiddleware");
const { CreateProduct } = require("../controllers/productController");

// Admin-only routes
router.post("/create", authAdminMiddleware, CreateProduct);
// router.put("/edit/:id", verifyAdmin,);
// router.delete("/delete/:id", verifyAdmin, );

// // Public (optional)
// router.get("/all", productController.getAllProducts);

module.exports = router;
