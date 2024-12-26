import { Router } from 'express';
import app from '../index.js';
import sequelize from '../config/conexion.js';
import { QueryTypes } from '@sequelize/core';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const iniciarSesion = Router();

iniciarSesion.post('/iniciarSesion', async (req, res) => {
	try {
		const data = req.body;
		// Obtener el correo con el que se quiere iniciar sesion
		await sequelize
			.query('exec pBuscarUsuarioCorreo @correo = :correo;', {
				replacements: {
					correo: data.correo,
				},
				type: QueryTypes.SELECT,
			})
			.then(async (usuario) => {
				// Validacion existe un usuario con ese correo
				if (!usuario[0]) {
					return res.status(400).json({
						status: 'error',
						mensaje: 'Datos incorrectos',
					});
				} else {
					// Verificaciones de la contraseña y el correo
					const hashSaved = usuario[0].password;
					const isPasswordValid = await bcrypt.compare(data.password, hashSaved);
					if (isPasswordValid && data.correo === usuario[0].correo_electronico) {
						// Creacion del token
						const payload = {
							check: true,
						};
						if (usuario[0].idRol === 1) {
							const token = jsonwebtoken.sign(payload, app.get('keyCliente'), {
								expiresIn: '1d',
							});
							return res.status(201).json({
								mensaje: 'Autenticacion exitosa',
								rol: 'C',
								token: token,
							});
						} else if (usuario[0].idRol === 2) {
							const token = jsonwebtoken.sign(payload, app.get('keyOperador'), {
								expiresIn: '1d',
							});
							return res.status(201).json({
								mensaje: 'Autenticacion exitosa',
								rol: 'O',
								token: token,
							});
						}
					} else {
						//Si los datos no son correctos no se hará el token}
						return res.status(400).json({
							status: 'error',
							mensaje: 'Datos incorrectos',
						});
					}
				}
			});
	} catch (err) {
		console.log('Error durante el proceso');
		return res.status(500).send(err);
	}
});

export default iniciarSesion;
