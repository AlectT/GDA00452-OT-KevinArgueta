import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';

const obtenerProductos = async (req, res) => {
	try {
		const productos = await sequelize.query('select * from vProductos', {
			type: QueryTypes.SELECT,
		});
		res.status(200).send(productos);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const agregarProducto = async (req, res) => {
	try {
		const data = req.body;
		const date = new Date().toISOString();

		await sequelize.query(
			'exec pCrearProducto @categoria = :categoria, @usuario = :usuario, @estado = :estado, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @precio = :precio, @fecha_creacion = :fechaCreacion, @foto = :foto;',
			{
				replacements: {
					categoria: data.categoria,
					usuario: data.usuario,
					estado: 1,
					nombre: data.nombre,
					marca: data.marca,
					codigo: data.codigo,
					stock: data.stock,
					precio: data.precio,
					fechaCreacion: date,
					foto: data.foto,
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

const actualizarProducto = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;
		await sequelize.query(
			'exec pActualizarProducto @producto = :producto, @categoria = :categoria, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @precio = :precio, @foto = :foto;',
			{
				replacements: {
					producto: Number(id),
					categoria: data.categoria,
					nombre: data.nombre,
					marca: data.marca,
					codigo: data.codigo,
					stock: data.stock,
					precio: data.precio,
					foto: data.foto,
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

const eliminarProducto = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;

		if (data.estado === 1 || data.estado === 2) {
			await sequelize.query(
				'exec pCambiarEstadoProducto @producto = :producto, @estado = :estado;',
				{
					replacements: {
						producto: Number(id),
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

const obtenerProductoID = async (req, res) => {
	try {
		const { id } = req.params;
		const producto = await sequelize.query('exec pProductoID @producto = :producto;', {
			replacements: {
				producto: Number(id),
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(producto);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const buscarProductoNombre = async (req, res) => {
	try {
		const data = req.body;
		const producto = await sequelize.query('exec pBuscarProductoNombre @nombre = :nombre;', {
			replacements: {
				nombre: data.nombre,
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(producto);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const actualizarStock = async (req, res) => {
	try {
		const data = req.body;
		if (data.stock < 0) {
			return res.status(400).send('El stock no puede ser menor a 0');
		} else {
			await sequelize.query(
				'exec pActualizarStock @producto = :producto, @stock = :stock, @estado = :estado;',
				{
					replacements: {
						producto: data.producto,
						stock: data.stock,
						estado: data.estado,
					},
					type: QueryTypes.PUT,
				},
			);
			res.status(201).send('Stock actualizado exitosamente');
		}
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

export {
	obtenerProductos,
	agregarProducto,
	actualizarProducto,
	eliminarProducto,
	obtenerProductoID,
	buscarProductoNombre,
	actualizarStock,
};
