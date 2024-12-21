import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';
import bcrypt from 'bcrypt';

const obtenerUsuarios = async (req, res) => {
	try {
		const usuarios = await sequelize.query('select * from vUsuario', {
			type: QueryTypes.SELECT,
		});
		res.status(200).send(usuarios);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const agregarUsuario = async (req, res) => {
	try {
		const data = req.body;
		//Query para evitar correos repetidos
		await sequelize
			.query('exec pBuscarUsuarioCorreo @correo = :correo;', {
				replacements: {
					correo: data.correo,
				},
				type: QueryTypes.SELECT,
			})
			.then((usuario) => {
				function calcularEdad(fecha) {
					var hoy = new Date();
					var nacimiento = new Date(fecha);
					var edad = hoy.getFullYear() - nacimiento.getFullYear();
					var m = hoy.getMonth() - nacimiento.getMonth();

					if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
						edad--;
					}

					return edad;
				}
				// Si el correo ya existe entonces no lo agrega
				if (usuario[0]) {
					res.status(400).send('Ya existe un usuario con ese correo');
				} else {
					const edadActual = calcularEdad(data.fechaNacimiento);
					if (edadActual >= 18) {
						const date = new Date().toISOString();
						//Agregar usuario
						bcrypt.hash(data.password, 8).then(async (hashPassword) => {
							await sequelize.query(
								'exec pCrearUsuario @rol = :rol, @estado = :estado, @cliente = :cliente, @correo = :correo, @nombre = :nombre, @password = :password, @telefono = :telefono, @fecha_nacimiento = :fechaNacimiento, @fecha_creacion = :fechaCreacion;',
								{
									replacements: {
										rol: data.rol,
										estado: 5,
										cliente: data.cliente,
										correo: data.correo,
										nombre: data.nombre,
										password: hashPassword,
										telefono: data.telefono,
										fechaNacimiento: data.fechaNacimiento,
										fechaCreacion: date,
									},
									type: QueryTypes.INSERT,
								},
							);
							res.status(201).send('Agregado exitosamente');
						});
					} else {
						res.status(400).send('El usuario debe de ser mayor de edad');
					}
				}
			});
	} catch (err) {
		console.log('Error durante el procedimiento');
		return res.status(500).send(err);
	}
};

const actualizarUsuario = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;
		await sequelize.query(
			'exec pActualizarUsuario @usuario = :usuario, @nombre = :nombre, @telefono = :telefono;',
			{
				replacements: {
					usuario: Number(id),
					nombre: data.nombre,
					telefono: data.telefono,
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

const eliminarUsuario = async (req, res) => {
	try {
		const data = req.body;
		const { id } = req.params;

		if (data.estado === 5 || data.estado === 6) {
			await sequelize.query(
				'exec pCambiarEstadoUsuario @usuario = :usuario, @estado = :estado;',
				{
					replacements: {
						usuario: Number(id),
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

const obtenerUsuarioID = async (req, res) => {
	try {
		const { id } = req.params;
		const usuario = await sequelize.query('exec pUsuarioID @usuario = :usuario;', {
			replacements: {
				usuario: Number(id),
			},
			type: QueryTypes.SELECT,
		});
		res.status(200).send(usuario);
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

const obtenerHistorialCarrito = async (req, res) => {
	try {
		const { id } = req.params;
		await sequelize
			.query('exec pHistorialCompras @usuario = :usuario;', {
				replacements: {
					usuario: Number(id),
				},
				type: QueryTypes.SELECT,
			})
			.then((orden) => {
				var nuevoArray = [];
				var arrayTemporal = [];
				for (var i = 0; i < orden.length; i++) {
					arrayTemporal = nuevoArray.filter((resp) => resp['idOrden'] == orden[i]['idOrden']);
					if (arrayTemporal.length > 0) {
						nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]['Orden'].push(orden[i]);
					} else {
						nuevoArray.push({
							idOrden: orden[i]['idOrden'],
							Orden: [orden[i]],
						});
					}
				}
				res.status(200).send(nuevoArray);
			});
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
};

export {
	obtenerUsuarios,
	agregarUsuario,
	actualizarUsuario,
	eliminarUsuario,
	obtenerUsuarioID,
	obtenerHistorialCarrito,
};
