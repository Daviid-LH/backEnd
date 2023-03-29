

class ProductManager {
    constructor() {
      this.products = [];
      this.productId = 0;
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que no se repita el campo code y que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son obligatorios');
            return;
        }
        if (this.products.some(product => product.code === code)) {
            console.error('El código del producto ya existe');
            return;
        }
        
        // Crear el objeto producto con un campo adicional llamado id autoincremental
        const product = {
            id: ++this.productId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        
        // Agregar el producto al arreglo products
        this.products.push(product);
    }
    
    getProducts() {
        // Devolver el arreglo products con todos los productos creados
        return this.products;
    }
    
    getProductById(id) {
        // Buscar en el arreglo products el id que coincida con el id obtenido
        const product = this.products.find(product => product.id === id);
        if (!product) {
            // En caso de no coincidir ningún id debe mostrar un mensaje en consola de error con el mensaje "not found"
            console.error('Not found');
        }
        return product;
    }
}

const productManager = new ProductManager();

productManager.addProduct('Producto 1', 'Descripción del producto 1', 10.99, 'imagen1.png', 'PROD1', 50);
productManager.addProduct('Producto 2', 'Descripción del producto 2', 20.99, 'imagen2.png', 'PROD2', 20);
// Arroja error por producto repetido en campo code
productManager.addProduct('Producto 3', 'Descripción del producto 3', 20.99, 'imagen2.png', 'PROD2', 20);
console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(3)); // Este debe mostrar un mensaje de error en consola
