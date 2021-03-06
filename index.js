const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 5001;
const config = require('./config');
if (config.credentials.client_secret === null || config.credentials.client_id === null){
    console.error("Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env." +
        " variables. WTF!!!");
    return
}

const app = express();
// console.log(path.join('client'))
app.use(express.static(path.join('public')));
app.use(express.json({limit:"50mb"}));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));

app.use((err,req,res,next)=>{
    console.error(err);
    res.status(err.statusCode).json(err);
});

app.listen(PORT,()=>console.log(`Server started on port ${PORT}, wtf!`))