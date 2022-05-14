const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express.Router();


app.get('/:ruta/:nameImg',(req,res)=>{
    const ruta = req.params.ruta;
    const nameImg = req.params.nameImg;
    const rutaImgen = path.resolve(__dirname,`../../../upload/${ruta}/${nameImg}`)
    const noImage = path.resolve(__dirname,'../../assets/no-image-Basic.png')
     if(fs.existsSync(rutaImgen)){
         return res.sendFile(rutaImgen)
     }
     else{
        return res.sendFile(noImage);
     }

})



module.exports = app;