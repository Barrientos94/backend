const express = require('express');
const fileUpload=require('express-fileupload');
const app = express();
const uniqid = require('uniqid');
const path = require('path');
app.use(fileUpload);

const subirArchivo = async (file,routes,exts)=>{
    try{
        if(!file){
            throw new Error('No se recibio un archivo valido');
        }
        if(!exts.includes(file.mimetype)){
            throw new Error(`Solo las extensiones (${exts.join(',')}) son aceptadas`)      
        }
        let nameImg = uniqid() + path.extname(file.name)
        
        await file.mv(path.resolve(__dirname,`../../upload/${routes}/${nameImg}`)).catch(error =>{
            throw new Error('Error al tratar de subir un archivo al servidor');
        })

       return nameImg;

    }catch(error){
        return error;
    }
   
}

module.exports={subirArchivo}