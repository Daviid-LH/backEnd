// Importar las dependencias necesarias
const express = require('express');
const ProductManager = require('./ProductManager');

// Crear una instancia de ProductManager
const productManager = new ProductManager();

// Crear una instancia de Express
const app = express();

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit; // Obtener el parámetro de límite, si existe
    const products = await productManager.getProducts(); // Obtener todos los productos de la BD
    if (limit) {
      // Si se especificó un límite, devolver solo los primeros n productos
      res.json(products.slice(0, limit));
    } else {
      // Si no se especificó un límite, devolver todos los productos
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid); // Obtener el ID del producto como un número entero
    const product = await productManager.getProductById(pid); // Obtener el producto de la BD
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Crear 15 productos aleatorios

// Iniciar el servidor
app.listen(8080, () => console.log('Servidor iniciado en el puerto 8080.'));
