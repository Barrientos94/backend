const express = require('express');
const app = express.Router();

const arrJsnProductos = [{_id:1, strNombre:"", strDescripcion:"", nmbCantidad:0, nmbPrecio:0}]
app.get('/',(req,res)=>{
    const arrProductos = arrJsnProductos;
    if(arrProductos.length<1)
    {
        return res.status(400).json({
            ok:true,
            msg:'No hay productos en el sistema',
            cont: {
                arrProductos
            }
        })
    }
    return res.status(200).json({
        
    })

})


module.exports = app;

