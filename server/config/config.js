process.env.PORT=process.env.PORT || 3000;

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB="mongodb+srv://ernestobarrientos94:Verde1imua@cluster0.cgxcg.mongodb.net/sigmaInventario?retryWrites=true&w=majority"
}
else{
    urlDB="mongodb+srv://ernestobarrientos94:Verde1imua@cluster0.cgxcg.mongodb.net/sigmaInventario?retryWrites=true&w=majority"
}

process.env.urlDB = urlDB;

process.env.SEED = process.env.SEED || 'Firma-Secreta'

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '5m'