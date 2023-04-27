const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const PRODUCTS_FILE = path.join(__dirname, '..', 'products.json');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, uuidv4() + '.' + ext);
  }
});

const upload = multer({ storage: storage });

const readProductsFile = async () => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Could not read products file');
  }
};

const writeProductsFile = async (data) => {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error('Could not write to products file');
  }
};

const addProduct = async (product) => {
  const products = await readProductsFile();

  // Check if product with same code already exists
  const codeExists = products.some((p) => p.code === product.code);
  if (codeExists) {
    throw new Error('Product with same code already exists');
  }

  const newProduct = {
    id: uuidv4(),
    title: product.title,
    description: product.description,
    code: product.code,
    price: product.price,
    status: true,
    stock: product.stock,
    category: product.category,
    thumbnails: product.thumbnails
  };

  products.push(newProduct);
  await writeProductsFile(products);

  return newProduct;
};

const getProducts = async (limit) => {
  const products = await readProductsFile();

  if (limit) {
    return products.slice(0, limit);
  }

  return products;
};

const getProductById = async (id) => {
  const products = await readProductsFile();
  const product = products.find((p) => p.id === id);

  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }

  return product;
};

const updateProduct = async (id, updates) => {
  const products = await readProductsFile();

  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    throw new Error(`Product with id ${id} not found`);
  }

  products[productIndex] = { ...products[productIndex], ...updates };

  await writeProductsFile(products);

  return products[productIndex];
};

const deleteProduct = async (id) => {
  const products = await readProductsFile();

  const updatedProducts = products.filter((p) => p.id !== id);

  if (updatedProducts.length === products.length) {
    throw new Error(`Product with id ${id} not found`);
  }

  await writeProductsFile(updatedProducts);
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  upload
};
