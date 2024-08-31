const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    role: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    inventory: Int!
    category: String!
  }

  type Order {
    id: ID!
    user: User!
    products: [OrderProduct!]!
    totalAmount: Float!
    status: String!
    createdAt: String!
  }

  type OrderProduct {
    product: Product!
    quantity: Int!
  }

  type Query {
    getProducts(category: String): [Product!]!
    getProduct(id: ID!): Product
    getOrders: [Order!]!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    login(email: String!, password: String!): String!
     createProduct(
      id: ID
      name: String!
      description: String!
      price: Float!
      inventory: Int!
      category: String!
    ): Product!
    updateProduct(id: ID!, name: String, description: String, price: Float, inventory: Int, category: String): Product!
    createOrder(products: [OrderProductInput!]!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
  }
`;

module.exports = typeDefs;