const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyAdmin = require("../middleware/VerifyAdmin");

// Admin-only routes
router.post("/create", verifyAdmin, productController.createProduct);
router.put("/edit/:id", verifyAdmin, productController.editProduct);
router.delete("/delete/:id", verifyAdmin, productController.deleteProduct);

// Public (optional)
router.get("/all", productController.getAllProducts);

module.exports = router;
