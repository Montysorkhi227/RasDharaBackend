const express = require("express");
const router = express.Router();

const authAdminMiddleware = require("../middleware/authAdminMiddleware");
const { CreateProduct, UpdateProduct , DeleteProduct, GetAllProducts } = require("../controllers/productController");

// Admin-only routes
router.post("/create", authAdminMiddleware, CreateProduct);
router.put("/update/:id",authAdminMiddleware, UpdateProduct,);
router.delete("/delete/:id",authAdminMiddleware, DeleteProduct );

// Public (optional)
router.get("/allProducts", GetAllProducts);

module.exports = router;