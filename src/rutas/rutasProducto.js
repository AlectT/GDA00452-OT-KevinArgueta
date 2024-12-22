import { Router } from 'express';
import {
	obtenerProductos,
	agregarProducto,
	actualizarProducto,
	eliminarProducto,
	obtenerProductoID,
	buscarProductoNombre,
	actualizarStock,
} from '../controladores/controladorProducto.js';

const routerProducto = Router();

// Rutas de operador
routerProducto.post('/agregarProducto', (req, res) => {
	if (req.rol === 'O') {
		agregarProducto(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerProducto.put('/actualizarProducto/:id', (req, res) => {
	if (req.rol === 'O') {
		actualizarProducto(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerProducto.patch('/eliminarProducto/:id', (req, res) => {
	if (req.rol === 'O') {
		eliminarProducto(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

routerProducto.put('/actualizarStock', (req, res) => {
	if (req.rol === 'O') {
		actualizarStock(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

// Rutas de clientes y operadores
routerProducto.get('/obtenerProductos', (req, res) => {
	if (req.rol) {
		obtenerProductos(req, res);
	}
});

routerProducto.get('/obtenerProductoID/:id', (req, res) => {
	if (req.rol) {
		obtenerProductoID(req, res);
	}
});

routerProducto.get('/buscarProductoNombre', (req, res) => {
	if (req.rol) {
		buscarProductoNombre(req, res);
	}
});

export default routerProducto;
