const express = require("express")
const app = express.Router();
let arrJsnUsuarios= [{ _id: 1, strNombre: "", strApellido: "", strEmail:""}]
//const path = require('path');
//const rutaDescarga = path.resolve(__dirname,'../../assets/index.html');
app.get('/',(req,res)=>{
    const arrUsuarios = arrJsnUsuarios;
    if(arrUsuarios.length>0){
       return res.status(200).json({
            ok: true,
            msg:'Se recibieron los usaurios de manera exitosa',
            cont:{
                arrUsuarios
            }
        })

    }
    else
    {
        return res.status(400).json({
            ok:false,
            msg:'No se encontraron usuarios',
            cont:{
                arrUsuarios
            }
        })
    }
   
    //return res.download(rutaDescarga,'documento.html')
})

app.get('/obtenerUsuario',(req,res)=>{

const _idUsuario=parseInt(req.query._idUsuario);
if(!_idUsuario){
    return res.status(400).json({
        ok:false,
        msg:'No se recibio ningun ID',
        cont:{
            _idUsuario
        }
    })
}
const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
if(!encontroUsuario){
    return res.status(400).json({
        ok:false,
        msg:'El usuario no existe',
        cont:{
            encontroUsuario
        }
    })
}

return res.status(200).json({
    ok:true,
    msg:'El usuario se encontro exitosamente',
    cont:{
        encontroUsuario
    }
})



})

app.post('/',(req,res)=> {
    const body= {
        strNombre: req.body.strNombre,
        strApellido: req.body.strApellido,
        strEmail: req.body.strEmail,
        _id: Number(req.body._id)
    }
  if(body.strNombre && body.strApellido && body.strEmail && body._id)
  {
const encontroUsuario =  arrJsnUsuarios.find(usuario=> usuario._id == body._id)
 if(encontroUsuario){
    res.status(400).json({
        ok:false,
        msg:'El usuario ya se encuentra registrado',
        cont:
        {
            encontroUsuario
        }
    })
 }
 else {

    arrJsnUsuarios.push(body)
    res.status(200).json({
        ok:true,
        msg:'Se registro el usuario de manera correcta',
        cont:
        {
            arrJsnUsuarios
        }
    })
  }
}
  else
  {
    res.status(400).json({
        ok:false,
        msg:'No se recibio alguno o todos los valores requeridos',
        cont:
        {
            body
        }
    })
  }
   
})

app.put('/', (req,res)=>{
    const _idUsuario = parseInt(req.query._idUsuario)
    
    if(_idUsuario){
        const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
        if(encontroUsuario){
            const actrualizarUsuario = {_id: _idUsuario, strNombre:req.body.strNombre, strApellido:req.body.strApellido, strEmail:req.body.strEmail}
               
               const filtrarUsuario=arrJsnUsuarios.filter(usuario => usuario._id !=_idUsuario)
               
               arrJsnUsuarios = filtrarUsuario;
               arrJsnUsuarios.push(actrualizarUsuario)
               return res.status(200).json({
                   ok:true,
                   msg:'El usuario se actualizo de manera exitosa',
                   cont:{
                       actrualizarUsuario
                   }
               })
        }
        else{
            return res.status(400).json({
                ok:false,
                msg: `El usuario con el _id: ${_idUsuario}, no se encuentra registrado en la base de datos`,
                cont:{
                    _idUsuario
                }
            })
        }

    }else{
        return res.status(400).json({
            ok:false,
            msg:'El identificador no existe',
            cont:{
                _idUsuario
            }
        })
    }
})

app.delete('/',(req,res)=>{
    const _idUsuario = parseInt( req.query._idUsuario);
    if(!_idUsuario){
         return res.status(400).json({
            ok:false,
            msg:'No se recibio un identificador de usuario',
            cont:{
                _idUsuario
            }
        })
    }
    const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario);
    if(!encontroUsuario){
        return res.status(400).json({
            ok:false,
            msg:`No se encontro un usuario con el _id: ${_idUsuario} en la base de datos`,
            cont:{
                _idUsuario
            }
        })
    }
    const usuariofiltrado = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario);
    arrJsnUsuarios=usuariofiltrado;
    return res.status(200).json({
        ok:true,
        msg:'Se elimino el usuario de manera exitosa',
        cont:{
            encontroUsuario
        }
    })
})

module.exports=app;