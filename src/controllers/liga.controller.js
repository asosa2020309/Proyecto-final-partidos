const Liga = require('../models/liga.model');


function NueaLiga(req,res){
    var parametros = req.body;
    var idUser= req.params.idUsuario;
    var modelLiga = new Liga();

    if (req.user.rol =='Usuario'){

        Liga.findOne({idUsuario : req.user.sub, nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500)
                    .send({message:'error en la peticion'});
            if(LigaEncontrada){
                return res.status(500)
                        .send({mensaje:'Esta liga ya existe, yeyo'});

            }
            modelLiga.nombre = parametros.nombre;
            modelLiga.idUsuario = req.user.sub;
            modelLiga.save((err,ligaGuardada)=>{

                if(err) return res.status(500)
                            .send({mensaje:'errpr en la 2da petición'});
                if(ligaGuardada){
                        return res.status(200)
                                .send({liga:ligaGuardada})
                }else{
                    return res.status(500)
                                    .send({mensaje:'Hubo en error al intentar crear una liga'})
                }
            })


        })
    
        


    }else if (req.user.rol=='ADMIN'){
        if(idUser==null){
            return res.status(500)
                .send({mensaje:'Admin debes mandar el id de algún usuario :D'})
        }

        Liga.findOne({idUsuario : idUser, nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500)
                .send({message:'error en la peticion'});
            if(LigaEncontrada.nombre){
                return res.status(500)
                .send({mensaje:'Esta liga ua existe UnU'});

            }
            modelLiga.nombre = parametros.nombre;
            modelLiga.idUsuario = idUser;
            modelLiga.save((err,ligaGuardada)=>{

                if(err) return res.status(500)
                            .send({mensaje:'error ne la peticion 2'});
                if(ligaGuardada){
                        return res.status(200)
                                .send({liga:ligaGuardada})
                }else{
                    return res.status(500)
                                    .send({mensaje:'Hub un error al intentar crear esta liga'})
                }
            })


        })
    }   


    


}

function conseguirLiga(req,res){

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500)
                    .send({mensaje:"envie el usuario",});
        }
        idUsuario = req.params.idUsuario;
    }
// parte importante para poder obtener una liga
    Liga.find({ idUsuario: idUsuario }, (err, ligasEncontradas) => {
        if (err) return res.status(500)
                .send({ mensaje: "Error en la peticion" });
        if (ligasEncontradas == null)
            return res.status(500)
                    .send({ eror: "No se pudieron conseguir las ligas que querias :(" });
        if (ligasEncontradas.length == 0)
            return res.status(500)
                        .send({ eror: "No tienes ninguna liga" });

        return res.status(200)
                            .send({ ligas: ligasEncontradas });
    });
}


function tronarLiga(req,res) {

    if(req.params.nombre==null) 
    return res.status(500)
                .send({mensaje: "Debe ingresar el nombre de la Liga que desea tronarse jijijijij"})


      var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500)
                    .send({mensaje: "envie el usuario",});
        }
    }

//solo la marqué porque me cuesta encontrarla XXD
    Liga.findOneAndDelete(
        { nombre: req.params.nombre,},
        (err, ligaEliminada) => {
            if (ligaEliminada == null)
                return res.status(500)
                        .send({ error: "no se encontró la liga" });
            if (err) return res.status(500)
                            .send({ mensaje: "Error en la peticion" });

            return res.status(200)
                                .send({ liga: ligaEliminada });
        }
    );
   
   
 
}


function actualizarLiga(req,res){
    var parametros = req.body;
    var idUser= req.params.idUsuario;
   

    if (req.user.rol =='Usuario'){

       Liga.findOne({ nombre: parametros.nombre},(err,LigaEncontrada)=>{
        if(err) return res.status(500)
                    .send({message:'error en la peticion'});
        if(LigaEncontrada){
            return res.status(500)
                        .send({mensaje:'Ya existe una liga co ese nombre, Elige otro xfa :D'});

        }else{

            Liga.findOne({idUsuario: req.user.sub},(err,ligaEncontrada1)=>{
                if(err) return res.status(500)
                            .send({message:'error en la peticion'});
                if(ligaEncontrada1){

                    Liga.findOneAndUpdate({idUsuario :ligaEncontrada1.idUsuario},parametros,{ new: true},(err,ligaActualizada)=>{
                        if(err) return res.status(500)
                                .send({message:'error en la peticion x2'});
                        if(ligaActualizada){
                                return res.status(200)
                                        .send({liga:ligaActualizada})
                        }else{
                            return res.status(500)
                                            .send({mensaje:'huno un error al inentar actualizar esta liga'})
                        }
            
                       })
                }else{
                    return res.status(500)
                            .send({mensaje:'No se pudo encontrar la liga'})
                }
            })
     
         
        }



       })
        


    }else if (req.user.rol=='ADMIN'){
        if(idUser==null){
            return res.status(500)
                    .send({mensaje:'Admion debes mandar el id de algún usuario :D'})
        }

        Liga.findOne({ nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500)
                .send({message:'error en la peticion'});
            if(LigaEncontrada){
                return res.status(500)
                    .send({mensaje:'Este nombre ya se encuentra en uso, debe escoger otro >:D '});
    
            }else{
                //parte de actualizar
                Liga.findByIdAndUpdate(idUser,parametros,{ new: true},
                    (err,LigaEditada)=>{
                        if(err) return res.status(500)
                                .send({message:'error en la peticion'});
                        if(LigaEditada){
                            return res.status(200)
                                    .send({liga:LigaEditada})
                        }else{
                            return res.status(500)
                                        .send({mensaje:'error al intentar actualizar la liga seleccionada unu'})
                        }
                    })
            }
    
    
    
           })
            
    
    }   


    

} 





module.exports ={
    NueaLiga,
    actualizarLiga,
    tronarLiga,
    conseguirLiga
}
