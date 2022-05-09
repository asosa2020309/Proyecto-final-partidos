const mongoose = require('mongoose');
const app = require('./app');
const {RegistrarAdminDefault} = require('./src/controllers/usuario.controller')


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ControlLigas',{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{

    console.log('Ya se encuentra conectado a la base de datos');

    app.listen(3000, function(){
        console.log('Conectado correctamente al puerto 3000');
    })
}).catch(err => console.log(err));


RegistrarAdminDefault();