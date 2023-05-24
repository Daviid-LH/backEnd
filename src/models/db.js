import mongoose from 'mongoose';

mongoose.connect(`mongodb+srv://davidlotina1:davidlotina1@bdprueba.4gpyuzs.mongodb.net/`,{
    dbName: 'ecommerce', 
  });



const db = mongoose.connection;


db.on('error', console.error.bind(console, 'Error to connect MongoDB:'));
db.once('open', () => {
  console.log('Connection succesfully to  MongoDB');
});

export default  db;