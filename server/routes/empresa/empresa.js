const express = require('express');
const app = express.Router();
const EmpresaModel = require('../../models/empresa/empresa.model');
//Metodo Get

app.get('/', async (req,res)=>{
    try{
        const blnEstado = req.query.blnEstado =="false" ? false: true;
        const obtenerEmpresa = await EmpresaModel.find({blnEstado:blnEstado});
        if(obtenerEmpresa ==0)
        {   
            return res.status(400).json({
                ok:false,
                msg:'No se encontraron empresas en la base de datos',
                cont:{
                    obtenerEmpresa
                }
            })
        }
        return res.status(200).json({
            ok:true,
            msg:'Se obtuvieron las empresas de manera exitosa',
            cont:{
             obtenerEmpresa
            }
        })
    }

    catch(error)
    {
        return res.status(400).json({
            ok: false,
            msg:'Error en el servidor',
            cont:{
                error
            }
        })
    }
})

app.post('/' , async (req,res)=>{
try
{
const body = req.body;
const empresaBody = new EmpresaModel(body);
const err = empresaBody.validateSync();
if(err)
{
    return res.status(400).json({
        ok:false,
        msg:'No se recibio uno o más campos, favor de valiudar',
        cont:{
            err
        }
    })
}
const encontroEmpresa = await EmpresaModel.findOne({strNombre: body.strNombre},{strNombre:1});
if(encontroEmpresa)
{
    return res.status(400).json({
        ok:false,
        msg:'La empresa ya se encuentra registrada en la base de datos',
        cont:{
            encontroEmpresa
        }
    })
}

const empresaRegistrada = await empresaBody.save();
return res.status(200).json({
    ok:true,
    msg:'La empresa se registro de manera exitosa',
    cont:{
        empresaRegistrada
    }
})
}catch(error)
{

}

})

app.put('/', async (req,res)=>{
    try {
        const _idEmpresa = req.query._idEmpresa;
        if(!_idEmpresa || _idEmpresa.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idEmpresa ? 'El identificador no es valido' : 'No se recibio el identificador',
                cont:{
                    _idEmpresa
                }
            })
        }
        const encontroEmpresa = await EmpresaModel.findOne({_id: _idEmpresa, blnEstado:true});
        if(!encontroEmpresa)
        {
            return res.status(400).json({
                ok: false,
                msg: 'La empresa no se encuentra registrada',
                cont:{
                    encontroEmpresa
                }
            })
        }
        
        const encontroNombreEmpresa = await EmpresaModel.findOne({strNombre: req.body.strNombre, _id:{$ne:_idEmpresa}},{strNombre:1});
        if(encontroNombreEmpresa)
        {
            return res.status(400).json({
                ok:false,
                msg:'El nombre de la empresa ya se encuentra registrado',
                cont:{
                    encontroNombreEmpresa
                }
            })
        }
            //const actualizarProducto = await ProductoModel.updateOne({_id: _idProducto},{$set:{...req.body}});
            const actualizarEmpresa = await EmpresaModel.findByIdAndUpdate( _idEmpresa,{$set:{...req.body}},{new:true});
        
            
            if(!actualizarEmpresa)
            {
                return res.status(400).json({
                    ok: false,
                    msg:'La empresa no se logro actualizar',
                    cont:{
                        ...req.body
                    }
                })
            }
            return res.status(200).json({
                ok:true,
                msg:'La empresa se actualizo de manera exitosa',
                cont:{
                    empresaAnterior: encontroEmpresa,
                    empresaActual: actualizarEmpresa
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
    try{
        const _idEmpresa = req.query._idEmpresa;
    if(!_idEmpresa || _idEmpresa.length != 24)
    {
        return res.status(400).json({
            ok: false,
            msg: _idEmpresa ? 'El identificador  es invalido' : 'No se recibio un identificador',
            cont:{
                _idEmpresa
            }
        })
    }
    const encontroEmpresa = await EmpresaModel.findOne({_id:_idEmpresa, blnEstado: true}); 
    
    if(!encontroEmpresa)
    {
        return res.status(400).json({
            ok:false,
            msg:'El identificado de la empresa no se encuentra en a la base de datos',
            cont:{
                _idEmpresa: _idEmpresa
            }
        })
    }
    //const eliminarProducto = await ProductoModel.findOneAndDelete({_id: _idProducto});
    const desactivarEmpresa = await EmpresaModel.findOneAndUpdate({_id: _idEmpresa}, {$set: {blnEstado:false}},{new:true})
    if(!desactivarEmpresa){
        return res.status(400).json({
            ok:true,
            msg:'La empresa no se logro desactivar de la base de datos',
            cont:{
                desactivarEmpresa
            }

        })
    }
        return res.status(200).json({
            ok:true,
            msg:'La empresa se desactivo de manera exitosa',
            cont:{
                desactivarEmpresa
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

module.exports=app; 