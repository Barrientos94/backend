const express = require('express');
const apiModel = require('../../models/permisos/api.model');
const app = express.Router();



app.post('/', async (req,res)=>{
    try{
        const body = req.body;
        const bodyApi = new apiModel(body);
        const err = bodyApi.validateSync(); 
        if(err) return res.status(400).json({ok:false, msg:'Uno o más campos no se registraron, favor de ingresarlos',cont:{err}})
        console.log(bodyApi);
        if(!(bodyApi.strMetodo == 'GET' || bodyApi.strMetodo == 'POST' || bodyApi.strMetodo == 'PUT' || bodyApi.strMetodo == 'DELETE'))
        {
        return res.status(400).json({
            ok:false,
            msg:'El strMetodo no es valido',
            cont:{
                metodosPermitidos:['GET', 'POST', 'PUT','DELET']
            }
        })
    }
    const encontroApi = await apiModel.findOne({strRuta: bodyApi.strRuta})
    if(encontroApi)
    {
        return res.status(400).json({
            ok:false,
            msg:'La api ya se encuentra registrada',
            cont:{ encontroApi}
        })
    }
    const registroApi= await bodyApi.save();
    return res.status(400).json({
        ok:true,
        msg:'La Api se registro de manera exitosa',
        cont:{
            registroApi
        }
    })
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

module.exports= app;