const Equipo = require('../models/equipos.model');
const Liga = require('../models/liga.model');

function nuevoEquipo(req,res){
    var parametros = req.body;
    var modelEquipo = new Equipo();
    var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500)
            .send({mensaje: "envie el usuario",});
        }
        idUsuario = req.params.idUsuario;
    }

    Equipo.findOne({idUsuario: idUsuario, nombre: parametros.nombre},(err, equipoEncontrado) => {
        if(equipoEncontrado){
            res.status(500)
                    .send({ error : "El equipo ya fue creado"})

        } else{
            if(parametros.liga==null)    return res
            .status(500)
            .send({ mensaje: "Ingrese el nombre de la liga a la cueal quiere ingresar el equipo" });
    
            Liga.findOne({nombre: parametros.liga},(err,ligaEncontrada) => {
                if(ligaEncontrada==null){
                    res.status(500)
                        .send({ error : "No esxiste una liga a la cual se pueda agregar algún equipo"})
                } else{
                    Equipo.find({idLiga: ligaEncontrada._id},(err, equiposEncontrados) => {
                        if(equiposEncontrados.length < 10){
                            if(parametros.nombre){
                                modelEquipo.nombre = parametros.nombre
                                modelEquipo.golesFavor = 0;
                                modelEquipo.golesContra = 0;
                                modelEquipo.diferenciaGoles = 0;
                                modelEquipo.partidosJugados = 0;
                                modelEquipo.puntos = 0;
                                modelEquipo.idUsuario = idUsuario;
                                modelEquipo.idLiga = ligaEncontrada._id;
                
                                modelEquipo.save((err, equipoCreado)=>{
                                    if (err) return res.status(500)
                                        .send({ mensaje: "Error en la peticion" });
                                    if (!equipoCreado)
                                        return res.status(500)
                                        .send({ mensaje: "Error intentar crear el equipo" });
                                    return res.status(200)
                                        .send({ equipo: equipoCreado });
                                })
                          
                            }else {
                                return res
                                    .status(500)
                                    .send({ mensaje: "El equipo debe de tener un nombre" });
                            }
                        }else{
                            return res
                            .status(500)
                            .send({ mensaje: "limite de equipos alcanzados para esta liga" });
                        }
                    })
                }
    
            })
        }
    })


} 





function borrarEquipo (req,res){
    var idUsuario;
    nombreEquipo= req.params.nombre
    if(req.params.nombre==null) return res.status(500)
            .send({error: "Necesita ingresar el nombre del equipo que será borrado UnU"})

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }
    Equipo.findOneAndDelete({nombre:req.params.nombre, idUsuario: idUsuario}, {nombre:req.body.nombre}, (err, equipoEditado) => {
        if (equipoEditado == null)
        return res.status(500)  
        .send({ error: "No fue localizado el equipo" });
    if (err) return res.status(500)
        .send({ mensaje: "Error en la peticion" });


    return res.status(200)
        .send({ equipo: equipoEditado });
    })





}

function actualizarEquipo(req,res){
    var parametros =req.body;
    var nombreEquipo= req.params.nombre;

    if(nombreEquipo==null) return res.status(500)
                .send({error: "Ingrese el nombre del equipo a acutulizar"})

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "envie el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }


    Equipo.findOne({ nombre:parametros.nombre, idUsuario: idUsuario},(err, equipoRepetido) => {
        if(equipoRepetido){
            return res.status(500).send({ error: "El nombre ya se encuentra en uso use otro va brother, yeyo :D" });
        }else{
            Equipo.findOneAndUpdate({nombre:nombreEquipo,}, (parametros),{new:true}, (err, equipoEditado) => {
                if (equipoEditado == null)
                return res.status(500)
                    .send({ error: "El equipo no fue encontrado UnU" });
            if (err) return res.status(500)
                        .send({ mensaje: "Error en la peticion" });


            return res.status(200)
                    .send({ equipo: equipoEditado });
            })
        }
    })

}


module.exports ={
    nuevoEquipo,
    actualizarEquipo,
    borrarEquipo
}