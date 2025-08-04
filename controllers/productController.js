const productModel = require("../models/productModel");
// ✅ Add Product
exports.CreateProduct = async (req, res) => {
  try {
    const { name, description, price, measure, image } = req.body;

    if(!name || !description || !price || !measure || !image){
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newProduct = new productModel({ name, description, price,measure, image });
    await newProduct.save();

    res.status(201).json({ success: true, message: "Product created", newProduct });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to create product", error });
  }
};

// ✅ Edit Product
exports.UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Edit Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// ✅ Delete Product
exports.DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

// ✅ Get All Products
exports.GetAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};
