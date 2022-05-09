const express = require('express');

const controladorLiga=require('../controllers/liga.controller')
//middlewares

const md_autenticacion = require('../middlewares/autentication');
const md_rol = require('../middlewares/roles');

const api = express.Router();
api.post('/agregarLiga/:idUsuario?', md_autenticacion.Auth ,controladorLiga.NueaLiga)
api.put('/editarLiga/:idUsuario?', md_autenticacion.Auth,controladorLiga.actualizarLiga)
api.delete('/eliminarLiga/:nombre/:idUsuario?', md_autenticacion.Auth, controladorLiga.tronarLiga)
api.get('/obtenerLigas/:idUsuario?', md_autenticacion.Auth, controladorLiga.conseguirLiga);
module.exports = api;