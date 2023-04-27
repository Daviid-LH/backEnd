const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct, upload } = require('../managers/productManager');
//const upload = require('../managers/productManager');

router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    const product = await getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: `Product with ID ${pid} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.array('thumbnails'), async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;
  const thumbnails = req.files.map(file => file.path);
  try {
    const product = await addProduct({ title, description, code, price, status, stock, category, thumbnails });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  try {
    const product = await updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: `Product with ID ${pid} not found` });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    const deletedProduct = await deleteProduct(pid);
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: `Product with ID ${pid} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
