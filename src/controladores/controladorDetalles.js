import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';

const obtenerDetalles = async (req, res) => {
	try {
		const detalles = await sequelize.query('select * from vOrdenDetalles', {
			type: QueryTypes.SELECT,
		});
		res.status(200).send(detalles);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const agregarDetalles = async (req, res) => {
	try {
		const data = req.body;
		await sequelize
			.query('exec pProductoID @producto = :producto;', {
				replacements: {
					producto: Number(data.producto),
				},
				type: QueryTypes.SELECT,
			})
			.then(async (producto) => {
				//Evitar que la cantidad solicitada sea mayor al stock
				if (data.cantidad > producto[0].stock) {
					return res.status(400).send('La cantidad excede el stock');
				}
				//Definir estado nuevo para el producto
				let estadoNuevo;
				if (Number(data.cantidad) === Number(producto[0].stock)) {
					estadoNuevo = 2;
				} else {
					estadoNuevo = 1;
				}
				//Actualizar stock y estado por si el stock llega a 0
				sequelize
					.query(
						'exec pActualizarStock @producto = :producto, @stock = :stock, @estado = :estado;',
						{
							replacements: {
								producto: Number(data.producto),
								stock: Number(producto[0].stock) - Number(data.cantidad),
								estado: estadoNuevo,
							},
							type: QueryTypes.PATCH,
						},
					)
					.then(() => {
						//Creacion de la orden detallada
						sequelize
							.query(
								'exec pCrearOrdenDetalles @orden = :orden, @producto = :producto, @cantidad = :cantidad, @precio = :precio, @subtotal = :subtotal;',
								{
									replacements: {
										orden: data.orden,
										producto: data.producto,
										cantidad: data.cantidad,
										precio: parseFloat(producto[0].precio),
										subtotal: parseFloat(producto[0].precio) * Number(data.cantidad),
									},
									type: QueryTypes.INSERT,
								},
							)
							.then(() => {
								// Obtener la suma total de la orden
								sequelize
									.query('exec pSumaTotal @orden = :orden;', {
										replacements: {
											orden: Number(data.orden),
										},
										type: QueryTypes.SELECT,
									})
									.then(async (suma) => {
										// Actualizar el total en la Orden
										await sequelize.query(
											'exec pActualizarTotalOrden @orden = :orden, @total = :total',
											{
												replacements: {
													orden: Number(data.orden),
													total: Number(suma[0].Total),
												},
												type: QueryTypes.PUT,
											},
										);
										res.status(201).send('Detalle agregado exitosamente');
									});
							});
					});
			});
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const actualizarDetalles = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;
		//Query para obtener el producto a actualizar en la orden
		await sequelize
			.query('exec pOrdenDetallesID @ordenDetalle = :ordenDetalle;', {
				replacements: {
					ordenDetalle: Number(id),
				},
				type: QueryTypes.SELECT,
			})
			.then((ordenDetalle) => {
				sequelize
					.query('exec pProductoID @producto = :producto;', {
						replacements: {
							producto: Number(ordenDetalle[0].idProductos),
						},
						type: QueryTypes.SELECT,
					})
					.then(async (producto) => {
						if (ordenDetalle[0].cantidad < data.cantidad) {
							const diferenciaCantidad = Number(data.cantidad) - Number(ordenDetalle[0].cantidad);
							//Validacion del stock
							if (producto[0].stock < diferenciaCantidad) {
								return res.status(400).send('La cantidad supera el stock');
							}
							let estadoNuevo;
							if (diferenciaCantidad === Number(producto[0].stock)) {
								estadoNuevo = 2;
							} else {
								estadoNuevo = 1;
							}

							//Query para actualizar el stock y el estado del producto
							await sequelize.query(
								'exec pActualizarStock @producto = :producto, @stock = :stock, @estado = :estado;',
								{
									replacements: {
										producto: Number(ordenDetalle[0].idProductos),
										stock: Number(producto[0].stock) - diferenciaCantidad,
										estado: estadoNuevo,
									},
									type: QueryTypes.PATCH,
								},
							);
							//Query para actualizar la cantidad y subtotal en el detalle
							await sequelize
								.query(
									'exec pActualizarDetalles @detalle = :detalle, @cantidad = :cantidad, @subtotal = :subtotal;',
									{
										replacements: {
											detalle: Number(id),
											cantidad: data.cantidad,
											precio: producto[0].precio,
											subtotal: parseFloat(producto[0].precio) * Number(data.cantidad),
										},
										type: QueryTypes.PUT,
									},
								)
								.then(() => {
									// Query para tener el total de la orden
									sequelize
										.query('exec pSumaTotal @orden = :orden;', {
											replacements: {
												orden: Number(ordenDetalle[0].idOrden),
											},
											type: QueryTypes.SELECT,
										})
										.then(async (suma) => {
											//Actualizar el total de la orden
											await sequelize.query(
												'exec pActualizarTotalOrden @orden = :orden, @total = :total',
												{
													replacements: {
														orden: Number(ordenDetalle[0].idOrden),
														total: Number(suma[0].Total),
													},
													type: QueryTypes.PUT,
												},
											);
										});
									res.status(201).send('Actualizado Correctamente');
								});
						} else if (ordenDetalle[0].cantidad > data.cantidad) {
							//Validacion del stock

							const diferenciaCantidad = ordenDetalle[0].cantidad - data.cantidad;

							//Query para actualizar el stock y el estado del producto
							await sequelize.query(
								'exec pActualizarStock @producto = :producto, @stock = :stock, @estado = :estado;',
								{
									replacements: {
										producto: Number(ordenDetalle[0].idProductos),
										stock: Number(producto[0].stock) + diferenciaCantidad,
										estado: 1,
									},
									type: QueryTypes.PATCH,
								},
							);
							//Query para actualizar la cantidad y subtotal en el detalle
							await sequelize
								.query(
									'exec pActualizarDetalles @detalle = :detalle, @cantidad = :cantidad, @subtotal = :subtotal;',
									{
										replacements: {
											detalle: Number(id),
											cantidad: data.cantidad,
											precio: producto[0].precio,
											subtotal: parseFloat(producto[0].precio) * Number(data.cantidad),
										},
										type: QueryTypes.PUT,
									},
								)
								.then(() => {
									// Query para tener el total de la orden
									sequelize
										.query('exec pSumaTotal @orden = :orden;', {
											replacements: {
												orden: Number(ordenDetalle[0].idOrden),
											},
											type: QueryTypes.SELECT,
										})
										.then(async (suma) => {
											//Actualizar el total de la orden
											await sequelize.query(
												'exec pActualizarTotalOrden @orden = :orden, @total = :total',
												{
													replacements: {
														orden: Number(ordenDetalle[0].idOrden),
														total: Number(suma[0].Total),
													},
													type: QueryTypes.PUT,
												},
											);
										});
									res.status(201).send('Actualizado Correctamente');
								});
						}
					});
			});
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const eliminarOrdenDetalles = async (req, res) => {
	try {
		const { id } = req.params;

		//Query para obtener los detalles antes de borrarlos
		await sequelize
			.query('exec pOrdenDetallesID @ordenDetalle = :ordenDetalle;', {
				replacements: {
					ordenDetalle: Number(id),
				},
				type: QueryTypes.SELECT,
			})
			.then(async (detalles) => {
				// Query para obtener el total de la orden
				await sequelize
					.query('exec pSumaTotal @orden = :orden;', {
						replacements: {
							orden: Number(detalles[0].idOrden),
						},
						type: QueryTypes.SELECT,
					})
					.then((suma) => {
						// Query para actualizar el total de la orden
						sequelize.query('exec pActualizarTotalOrden @orden = :orden, @total = :total', {
							replacements: {
								orden: Number(detalles[0].idOrden),
								total: parseFloat(suma[0].Total) - parseFloat(detalles[0].subtotal),
							},
							type: QueryTypes.PUT,
						});
					});

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
					});
			})
			.then(() => {
				//Borrar el detalle
				sequelize.query('exec pEliminarDetalle @detalle = :detalle', {
					replacements: {
						detalle: Number(id),
					},
					type: QueryTypes.DELETE,
				});
			});

		res.status(201).send('Eliminado exitosamente');
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const obtenerDetallesID = async (req, res) => {
	try {
		const { id } = req.params;
		const detalle = await sequelize.query(
			'exec pOrdenDetallesID @ordenDetalle = :ordenDetalle;',
			{
				replacements: {
					ordenDetalle: Number(id),
				},
				type: QueryTypes.SELECT,
			},
		);
		res.status(200).send(detalle);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

export {
	obtenerDetalles,
	agregarDetalles,
	actualizarDetalles,
	obtenerDetallesID,
	eliminarOrdenDetalles,
};
