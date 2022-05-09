const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function RegistrarAdminDefault(){
    var usuarioModel =  new Usuario();
    usuarioModel.usuario = 'ADMIN';
    usuarioModel.password = '123456';
    usuarioModel.rol= 'ADMIN';

    Usuario.find({usuario:'ADMIN'},(err,UsuarioEncontrado)=>{
        if(UsuarioEncontrado.length==0){
            bcrypt.hash('123456',null,null,(err,passwordEncriptada)=>{
                usuarioModel.password = passwordEncriptada;
                usuarioModel.save((err, UsuarioGuardada)=>{

                    if(err) return console.log('error en la peticion')
                     if(UsuarioGuardada){
                        
                        console.log('admin correctamente creado :D');
                     }else{
                         console.log('No se logró crear al admin :( ')
                     }
                });


            })

        }else{
            return console.log('ADMIN se encuentra registrado UnU');
        }

    })




}

function login(req,res){
    var parametros = req.body;
    Usuario.findOne({ usuario: parametros.usuario }, (err, UsuarioEncontrada) => {
        if (err) return res.status(500)
        
                .send({ mensaje: 'Error en la peticion' });
        if (UsuarioEncontrada) {
            bcrypt.compare(parametros.password, UsuarioEncontrada.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken !== 'true') {
                            UsuarioEncontrada.password = undefined;
                            return res.status(200)
                                .send({ empresa: UsuarioEncontrada })
                        } else {

                            return res.status(200)
                                .send({ token: jwt.crearToken(UsuarioEncontrada) })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contraseñas no son las mismas' });
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'El correro no se encuentra registrado' })
        }
    })

}



function RegistrarAdmin(req,res){
    var usuarioModel =  new Usuario();
    var parametros = req.body;
  
        
         usuarioModel.usuario = parametros.usuario;
         usuarioModel.rol = 'ADMIN';
     
 
     Usuario.find({usuario : parametros.usuario},(err,UsuarioEncontrada)=>{
         if(err) return res.status(500)
                .send({message:'error en la peticion'})
         if(UsuarioEncontrada.length == 0){
 
             bcrypt.hash(parametros.password,null,null,(err,passwordEncriptada)=>{
 
                 usuarioModel.password = passwordEncriptada;
 
                 usuarioModel.save((err,UsuarioGuardada)=>{
                     if(err) return res.status(500)
                            .send({message:'error en la peticion'});
 
                 if(UsuarioGuardada){

                     return res.status(200)
                     .send({empresa:UsuarioGuardada})
                 }else{
                     console.log('No pudo ser cerado el usuario')
                 }
 
 
 
                 })
 
             })
         }else{
             return res.status(500)
                    .send({mensaje:'El nombre ya xiste'})
         }
 
 
     })
       
    

  }





function nuevoUsuario(req,res){
    var usuarioModel =  new Usuario();
    var parametros = req.body;
  
        
         usuarioModel.usuario = parametros.usuario;
         usuarioModel.rol = 'Usuario';
     
 
     Usuario.find({usuario : parametros.usuario},(err,UsuarioEncontrada)=>{
         if(err) return res.status(500)
                .send({message:'error en la peticion'})
         if(UsuarioEncontrada.length == 0){
 
             bcrypt.hash(parametros.password,null,null,(err,passwordEncriptada)=>{
 
                 usuarioModel.password = passwordEncriptada;
 
                 usuarioModel.save((err,UsuarioGuardada)=>{
                     if(err) return res.status(500)
                     .send({message:'error en la peticion'});
 
                 if(UsuarioGuardada){

                     return res.status(200)
                        .send({empresa:UsuarioGuardada})
                 }else{
                     console.log('No se consigió crear el usuario D:')
                 }
 
 
 
                 })
 
             })
         }else{
             return res.status(500)
                                .send({mensaje:'El nombre ya existe terco >:('})
         }
 
 
     })
       
 }


 function borrarUsuario (req, res){
    var idUser ;
    var parametros = req.body;


    

    if (req.user.rol=='Usuario'){
        idUser = req.user.sub;
             if (idUser !== req.user.sub )
              return res.status(500)
                                .send({ mensaje: 'No cuentas con permiso para editar usuario UnU' });
              
            Usuario.findByIdAndDelete(idUser,  { new: true },
                (err, empresaActualizada) => {
                if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                    if (!empresaActualizada) return res.status(500)
                                .send({ mensaje: 'No se puede borrar este usuario' });
                            return res.status(200)
                                    .send({ empresa: empresaActualizada })
                        })
    }else if(req.user.rol=='ADMIN') {
            if(req.params.idUsuario==null){
            return res.status(500).send({mensaje:'Admin debes ingresar el id de algún usuario unu'});
              }
        idUser= req.params.idUsuario;
        Usuario.findById(idUser,(err, UsuarioENcontrado)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
            if(UsuarioENcontrado){
                    if(UsuarioENcontrado.rol=='ADMIN'){
                        return res.status(500).send({mensaje:'error usted no puede editar otros a otros ADMINS'});
                    }else{
                        Usuario.findByIdAndDelete(idUser,{ new:true},(err,UsuarioActualizado)=>{
                            if(err) return res.status(500).send({message:'error en la peticion'});
                            if(UsuarioActualizado){
                                return res.status(200).send({usuario: UsuarioActualizado});
                            }else{
                                return res.status(500).send({mesaje:'error al actualizar'})
                            }
                        })
                    }
            }else{
                return res.status(500).send({mensaje:'error al buscar el usuario'})
            }

        })
    }

  }





 function actualizarUsuario(req, res) {
    var idUser ;
    var parametros = req.body;


    

    if (req.user.rol=='Usuario'){
        idUser = req.user.sub;
             if (idUser !== req.user.sub )
              return res.status(500) .send({ mensaje: 'No puede editar otros usuarios' });
            
              //parte importante x2
            Usuario.findByIdAndUpdate(idUser, parametros, { new: true },
                (err, empresaActualizada) => {
                if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
                    if (!empresaActualizada) return res.status(500)
                    .send({ mensaje: 'Error al actualizar el usuario' });
                            return res.status(200)
                        .send({ empresa: empresaActualizada })
                        })
    }else if(req.user.rol=='ADMIN') {
            if(req.params.idUsuario==null){
            return res.status(500)
                            .send({mensaje:'Admin debes ingresar el id de alggun usuario :D'});
              }
        idUser= req.params.idUsuario;
        Usuario.findById(idUser,(err, UsuarioENcontrado)=>{
            if(err) return res.status(500)
                                .send({message:'error en la peticion'});
            if(UsuarioENcontrado){
                //se hace uso de nuevo del Rol administrador
                    if(UsuarioENcontrado.rol=='ADMIN'){
                        return res.status(500)
                                    .send({mensaje:'No puede actualizar/editar otros ADMINISTRADORES ya que no tiene permiso UnU'});
                    }else{
                        Usuario.findByIdAndUpdate(idUser,parametros,{ new:true},(err,UsuarioActualizado)=>{
                            if(err) return res.status(500)
                                        .send({message:'error en la peticion'});
                            if(UsuarioActualizado){
                                return res.status(200)
                                            .send({usuario: UsuarioActualizado});
                            }else{
                                return res.status(500)
                                                .send({mesaje:'error al actualizar el usurio'})
                            }
                        })
                    }
            }else{
                return res.status(500)
                        .send({mensaje:'No se pudo encontrar el usuario owo'})
            }

        })
    }



}




 
 module.exports={
    RegistrarAdminDefault,
    login,
    nuevoUsuario,
    actualizarUsuario,
    borrarUsuario,
    RegistrarAdmin,
}