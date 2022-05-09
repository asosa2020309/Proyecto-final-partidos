const express = require('express');

const controladorEquipo=require('../controllers/equipos.controller')
//middlewares

const md_autenticacion = require('../middlewares/autentication');
const md_rol = require('../middlewares/roles');

const api = express.Router();
api.post('/agregarEquipo/:idUsuario?', md_autenticacion.Auth,controladorEquipo.nuevoEquipo);
api.put('/editarEquipo/:nombre/:idUsuario?',md_autenticacion.Auth,controladorEquipo.actualizarEquipo);
api.delete('/eliminarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, controladorEquipo.borrarEquipo);
module.exports = api;