const express = require("express")
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcrypt = require('bcrypt');
const usuarioModel = require("../../models/usuario/usuario.model");
const { off } = require("../../models/usuario/usuario.model");

app.get('/', async (req,res)=>{
    const blnEstado =req.query.blnEstado == "false" ? false : true;
const obtenerUsuario = await UsuarioModel.find({blnEstado:blnEstado},{strContrasena:0});
    
    
    if(obtenerUsuario == 0){
    return res.status(400).json({
        ok:false,
        msg:'No se encontraron usuarios en la base de datos',
        cont:{
            obtenerUsuario
        }
    })
}

//const datosUsuario = await UsuarioModel.find({blnEstado:blnEstado},{strContrasena:0})
    return res.status(200).json({
                    ok:true,
                   msg:'Se encontraron los usuarios de manera exitosa',
                     cont:{
                      obtenerUsuario
                   }
                })
    

})

app.post('/', async (req,res)=>{
    //ternario pregunta si algo existe ? (lo que pasa si existe) : (no existe);
    const body = {...req.body,strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena, 10 ): undefined};
    const bodyUsuario = new UsuarioModel(body);




const obtenerEmail = await UsuarioModel.findOne({strEmail:body.strEmail});
const obtenerNombreUsuario = await UsuarioModel.findOne({strNombreUsuario:body.strNombreUsuario});
   


 if(obtenerEmail)
 {
    return res.status(400).json({
        ok:false,
       msg:'El email ya se encuentra registrado',
        cont:{
            body
        }
     })
 }

 if(obtenerNombreUsuario)
 {
    return res.status(400).json({
        ok:false,
       msg:'El nombre de usuario ya se encuentra registrado',
        cont:{
            body
        }
     })
 }

 const err = bodyUsuario.validateSync();
 if(err)
 {
  return res.status(400).json({
         ok:false,
         msg:'Alguno de los campos requeridos no se envio',
        cont:{
             err
         }
   })
 }
const usuarioRegistrado = await bodyUsuario.save()
 return res.status(200).json({
    ok:true,
    msg:'El usuario se a registrado de manera exitosa',
  
   cont:{
      usuarioRegistrado
    }
 })
})

app.put('/', async (req,res)=>{
    try{
        const _idUsuario = req.query._idUsuario;
       
        if(!_idUsuario || _idUsuario.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idUsuario ? 'El identificador no es valido' : 'No se recibio el identificador',
                cont:{
                    _idUsuario
                }
            })
        }
        const encontroUsuario = await usuarioModel.findOne({_id: _idUsuario,blnEstado:true});
        
        if(!encontroUsuario)
        {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se encuentra registrado',
                cont:{
                    encontroUsuario
                }
            })
        }
        const encontroNombreUsuario= await UsuarioModel.findOne({strNombreUsuario: req.body.strNombreUsuario, _id:{$ne: _idUsuario}},{strNombre:1,strNombreUsuario:1})
        if(encontroNombreUsuario)
        {
            return res.status(400).json({
                ok:false,
                msg:'El nombre de usuario ya se encuentra registrado en la base de datos',
                cont:{
                    encontroNombreUsuario
                }
            })
        }
    


        const actualizarUsuario = await UsuarioModel.findByIdAndUpdate(_idUsuario,{$set:{strNombre:req.body.strNombre, strApellido:req.body.strApellido, strDireccion:req.body.strDireccion,strNombreUsuario:req.body.strNombreUsuario, idEmpresa:req.body.idEmpresa}},{new:true});
        
        if(!actualizarUsuario)
        {
            
        return res.status(400).json({
            ok: false,
            msg:'El usuario no se logro actualizar',
            cont:{
                ...req.body
            }
        })
        }
        return res.status(200).json({
            ok:true,
            msg:'El usuario se actualizo de manera exitosa',
            cont:{
                usuarioAnterior: encontroUsuario,
                usuarioActual: actualizarUsuario
            }
        })

    }
    catch(error){
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
    try
    {
        const _idUsuario = req.query._idUsuario;
        const blnEstado =req.query.blnEstado=="false" ? false : true;
        if(!_idUsuario || _idUsuario.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idUsuario ? 'El identificador no es valido' : 'No se recibio el identificador',
                cont:{
                    _idUsuario: _idUsuario
                }
            })
        }
        const modificarEstadoUsuario =  await UsuarioModel.findOneAndUpdate({_id: _idUsuario},{$set:{blnEstado:blnEstado}},{new:true})

        return res.status(200).json({
            ok:true,
            msg:blnEstado == true ? 'Se activo el usuario de manera exitosa' : 'Se desactivo el usaurio de manera exitosa',
            cont:{
              
                modificarEstadoUsuario
            }
        })
    }
    catch(error){
        return res.status(400).json({
            ok: false,
            msg:'Error en el servidor',
            cont:{
                error
            }
        })
    }
})


// let arrJsnUsuarios= [{ _id: 1, strNombre: "", strApellido: "", strEmail:""}]
//const path = require('path');
//const rutaDescarga = path.resolve(__dirname,'../../assets/index.html');
// app.get('/',(req,res)=>{
//     const arrUsuarios = arrJsnUsuarios;
//     if(arrUsuarios.length>0){
//        return res.status(200).json({
//             ok: true,
//             msg:'Se recibieron los usaurios de manera exitosa',
//             cont:{
//                 arrUsuarios
//             }
//         })

//     }
//     else
//     {
//         return res.status(400).json({
//             ok:false,
//             msg:'No se encontraron usuarios',
//             cont:{
//                 arrUsuarios
//             }
//         })
//     }
   
//     //return res.download(rutaDescarga,'documento.html')
// })

// app.get('/obtenerUsuario',(req,res)=>{

// const _idUsuario=parseInt(req.query._idUsuario);
// if(!_idUsuario){
//     return res.status(400).json({
//         ok:false,
//         msg:'No se recibio ningun ID',
//         cont:{
//             _idUsuario
//         }
//     })
// }
// const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
// if(!encontroUsuario){
//     return res.status(400).json({
//         ok:false,
//         msg:'El usuario no existe',
//         cont:{
//             encontroUsuario
//         }
//     })
// }

// return res.status(200).json({
//     ok:true,
//     msg:'El usuario se encontro exitosamente',
//     cont:{
//         encontroUsuario
//     }
// })



// })

// app.post('/',(req,res)=> {
//     const body= {
//         strNombre: req.body.strNombre,
//         strApellido: req.body.strApellido,
//         strEmail: req.body.strEmail,
//         _id: Number(req.body._id)
//     }
//   if(body.strNombre && body.strApellido && body.strEmail && body._id)
//   {
// const encontroUsuario =  arrJsnUsuarios.find(usuario=> usuario._id == body._id)
//  if(encontroUsuario){
//     res.status(400).json({
//         ok:false,
//         msg:'El usuario ya se encuentra registrado',
//         cont:
//         {
//             encontroUsuario
//         }
//     })
//  }
//  else {

//     arrJsnUsuarios.push(body)
//     res.status(200).json({
//         ok:true,
//         msg:'Se registro el usuario de manera correcta',
//         cont:
//         {
//             arrJsnUsuarios
//         }
//     })
//   }
// }
//   else
//   {
//     res.status(400).json({
//         ok:false,
//         msg:'No se recibio alguno o todos los valores requeridos',
//         cont:
//         {
//             body
//         }
//     })
//   }
   
// })

// app.put('/', (req,res)=>{
//     const _idUsuario = parseInt(req.query._idUsuario)
    
//     if(_idUsuario){
//         const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
//         if(encontroUsuario){
//             const actrualizarUsuario = {_id: _idUsuario, strNombre:req.body.strNombre, strApellido:req.body.strApellido, strEmail:req.body.strEmail}
               
//                const filtrarUsuario=arrJsnUsuarios.filter(usuario => usuario._id !=_idUsuario)
               
//                arrJsnUsuarios = filtrarUsuario;
//                arrJsnUsuarios.push(actrualizarUsuario)
//                return res.status(200).json({
//                    ok:true,
//                    msg:'El usuario se actualizo de manera exitosa',
//                    cont:{
//                        actrualizarUsuario
//                    }
//                })
//         }
//         else{
//             return res.status(400).json({
//                 ok:false,
//                 msg: `El usuario con el _id: ${_idUsuario}, no se encuentra registrado en la base de datos`,
//                 cont:{
//                     _idUsuario
//                 }
//             })
//         }

//     }else{
//         return res.status(400).json({
//             ok:false,
//             msg:'El identificador no existe',
//             cont:{
//                 _idUsuario
//             }
//         })
//     }
// })

// app.delete('/',(req,res)=>{
//     const _idUsuario = parseInt( req.query._idUsuario);
//     if(!_idUsuario){
//          return res.status(400).json({
//             ok:false,
//             msg:'No se recibio un identificador de usuario',
//             cont:{
//                 _idUsuario
//             }
//         })
//     }
//     const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario);
//     if(!encontroUsuario){
//         return res.status(400).json({
//             ok:false,
//             msg:`No se encontro un usuario con el _id: ${_idUsuario} en la base de datos`,
//             cont:{
//                 _idUsuario
//             }
//         })
//     }
//     const usuariofiltrado = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario);
//     arrJsnUsuarios=usuariofiltrado;
//     return res.status(200).json({
//         ok:true,
//         msg:'Se elimino el usuario de manera exitosa',
//         cont:{
//             encontroUsuario
//         }
//     })
// })

module.exports=app;
