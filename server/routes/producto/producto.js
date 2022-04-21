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
        msg:'Se recibieron los productos correctos',
        cont: {
            arrJsnProductos
        }
    })

})

app.post('/',(req,res)=>{

    const body = {
        strNombre: req.body.strNombre,
        strDescripcion: req.body.strDescripcion,
        nmbCantidad: req.body.nmbCantidad,
        nmbPrecio: req.body.nmbPrecio,
        _id: Number(req.body._id)
    }
   if(!body.strNombre || !body.strDescripcion || !body.nmbCantidad|| !body.nmbPrecio || !body._id){
    return res.status(400).json({
        msg:'No se recibio alguno o todos los valores requeridos',
        cont:{
            body
        }
    })
       
   }
   const encontroProducto = arrJsnProductos.find(producto=> producto._id === body._id);
   if(encontroProducto){
      
       return res.status(400).json({
           ok:false,
           msg:'El id del producto ya existe',
           cont:
           {
               encontroProducto
           }
           
       })
       
   }
   arrJsnProductos.push(body)
   return res.status(200).json({
    msg:'El producto se agrego correctamente',
    cont:{
        arrJsnProductos
    }
})
  

})


app.put('/',(req,res)=>{
    const _idProducto = parseInt(req.query._idProducto)

    if(!_idProducto)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:'El id del producto no existe',
                cont:
                {
                    _idProducto
                }
            })
    }

    const encontroProducto = arrJsnProductos.find(producto => producto._id === _idProducto); 
    if (!encontroProducto)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:`El producto con el id: ${_idProducto} no se encuentra registrado.`,
                cont:
                {
                    _idProducto
                }
            }) 
    }

    const actualizarProducto = {_id:_idProducto, strNombre:req.body.strNombre, strDescripcion:req.body.strDescripcion, nmbCantidad:req.body.nmbCantidad, nmbPrecio:req.body.nmbPrecio }
            
    const filtrarProducto = arrJsnProductos.filter(producto => producto._id !=_idProducto);
    
    arrJsnProductos = filtrarProducto;
    arrJsnProductos.push(actualizarProducto);
    return res.status(200).json({
        ok:true,
        msg:`El producto con el id: ${_idProducto} se actualizo de manera exitosa`,
        cont:
        {
            actualizarProducto
        }
    }) 


})


app.delete('/',(req,res)=>
{
    const _idProducto = parseInt(req.body._id);

    if(!_idProducto)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:'El id del producto no es valido',
                cont:
                {
                    _idProducto
                }
            })
    }

    const encontroProducto = arrJsnProductos.find(producto => producto._id === _idProducto);
        
    if (!encontroProducto)
    {
        return res.status(400).json
            ({
                ok:false,
                msg:`El producto con el id: ${_idProducto} no se encuentra registrado.`,
                cont:
                {
                    _idProducto
                }
            }) 
    }

    const eliminarProducto = {_id:_idProducto, strNombre:req.body.strNombre, strDescripcion:req.body.strDescripcion, nmbCantidad:req.body.nmbCantidad, nmbPrecio: req.body.nmbPrecio }
            
    const filtrarProducto = arrJsnProductos.filter(producto => producto._id != _idProducto);
    
    arrJsnProductos = filtrarProducto;

    return res.status(200).json
        ({
            ok:true,
            msg:`El producto con el id: ${_idProducto} se elimino de manera exitosa`,
            cont:
            {
                eliminarProducto
            }
        }) 
})

module.exports = app;

