import { Router } from 'express';
import {
	obtenerClientes,
	agregarCliente,
	actualizarCliente,
	obtenerClienteID,
} from '../controladores/controladorCliente.js';

const routerCliente = Router();

// Rutas de operador
routerCliente.get('/obtenerClientes', (req, res) => {
	if (req.rol === 'O') {
		obtenerClientes(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerCliente.post('/agregarCliente', (req, res) => {
	if (req.rol === 'O') {
		agregarCliente(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

// Rutas de clientes y operadores
routerCliente.put('/actualizarCliente/:id', (req, res) => {
	if (req.rol) {
		actualizarCliente(req, res);
	}
});

routerCliente.get('/obtenerClienteID/:id', (req, res) => {
	if (req.rol) {
		obtenerClienteID(req, res);
	}
});

export default routerCliente;
