  const Product = require('../model/product');

exports.getProducts = async (req, res) => {
  const products = await Product.find().populate('createdBy', 'username').populate('updatedBy', 'username');
  res.json(products);
  console.log("fetch to frontend")
};

// Ensure to require the Product model

exports.addProduct = async (req, res) => {
  console.log("in addproduct")
  try {
    req.user=""
  
    console.log(req.body)
    const { img,name, price,description, stock } = req.body;

    // // Validate required fields
    // if (!name || !price || !description || !stock) {
    //   return res.status(400).json({ success: false, message: 'All fields are required.' });
    // }

    // // Ensure price and stock are valid numbers
    // if (typeof price !== 'number' || typeof stock !== 'number') {
    //   return res.status(400).json({ success: false, message: 'Price and stock must be numbers.' });
    // }

    // Create a new product
    const product = new Product({
      img,
      name,
      price,
      description,
      stock,
      createdBy: req.user._id, // Assuming the user's ID is stored in req.user._id
    });

    console.log(product)

    // Save the product to the database
    await product.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error. Could not add product.',
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log("in update product")
    const { name, price, description, stock, img } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, stock, img },
      { new: true, runValidators: true } // Returns updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log("update success: " ,updatedProduct);
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product Deleted' });
};

exports.getProductById = async (req, res) => {
  console.log("in get product by id");
  try {
    const product = await Product.findById(req.params.id);
    
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Could not fetch product.' });
  }
};

