import { Router } from 'express';
import {
	obtenerRoles,
	agregarRol,
	actualizarRol,
	obtenerRolID,
} from '../controladores/controladorRol.js';

const routerRol = Router();

// Rutas de operador
routerRol.get('/obtenerRoles', (req, res) => {
	if (req.rol === 'O') {
		obtenerRoles(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

routerRol.post('/agregarRol', (req, res) => {
	if (req.rol === 'O') {
		agregarRol(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

routerRol.put('/actualizarRol/:id', (req, res) => {
	if (req.rol === 'O') {
		actualizarRol(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

routerRol.get('/obtenerRolID/:id', (req, res) => {
	if (req.rol === 'O') {
		obtenerRolID(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

export default routerRol;
