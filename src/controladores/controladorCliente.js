import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';

const obtenerClientes = async (req, res) => {
	try {
		const clientes = await sequelize.query('select * from vCliente', {
			type: QueryTypes.SELECT,
		});
		res.status(200).send(clientes);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const agregarCliente = async (req, res) => {
	try {
		const data = req.body;

		await sequelize.query(
			'exec pCrearCliente @razon_social = :razonSocial, @nombre_comercial = :nombreComercial, @telefono = :telefono, @email = :email, @direccion_entrega = :direccion;',
			{
				replacements: {
					razonSocial: data.razonSocial,
					nombreComercial: data.nombreComercial,
					telefono: data.telefono,
					email: data.email,
					direccion: data.direccion,
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

const actualizarCliente = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;
		await sequelize.query(
			'exec pActualizarCliente @cliente = :cliente ,@razon_social = :razonSocial, @nombre_comercial = :nombreComercial, @telefono = :telefono, @email = :email, @direccion_entrega = :direccion ',
			{
				replacements: {
					cliente: Number(id),
					razonSocial: data.razonSocial,
					nombreComercial: data.nombreComercial,
					telefono: data.telefono,
					email: data.email,
					direccion: data.direccion,
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

const obtenerClienteID = async (req, res) => {
	try {
		const { id } = req.params;
		const cliente = await sequelize.query('exec pClienteID @cliente = :cliente;', {
			replacements: {
				cliente: Number(id),
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(cliente);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

export { obtenerClientes, agregarCliente, actualizarCliente, obtenerClienteID };
