const fs = require('fs');
const util = require('util');

class ProductManager {
  constructor() {
    this.BD = 'productos.json';
    this.addProd = 'nuevosProductos.json';
  }

  async addProduct(product) {
    try {
      // Leer el archivo 'addProd' en formato de arreglo
      const readFile = util.promisify(fs.readFile);
      const data = await readFile(this.addProd);
      const newProducts = JSON.parse(data);

      // Validar que no se repita el campo 'code' en los nuevos productos
      if (newProducts.find(p => p.code === product.code)) {
        throw new Error('El código del producto ya existe en los nuevos productos.');
      }

      // Validar que todos los campos sean obligatorios
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        throw new Error('Todos los campos son obligatorios.');
      }

      // Generar el campo 'id' auto incremental
      const products = this.getProductsSync();
      const id = products.length + newProducts.length + 1;

      // Agregar el producto al arreglo de nuevos productos
      product.id = id;
      newProducts.push(product);

      // Escribir los nuevos productos en el archivo 'addProd'
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(this.addProd, JSON.stringify(newProducts));

      return 'Producto agregado exitosamente.';
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      // Leer el archivo 'BD' en formato de arreglo
      const readFile = util.promisify(fs.readFile);
      const data = await readFile(this.BD);
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      // Leer el archivo 'BD' en formato de arreglo
      const readFile = util.promisify(fs.readFile);
      const data = await readFile(this.BD);
      const products = JSON.parse(data);

      // Buscar el producto por el ID
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Producto no encontrado.');
      }

      return product;
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  }

  async updateProduct(id, field, value) {
    try {
      // Leer el archivo 'BD' en formato de arreglo
      const readFile = util.promisify(fs.readFile);
      const data = await readFile(this.BD);
      const products = JSON.parse(data);

      // Buscar el producto por el ID
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Producto no encontrado.');
      }

      // Actualizar el campo del producto
      product[field] = value;

      // Escribir los productos actualizados en el archivo 'BD'
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(this.BD, JSON.stringify(products));

      return 'Producto actualizado exitosamente.';
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      // Leer el archivo 'BD' en formato de arreglo
      const readFile = util.promisify(fs.readFile);
      const data = await readFile(this.BD);
      let products = JSON.parse(data);

      // Buscar el índice del producto por el ID
      const productIndex = products.findIndex(p => p.id === id);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado.');
      }

      // Eliminar el producto del arreglo
      products.splice(productIndex, 1);

      // Escribir los productos actualizados en el archivo 'BD'
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(this.BD, JSON.stringify(products));

      return 'Producto eliminado exitosamente.';
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  } 
}
