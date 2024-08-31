const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Product, Order } = require('../models');
const { UserInputError } = require('apollo-server-express');

const resolvers = {
    Query: {
        getProducts: async (_, { category }) => {
          if (category) {
            return await Product.find({ category });
          }
          return await Product.find();
        },
        getProduct: async (_, { id }) => await Product.findById(id),
        getOrders: async (_, __, { user }) => {
          if (!user || user.role !== 'admin') throw new Error('Not authorized');
          return await Order.find().populate('user').populate('products.product');
        }
    },
  Mutation: {
    createUser: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, role: 'customer' });
      await user.save();
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },
    createProduct: async (_, args) => {
        console.log('Received args:', args);
        try {
          const productData = {
            ...(args.id && { _id: args.id }),
            name: args.name,
            description: args.description,
            price: args.price,
            inventory: args.inventory,
            category: args.category
          };
          console.log('Creating product with data:', productData);
          const product = new Product(productData);
          await product.save();
          console.log('Product created successfully:', product);
          return product;
        } catch (error) {
          console.error('Error creating product:', error);
          if (error.code === 11000) {
            throw new UserInputError('Um produto com este ID já existe');
          }
          throw error;
        }
      },
    updateProduct: async (_, args, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      return await Product.findByIdAndUpdate(args.id, args, { new: true });
    },
    createOrder: async (_, { products }, { user }) => {
        if (!user) throw new Error('Not authenticated');
        let totalAmount = 0;
        try {
          const orderProducts = await Promise.all(products.map(async ({ productId, quantity }) => {
            const product = await Product.findOne({ _id: productId });
            if (!product) {
              throw new UserInputError(`Product not found: ${productId}`);
            }
            if (product.inventory < quantity) {
              throw new UserInputError(`Insufficient inventory for product: ${productId}`);
            }
            product.inventory -= quantity;
            await product.save();
            totalAmount += product.price * quantity;
            return { product: productId, quantity };
          }));
      
          const order = new Order({
            user: user.userId,
            products: orderProducts,
            totalAmount,
            status: 'Pending',
            createdAt: new Date()
          });
          await order.save();
          return order;
        } catch (error) {
          console.error('Error creating order:', error);
          if (error instanceof UserInputError) {
            throw error;
          }
          throw new Error('An error occurred while creating the order');
        }
      },
    updateOrderStatus: async (_, { id, status }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      return await Order.findByIdAndUpdate(id, { status }, { new: true });
    }
  }
};

module.exports = resolvers;