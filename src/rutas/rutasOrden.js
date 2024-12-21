import { Router } from 'express';
import {
	obtenerOrdenes,
	agregarOrden,
	actualizarOrden,
	cambiarEstadoOrden,
	obtenerOrdenID,
	obtenerCarrito,
	obtenerCarritoActual,
	obtenerCarritoDetallado,
	limpiarCarrito,
} from '../controladores/controladorOrden.js';

const routerOrden = Router();

// Rutas de operador
routerOrden.get('/obtenerOrdenes', (req, res) => {
	if (req.rol === 'O') {
		obtenerOrdenes(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

// Rutas de clientes y operadores
routerOrden.post('/agregarOrden', (req, res) => {
	if (req.rol) {
		agregarOrden(req, res);
	}
});

routerOrden.put('/actualizarOrden/:id', (req, res) => {
	if (req.rol) {
		actualizarOrden(req, res);
	}
});

routerOrden.patch('/cambiarEstadoOrden/:id', (req, res) => {
	if (req.rol) {
		cambiarEstadoOrden(req, res);
	}
});

routerOrden.get('/obtenerOrdenID/:id', (req, res) => {
	if (req.rol) {
		obtenerOrdenID(req, res);
	}
});

routerOrden.get('/obtenerCarrito/:id', (req, res) => {
	if (req.rol) {
		obtenerCarrito(req, res);
	}
});

routerOrden.get('/obtenerCarritoActual/:id', (req, res) => {
	if (req.rol) {
		obtenerCarritoActual(req, res);
	}
});

routerOrden.get('/obtenerCarritoDetallado/:id', (req, res) => {
	if (req.rol) {
		obtenerCarritoDetallado(req, res);
	}
});

routerOrden.put('/limpiarCarrito/:id', (req, res) => {
	if (req.rol) {
		limpiarCarrito(req, res);
	}
});

export default routerOrden;
