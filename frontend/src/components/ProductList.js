import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      price
      category
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($id: ID, $name: String!, $description: String!, $price: Float!, $inventory: Int!, $category: String!) {
    createProduct(id: $id, name: $name, description: $description, price: $price, inventory: $inventory, category: $category) {
      id
      name
      price
      category
    }
  }
`;

function ProductList() {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct] = useMutation(CREATE_PRODUCT);

  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    inventory: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const variables = {
      id: newProduct.id || undefined,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      inventory: parseInt(newProduct.inventory),
      category: newProduct.category
    };
    console.log('Submitting product with variables:', variables);
    try {
      const result = await createProduct({ variables });
      console.log('Mutation result:', result);
      // ... resto do código
    } catch (err) {
      console.error('Error creating product:', err);
      console.error('Error details:', err.networkError?.result);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="id"
          value={newProduct.id}
          onChange={handleInputChange}
          placeholder="ID (optional)"
        />
        <input
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        <input
          name="inventory"
          type="number"
          value={newProduct.inventory}
          onChange={handleInputChange}
          placeholder="Inventory"
          required
        />
        <input
          name="category"
          value={newProduct.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
        />
        <button type="submit">Create Product</button>
      </form>

      <h2>Product List</h2>
      {data.getProducts.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>ID: {product.id}</p>
          <p>Price: ${product.price}</p>
          <p>Category: {product.category}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;