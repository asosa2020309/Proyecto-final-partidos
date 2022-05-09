exports.verEspectador = function(req, res, next){
    if(req.user.rol !=='Usuario') return res.status(403).send({mensaje:'Esta acción la puede realizar unicamente Usuariochan'})

    next();

}
exports.verAdmin = function(req, res, next){
    if (req.user.rol !== 'ADMIN') return res.status(403).send({mensaje:'Esta acción la puede realizar unica mente eladminGOD'})
    next();
} 

