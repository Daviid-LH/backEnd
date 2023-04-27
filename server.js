const express = require('express');
const productosRouter = require('./src/routes/productos');
const carritoRouter = require('./src/routes/carrito');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on('error', (error) => console.error(error));
