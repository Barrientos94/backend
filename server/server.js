require('./config/config');
require('colors');
const express = require('express');
const mongoose=require('mongoose'); //importar libreria mongoose
const app = express();
const cors = require('cors');
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    next();
});
app.use('/api',require('./routes/index'));
//console.log(process.env.URLDB,'URLDB');
//conexión a la base de datos



mongoose.connect(process.env.URLDB, (err,resp)=>{
    if(err){
        console.log('Error al conectar la base de datos'.red);
        return err
    }
    console.log(`Base de datos ONLINE`, (process.env.URLDB).blue);
}) 


app.listen(process.env.PORT, ()=>{
    console.log('[NODE]'.green, 'esta corriendo en el puerto: '.yellow, (process.env.PORT).yellow);
});