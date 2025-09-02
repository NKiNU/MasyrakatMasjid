import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../api/productApi';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ManageProducts = () => {
  const { auth,user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      console.log(user)
    }
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    Navigate('/addProduct')

    // const productData = {

    //   name: 'New Product',
    //   price: 100,
    //   description: "Testing",
    //   stock: 10
    // };
  
    // try {
    //   const response = await addProduct(productData,user)

    //   console.log(response.data);
  
    //   const updatedProducts = await getProducts();
    //   setProducts(updatedProducts);
    // } catch (error) {
    //   console.error('Error adding product:', error);
    // }
  };
  

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id, auth.token);
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  return (
    <div>
      <h1>Manage Products</h1>
      <button onClick={Navigate("/addProduct")}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
