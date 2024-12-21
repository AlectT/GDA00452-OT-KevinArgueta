import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';

const obtenerEstados = async (req, res) => {
	try {
		const estados = await sequelize.query('select * from vEstado', {
			type: QueryTypes.SELECT,
		});
		res.status(200).send(estados);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const agregarEstado = async (req, res) => {
	try {
		const data = req.body;

		await sequelize.query('exec pCrearEstado @nombre = :nombre', {
			replacements: {
				nombre: data.nombre,
			},
			type: QueryTypes.INSERT,
		});

		res.status(201).send('Agregado exitosamente');
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const actualizarEstado = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;
		await sequelize.query('exec pActualizarEstado @estado = :estado, @nombre = :nombre', {
			replacements: {
				estado: Number(id),
				nombre: data.nombre,
			},
			type: QueryTypes.PUT,
		});
		res.status(201).send('Actualizado exitosamente');
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const obtenerEstadoID = async (req, res) => {
	try {
		const { id } = req.params;
		const estado = await sequelize.query('exec pEstadoID @estado = :estado;', {
			replacements: {
				estado: Number(id),
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(estado);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

export { obtenerEstados, agregarEstado, actualizarEstado, obtenerEstadoID };
