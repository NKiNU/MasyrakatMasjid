// controllers/cartController.js
const Cart = require('../model/cart');

const cartController = {
  // Get user's cart
  getUserCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId })
        .populate('items.productId', 'name price img');
      
      if (!cart) {
        return res.json({ items: [] });
      }
      
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add item to cart
  addToCart: async (req, res) => {
    try {
      const { userId, item } = req.body;
      let cart = await Cart.findOne({ userId });
      
      if (cart) {
        const itemIndex = cart.items.findIndex(p => p.productId.toString() === item.productId);
        
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      } else {
        cart = new Cart({
          userId,
          items: [item]
        });
      }
      
      await cart.save();
      cart = await Cart.findById(cart._id).populate('items.productId', 'name price img');
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res) => {
    try {
      console.log("Updating cart item:", req.body);
      const { userId, productId, quantity } = req.body;
      const cart = await Cart.findOne({ userId });
      console.log("Current passed para:", productId, "and cart id:", cart._id);
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      console.log("Current cart items:", cart.items);
      
      
      const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
      console.log("Item index:", itemIndex);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        try {
          await cart.save();
          console.log("Cart successfully saved to the database.");
        } catch (saveError) {
          console.error("Error saving cart:", saveError);
        }
        
        const updatedCart = await Cart.findById(cart._id)
          .populate('items.productId', 'name price img');
          console.log("Updated cart:", updatedCart);
        res.json(updatedCart);
      } else {
        res.status(404).json({ message: 'Item not found in cart' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    try {
      const { userId, productId } = req.body;
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
      
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      await Cart.findOneAndDelete({ userId: req.params.userId });
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Save entire cart
  saveCart: async (req, res) => {
    try {
      const { userId, items } = req.body;
      let cart = await Cart.findOne({ userId });
      
      if (cart) {
        cart.items = items;
      } else {
        cart = new Cart({
          userId,
          items
        });
      }
      
      await cart.save();
      cart = await Cart.findById(cart._id)
        .populate('items.productId', 'name price img');
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = cartController;