const express = require('express');
const app = express.Router();
const rolModel = require('../../models/permisos/rol.model');



app.get('/',async (req,res)=>{
    try
    {
        const blnEstado = req.query.blnEstado == "false" ? false : true;
        const obtenerRol = await rolModel.aggregate([

            {
                $match: {blnEstado: blnEstado}
            }
        ])




    }catch(error)
    {
        return res.status(400).json({
            ok:false, msg:'Error del servidor',
            cont:{
                error
            }
        })
    }
})

app.post('/', async (req,res)=>{
    try{
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
    }catch(error)
    {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    err: err.message ? err.message : err.name ? err.name : err
                }
            })
    }
    
    

})




module.exports= app;