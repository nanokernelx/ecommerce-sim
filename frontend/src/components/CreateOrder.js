import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_ORDER = gql`
  mutation CreateOrder($products: [OrderProductInput!]!) {
    createOrder(products: $products) {
      id
      totalAmount
      status
    }
  }
`;

function CreateOrder() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [createOrder, { data, loading, error }] = useMutation(CREATE_ORDER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({
        variables: {
          products: [{ productId, quantity: parseInt(quantity) }]
        }
      });
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Product ID"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          min="1"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red' }}>
          Error: {error.message}
        </p>
      )}

      {data && (
        <p style={{ color: 'green' }}>
          Order created successfully! Order ID: {data.createOrder.id}
        </p>
      )}
    </div>
  );
}

export default CreateOrder;