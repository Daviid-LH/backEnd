const express = require('express');
const multer = require('multer');
const { ProductManager, CartManager } = require('./productManager');
const app = express();

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Instanciación de los manejadores de productos y carritos
const productManagers = new ProductManager('./productos.json');
const cartManagers = new CartManager('./carrito.json');

// Rutas para manejo de productos
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const limit = req.query.limit;
  const products = await productManagers.getProducts(limit);
  console.log(products);
  res.json(products); 
});

productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await productManagers.getProductById(productId);
  res.json(product);
});

productsRouter.post('/', upload.array('thumbnails', 3), async (req, res) => {
  const newProduct = {
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.files.map(file => file.path)
  };
  const addedProduct = await productManagers.addProduct(newProduct);
  res.json(addedProduct);
});

productsRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const productUpdates = req.body;
  const updatedProduct = await productManagers.updateProduct(productId, productUpdates);
  res.json(updatedProduct);
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  await productManagers.deleteProduct(productId);
  res.sendStatus(204);
});

// Rutas para manejo de carritos
const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  const newCart = await cartManagers.createCart();
  res.json(newCart);
});

cartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManagers.getCartById(cartId);
  res.json(cart);
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const addedProduct = await cartManagers.addProductToCart(cartId, productId);
  res.json(addedProduct);
});

// Configuración de rutas principales
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi sitio web!');
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Inicialización del servidor
const port = 8080;
app.listen(port, () => {
  console.log(`Servidor iniciado en puerto ${port}`);
});
