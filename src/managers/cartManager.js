const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const productsDB = require('../products.json');
const cartDB = require('../carts.json');

const addProductToCart = async (productId) => {
  const selectedProduct = productsDB.find(product => product.id === productId);

  if (!selectedProduct) {
    throw new Error('Product not found');
  }

  const cartProduct = {
    id: uuidv4(),
    product: selectedProduct,
    quantity: 1
  };

  const existingCartProductIndex = cartDB.products.findIndex(cartProduct => cartProduct.product.id === productId);

  if (existingCartProductIndex >= 0) {
    cartDB.products[existingCartProductIndex].quantity += 1;
  } else {
    cartDB.products.push(cartProduct);
  }

  fs.writeFileSync('./cart.json', JSON.stringify(cartDB));
  return cartProduct;
};

const getCartProducts = async () => {
  return cartDB;
};

module.exports = {
  addProductToCart,
  getCartProducts
};
