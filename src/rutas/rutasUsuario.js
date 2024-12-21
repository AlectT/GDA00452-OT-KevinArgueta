import { Router } from 'express';
import {
	obtenerUsuarios,
	agregarUsuario,
	actualizarUsuario,
	eliminarUsuario,
	obtenerUsuarioID,
	obtenerHistorialCarrito,
} from '../controladores/controladorUsuario.js';

const routerUsuario = Router();

// Rutas de operador
routerUsuario.get('/obtenerUsuarios', (req, res) => {
	if (req.rol === 'O') {
		obtenerUsuarios(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerUsuario.post('/agregarUsuario', (req, res) => {
	if (req.rol === 'O') {
		agregarUsuario(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerUsuario.patch('/eliminarUsuario/:id', (req, res) => {
	if (req.rol === 'O') {
		eliminarUsuario(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

// Rutas de clientes y operadores
routerUsuario.get('/obtenerUsuarioID/:id', (req, res) => {
	if (req.rol) {
		obtenerUsuarioID(req, res);
	}
});

routerUsuario.put('/actualizarUsuario/:id', (req, res) => {
	if (req.rol) {
		actualizarUsuario(req, res);
	}
});

routerUsuario.get('/obtenerHistorialCarrito/:id', (req, res) => {
	if (req.rol) {
		obtenerHistorialCarrito(req, res);
	}
});

export default routerUsuario;
