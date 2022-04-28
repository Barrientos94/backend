const express = require('express');
const app = express.Router();
const ProductoModel = require('../../models/producto/producto.model');

app.get('/', async (req,res)=>{
    try{
        const blnEstado = req.query.blnEstado =="false" ? false: true;
        const obtenerProductos = await ProductoModel.find({blnEstado:blnEstado});
        //console.log(obetenerProductos);

        //funcion con aggregate

        const obetenerProductosConAggregate = await ProductoModel.aggregate([
           
            {$match :{ $expr: {$eq:["$blnEstado",blnEstado] } }}
           
        ]);
        


        if(obtenerProductos.length==0){
            return res.status(400).json({
                ok:false,
                msg:'No se encontraron los productos en la base de datos',
                cont:{
                    obtenerProductos
                 
                }
            })
        }
        return res.status(200).json({
            ok:true,
            msg:'Se obtuvieron los productos de manera exitosa',
            cont:{
             obtenerProductos,
             obetenerProductosConAggregate
            }
        })
    }catch(error){
        return res.status(400).json({
            ok: false,
            msg:'Error en el servidor',
            cont:{
                error
            }
        })
    }
    
})


app.post('/',async (req,res)=>{
    try{
        const body = req.body;
    const productoBody = new ProductoModel(body)
    const err = productoBody.validateSync();
    if(err){
        return res.status(400).json({
            ok:false,
            msg: 'No se recibio uno o más campos, favor de validar',
            cont:{
                err
            }
        })
    }
    const encontroProducto = await ProductoModel.findOne({strNombre: body.strNombre},{strNombre:1});
    if(encontroProducto)
    {
        return res.status(400).json({
            ok:false,
            msg: 'El producto ya se encuentra registrado en la base de datos',
            cont:{
                encontroProducto
            }
        })
    }
    const productoRegistrado = await productoBody.save();
    return res.status(200).json({
        ok:true,
        msg:'El producto se registro de manera exitosa',
        cont:{
            productoRegistrado
        }
    })
    }catch(error){
        return res.status(400).json({
            ok: false,
            msg:'Error en el servidor',
            cont:{
                error
            }
        })
    }
    
})

app.put('/',async (req,res)=>{
    try {
const _idProducto = req.query._idProducto;
if(!_idProducto || _idProducto.length != 24){
    return res.status(400).json({
        ok: false,
        msg: _idProducto ? 'El identificador no es valido' : 'No se recibio el identificador',
        cont:{
            _idProducto
        }
    })
}
const encontroProducto = await ProductoModel.findOne({_id: _idProducto, blnEstado:true});
if(!encontroProducto)
{
    return res.status(400).json({
        ok: false,
        msg: 'El producto no se encuentra registrado',
        cont:{
            encontroProducto
        }
    })
}

const encontroNombreProducto = await ProductoModel.findOne({strNombre: req.body.strNombre, _id:{$ne:_idProducto}},{strNombre:1});
if(encontroNombreProducto)
{
    return res.status(400).json({
        ok:false,
        msg:'El nombre del producto ya se encuentra registrado',
        cont:{
            encontroNombreProducto
        }
    })
}
    //const actualizarProducto = await ProductoModel.updateOne({_id: _idProducto},{$set:{...req.body}});
    const actualizarProducto = await ProductoModel.findByIdAndUpdate( _idProducto,{$set:{...req.body}},{new:true});

    
    if(!actualizarProducto)
    {
        return res.status(400).json({
            ok: false,
            msg:'El producto no se logro actualizar',
            cont:{
                ...req.body
            }
        })
    }
    return res.status(200).json({
        ok:true,
        msg:'El producto se actualizo de manera exitosa',
        cont:{
            productoAnterior: encontroProducto,
            productoActual: req.body
        }
    })
    }catch(error){
        return res.status(400).json({
            ok: false,
            msg:'Error en el servidor',
            cont:{
                error
            }
        })
    }


})

app.delete('/', async (req,res)=>{
    const _idProducto = req.query._idProducto;
    if(!_idProducto || _idProducto.length != 24)
    {
        return res.status(400).json({
            ok: false,
            msg: _idProducto ? 'El identificador  es invalido' : 'No se recibio un identificador',
            cont:{
                _idProducto
            }
        })
    }
    const encontroProducto = await ProductoModel.findOne({_id:_idProducto, blnEstado: true}); 
    
    if(!encontroProducto)
    {
        return res.status(400).json({
            ok:false,
            msg:'El identificado del producto no se encuentra en a la base de datos',
            cont:{
                _idProducto: _idProducto
            }
        })
    }
    //const eliminarProducto = await ProductoModel.findOneAndDelete({_id: _idProducto});
    const desactivarProducto = await ProductoModel.findOneAndUpdate({_id: _idProducto}, {$set: {blnEstado:false}},{new:true})
    if(!desactivarProducto){
        return res.status(400).json({
            ok:true,
            msg:'El producto no se logro desactivar de la base de datos',
            cont:{
                desactivarProducto
            }

        })
    }
        return res.status(200).json({
            ok:true,
            msg:'El producto se desactivo de manera exitosa',
            cont:{
                desactivarProducto
            }

        })

        
})

















//let arrJsnProductos = [{_id:1, strNombre:"", strDescripcion:"", nmbCantidad:0, nmbPrecio:0}]
// app.get('/',(req,res)=>{
//     const arrProductos = arrJsnProductos;
//     if(arrProductos.length<1)
//     {
//         return res.status(400).json({
//             ok:true,
//             msg:'No hay productos en el sistema',
//             cont: {
//                 arrProductos
//             }
//         })
//     }
//     return res.status(200).json({
//         msg:'Se recibieron los productos correctos',
//         cont: {
//             arrJsnProductos
//         }
//     })

// })

// app.post('/',(req,res)=>{

//     const body = {
//         strNombre: req.body.strNombre,
//         strDescripcion: req.body.strDescripcion,
//         nmbCantidad: req.body.nmbCantidad,
//         nmbPrecio: req.body.nmbPrecio,
//         _id: Number(req.body._id)
//     }
//    if(!body.strNombre || !body.strDescripcion || !body.nmbCantidad|| !body.nmbPrecio || !body._id){
//     return res.status(400).json({
//         msg:'No se recibio alguno o todos los valores requeridos',
//         cont:{
//             body
//         }
//     })
       
//    }
//    const encontroProducto = arrJsnProductos.find(producto=> producto._id === body._id);
//    if(encontroProducto){
      
//        return res.status(400).json({
//            ok:false,
//            msg:'El id del producto ya existe',
//            cont:
//            {
//                encontroProducto
//            }
           
//        })
       
//    }
//    arrJsnProductos.push(body)
//    return res.status(200).json({
//     msg:'El producto se agrego correctamente',
//     cont:{
//         arrJsnProductos
//     }
// })
  

// })


// app.put('/',(req,res)=>{
//     const _idProducto = parseInt(req.body._idProducto)

//     if(!_idProducto)
//     {
//         return res.status(400).json
//             ({
//                 ok:false,
//                 msg:'El id del producto no existe',
//                 cont:
//                 {
//                     _idProducto
//                 }
//             })
//     }

//     const encontroProducto = arrJsnProductos.find(producto => producto._id === _idProducto); 
//     if (!encontroProducto)
//     {
//         return res.status(400).json
//             ({
//                 ok:false,
//                 msg:`El producto con el id: ${_idProducto} no se encuentra registrado.`,
//                 cont:
//                 {
//                     _idProducto
//                 }
//             }) 
//     }

//     const actualizarProducto = {_id:_idProducto, strNombre:req.body.strNombre, strDescripcion:req.body.strDescripcion, nmbCantidad:req.body.nmbCantidad, nmbPrecio:req.body.nmbPrecio }
            
//     const filtrarProducto = arrJsnProductos.filter(producto => producto._id !=_idProducto);
    
//     arrJsnProductos = filtrarProducto;
//     arrJsnProductos.push(actualizarProducto);
//     return res.status(200).json({
//         ok:true,
//         msg:`El producto con el id: ${_idProducto} se actualizo de manera exitosa`,
//         cont:
//         {
//             actualizarProducto
//         }
//     }) 


// })


// app.delete('/',(req,res)=>
// {
//     const _idProducto = parseInt(req.query._idProducto);

//     if(!_idProducto)
//     {
//         return res.status(400).json
//             ({
//                 ok:false,
//                 msg:'El id del producto no es valido',
//                 cont:
//                 {
//                     _idProducto
//                 }
//             })
//     }

//     const encontroProducto = arrJsnProductos.find(producto => producto._id === _idProducto);

//     if (!encontroProducto)
//     {
//         return res.status(400).json
//             ({
//                 ok:false,
//                 msg:`El producto con el id: ${_idProducto} no se encuentra registrado.`,
//                 cont:
//                 {
//                     _idProducto
//                 }
//             }) 
//     }

//    const filtrarProducto = arrJsnProductos.filter(producto => producto._id != _idProducto);
    
//     arrJsnProductos = filtrarProducto;

//     return res.status(200).json
//         ({
//             ok:true,
//             msg:`El producto con el id: ${_idProducto} se elimino de manera exitosa`,
//             cont:
//             {
//                 encontroProducto
//             }
//         }) 
// })

module.exports = app;

