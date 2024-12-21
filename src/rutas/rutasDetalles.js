import { Router } from 'express';
import {
	obtenerDetalles,
	agregarDetalles,
	actualizarDetalles,
	obtenerDetallesID,
	eliminarOrdenDetalles,
} from '../controladores/controladorDetalles.js';

const routerDetalles = Router();

// Rutas de operadores
routerDetalles.get('/obtenerDetalles', (req, res) => {
	if (req.rol === 'O') {
		obtenerDetalles(req, res);
	} else {
		return res.status(401).send('No tienes permisos operador');
	}
});

// Rutas de clientes y operadores
routerDetalles.post('/agregarDetalles', (req, res) => {
	if (req.rol) {
		agregarDetalles(req, res);
	}
});

routerDetalles.put('/actualizarDetalles/:id', (req, res) => {
	if (req.rol) {
		actualizarDetalles(req, res);
	}
});

routerDetalles.delete('/eliminarOrdenDetalles/:id', (req, res) => {
	if (req.rol) {
		eliminarOrdenDetalles(req, res);
	}
});

routerDetalles.get('/obtenerDetallesID/:id', (req, res) => {
	if (req.rol) {
		obtenerDetallesID(req, res);
	}
});

export default routerDetalles;
