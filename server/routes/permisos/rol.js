const express = require('express');
const rolModel = require('../../models/permisos/api.model');
const app = express.Router();

app.post('/', async (req,res)=>{
    
    const  body=req.body;
    const bodyRol = new rolModel(body);
    const err = bodyRol.validateSync();
    if(err) return res.status(400).json({ok:false, msg:'Uno o más campos no se registraron, favor de ingresarlos',cont:{err}})
    if(!bodyRol.arrObjIdApis)
    {
        return res.status(400).json({
            ok: false,
            mgs:'Uno o más campos no se registraron, favor de ingresarls',
            cont:{
                arrObjIdApis:null
            }
        })
    }
    const encontroRol = await rolModel.findOne({strNombre: bodyRol.strNombre},{strNombre:1})

    if(encontroRol)
    {
        return res.status(400).json({
            ok:false,
            msg:'El rol ya se encuentra registrado',
            cont:{
                encontroRol
            }
        })
    }
    const registroRol = await bodyRol.save();
    return res.status(200).json({
        ok:true,
        msg:'El rol se registro de manera exitosa',
        cont:{
            registroRol
        }
    })

})




module.exports= app;