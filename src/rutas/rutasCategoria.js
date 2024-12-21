import { Router } from 'express';
import {
	obtenerCategorias,
	agregarCategoria,
	actualizarCategoria,
	eliminarCategoria,
	obtenerCategoriaID,
} from '../controladores/controladorCategoria.js';

const routerCategoria = Router();

// Rutas de operador
routerCategoria.post('/agregarCategoria', (req, res) => {
	if (req.rol === 'O') {
		agregarCategoria(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerCategoria.put('/actualizarCategoria/:id', (req, res) => {
	if (req.rol === 'O') {
		actualizarCategoria(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerCategoria.patch('/eliminarCategoria/:id', (req, res) => {
	if (req.rol === 'O') {
		eliminarCategoria(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

// Rutas de clientes y operadores
routerCategoria.get('/obtenerCategorias', (req, res) => {
	if (req.rol) {
		obtenerCategorias(req, res);
	}
});

routerCategoria.get('/obtenerCategoriaID/:id', (req, res) => {
	if (req.rol) {
		obtenerCategoriaID(req, res);
	}
});

export default routerCategoria;
