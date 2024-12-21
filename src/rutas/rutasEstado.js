import { Router } from 'express';
import {
	obtenerEstados,
	agregarEstado,
	actualizarEstado,
	obtenerEstadoID,
} from '../controladores/controladorEstado.js';

const routerEstado = Router();

// Rutas de operador
routerEstado.get('/obtenerEstados', (req, res) => {
	if (req.rol === 'O') {
		obtenerEstados(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

routerEstado.post('/agregarEstado', (req, res) => {
	if (req.rol === 'O') {
		agregarEstado(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

routerEstado.put('/actualizarEstado/:id', (req, res) => {
	if (req.rol === 'O') {
		actualizarEstado(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

routerEstado.get('/obtenerEstadoID/:id', (req, res) => {
	if (req.rol === 'O') {
		obtenerEstadoID(req, res);
	} else {
		return res.status(401).send('No tiene permisos de Operador');
	}
});

export default routerEstado;
