import mongoose from 'mongoose';

import db from './db.js';



const collection = 'carts';

const schema = new mongoose.Schema({
    products: [
        {
            _id: false,
            pid: String,
            quantity: Number
        }
    ]
});

schema.statics.createCart = async function (cart, req) {
    try {

        const newCart = new this(cart);
        const result = await newCart.save();
        return result;


    } catch (error) {
        console.error('Error al crear carrito:', error);
        throw error;
    }
};




const cartsModel = db.model(collection, schema);

export default cartsModel;
