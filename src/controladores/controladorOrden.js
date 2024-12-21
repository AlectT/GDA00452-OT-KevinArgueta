import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';

const obtenerOrdenes = async (req, res) => {
	try {
		const ordenes = await sequelize.query('select * from vOrden', {
			type: QueryTypes.SELECT,
		});
		res.status(200).send(ordenes);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const agregarOrden = async (req, res) => {
	try {
		const data = req.body;
		const date = new Date().toISOString();

		await sequelize.query(
			'exec pCrearOrden @usuario = :usuario, @estado = :estado, @fecha_creacion = :fechaCreacion, @nombre = :nombre, @direccion = :direccion, @telefono = :telefono, @correo = :correo, @fecha = :fecha, @total = :total;',
			{
				replacements: {
					usuario: data.usuario,
					estado: 7,
					fechaCreacion: date,
					nombre: '',
					direccion: '',
					telefono: '',
					correo: '',
					fecha: '',
					total: 0,
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

const actualizarOrden = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;
		await sequelize.query(
			'exec pActualizarOrden @orden = :orden, @nombre = :nombre, @direccion = :direccion, @telefono = :telefono, @correo = :correo, @fecha = :fecha;',
			{
				replacements: {
					orden: Number(id),
					nombre: data.nombre,
					direccion: data.direccion,
					telefono: data.telefono,
					correo: data.correo,
					fecha: data.fecha,
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

const cambiarEstadoOrden = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;

		if (
			data.estado === 7 ||
			data.estado === 8 ||
			data.estado === 9 ||
			data.estado === 10 ||
			data.estado === 11
		) {
			await sequelize.query('exec pCambiarEstadoOrden @orden = :orden, @estado = :estado;', {
				replacements: {
					orden: Number(id),
					estado: data.estado,
				},
				type: QueryTypes.PATCH,
			});
			res.status(201).send('Actualizado exitosamente');
		} else {
			res.status(400).send('El estado es invalido');
		}
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const obtenerOrdenID = async (req, res) => {
	try {
		const { id } = req.params;
		const orden = await sequelize.query('exec pOrdenID @orden = :orden;', {
			replacements: {
				orden: Number(id),
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(orden);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const obtenerCarrito = async (req, res) => {
	try {
		const { id } = req.params;
		const carrito = await sequelize.query('exec pCarritoClientes @orden = :orden;', {
			replacements: {
				orden: Number(id),
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(carrito);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const obtenerCarritoActual = async (req, res) => {
	try {
		const { id } = req.params;
		await sequelize
			.query('exec pOrdenActual @usuario = :usuario;', {
				replacements: {
					usuario: Number(id),
				},
				type: QueryTypes.SELECT,
			})
			.then(async (orden) => {
				const carritoActual = await sequelize.query('exec pCarritoClientes @orden = :orden;', {
					replacements: {
						orden: Number(orden[0].idOrden),
					},
					type: QueryTypes.SELECT,
				});
				res.status(200).send(carritoActual);
			});
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const obtenerCarritoDetallado = async (req, res) => {
	try {
		const { id } = req.params;
		const carrito = await sequelize.query('exec pCarritoDetallado @orden = :orden;', {
			replacements: {
				orden: Number(id),
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(carrito);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const limpiarCarrito = async (req, res) => {
	try {
		const { id } = req.params;
		await sequelize
			.query('exec pOrdenActual @usuario = :usuario;', {
				replacements: {
					usuario: Number(id),
				},
				type: QueryTypes.SELECT,
			})
			.then((orden) => {
				sequelize
					.query('exec pCarritoClientes @orden = :orden;', {
						replacements: {
							orden: Number(orden[0].idOrden),
						},
						type: QueryTypes.SELECT,
					})
					.then((carrito) => {
						carrito.forEach(async (detalle) => {
							await sequelize
								.query('exec pOrdenDetallesID @ordenDetalle = :ordenDetalle;', {
									replacements: {
										ordenDetalle: Number(detalle.idOrdenDetalles),
									},
									type: QueryTypes.SELECT,
								})
								.then(async (detalles) => {
									// Query para actualizar el stock
									await sequelize
										.query('exec pObtenerStock @producto = :producto;', {
											replacements: {
												producto: Number(detalles[0].idProductos),
											},
											type: QueryTypes.SELECT,
										})
										.then((producto) => {
											// Actualizar stock
											sequelize.query(
												'exec pActualizarStock @producto = :producto, @stock = :stock, @estado = :estado;',
												{
													replacements: {
														producto: Number(detalles[0].idProductos),
														stock: Number(producto[0].stock) + Number(detalles[0].cantidad),
														estado: 1,
													},
													type: QueryTypes.PUT,
												},
											);
										})
										.then(() => {
											//Borrar el detalle
											sequelize.query('exec pEliminarDetalle @detalle = :detalle', {
												replacements: {
													detalle: detalles[0].idOrdenDetalles,
												},
												type: QueryTypes.DELETE,
											});
										});
								});
						});
					})
					.then(() => {
						sequelize.query('exec pActualizarTotalOrden @orden = :orden, @total = :total', {
							replacements: {
								orden: Number(orden[0].idOrden),
								total: 0,
							},
							type: QueryTypes.PUT,
						});
						res.status(201).send('Carrito limpiado');
					});
			});
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

export {
	obtenerOrdenes,
	agregarOrden,
	actualizarOrden,
	cambiarEstadoOrden,
	obtenerOrdenID,
	obtenerCarrito,
	obtenerCarritoActual,
	obtenerCarritoDetallado,
	limpiarCarrito,
};
