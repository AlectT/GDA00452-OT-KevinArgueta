import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';

const obtenerCategorias = async (req, res) => {
	try {
		const categorias = await sequelize.query('select * from vCategoriaProductos', {
			type: QueryTypes.SELECT,
		});
		res.status(200).send(categorias);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const agregarCategoria = async (req, res) => {
	try {
		const data = req.body;
		const date = new Date().toISOString();

		await sequelize.query(
			'exec pCrearCategoriaP @usuario = :usuario, @nombre = :nombre, @estado = :estado, @fecha_creacion = :fechaCreacion;',
			{
				replacements: {
					usuario: data.usuario,
					nombre: data.nombre,
					estado: 3,
					fechaCreacion: date,
				},
				type: QueryTypes.INSERT,
			},
		);

		res.status(201).send('Agregado exitosamente');
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const actualizarCategoria = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;
		await sequelize.query(
			'exec pActualizarCategoria @categoria = :categoria, @nombre = :nombre;',
			{
				replacements: {
					categoria: Number(id),
					nombre: data.nombre,
				},
				type: QueryTypes.PUT,
			},
		);
		res.status(201).send('Actualizado exitosamente');
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const eliminarCategoria = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;

		if (data.estado === 3 || data.estado === 4) {
			await sequelize.query(
				'exec pCambiarEstadoCategoria @categoria = :categoria, @estado = :estado;',
				{
					replacements: {
						categoria: Number(id),
						estado: data.estado,
					},
					type: QueryTypes.PATCH,
				},
			);
			res.status(201).send('Actualizado exitosamente');
		} else {
			res.status(400).send('El estado es invalido');
		}
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const obtenerCategoriaID = async (req, res) => {
	try {
		const { id } = req.params;
		const categoria = await sequelize.query(
			'exec pCategoriaProductosID @categoria = :categoria;',
			{
				replacements: {
					categoria: Number(id),
				},
				type: QueryTypes.SELECT,
			},
		);
		res.status(200).send(categoria);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

export {
	obtenerCategorias,
	agregarCategoria,
	actualizarCategoria,
	eliminarCategoria,
	obtenerCategoriaID,
};
