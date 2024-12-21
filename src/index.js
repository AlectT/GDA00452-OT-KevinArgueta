import dotenv from 'dotenv';
import express, { Router } from 'express';
import routerUsuario from './rutas/rutasUsuario.js';
import routerRol from './rutas/rutasRol.js';
import routerEstado from './rutas/rutasEstado.js';
import routerCliente from './rutas/rutasCliente.js';
import routerCategoria from './rutas/rutasCategoria.js';
import routerOrden from './rutas/rutasOrden.js';
import routerProducto from './rutas/rutasProducto.js';
import routerDetalles from './rutas/rutasDetalles.js';
import jsonwebtoken from 'jsonwebtoken';
import keys from './config/keys.js';
import sequelize from './config/conexion.js';
import { QueryTypes } from '@sequelize/core';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();

//Configuracion de express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuracion de las keys para el JWT
app.set('keyOperador', keys.keyOperador);
app.set('keyCliente', keys.keyCliente);

// MiddleWare para JWT
app.post('/iniciarSesion', async (req, res) => {
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
					return res.status(201).send('Datos incorrectos');
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
								token: token,
							});
						} else if (usuario[0].idRol === 2) {
							const token = jsonwebtoken.sign(payload, app.get('keyOperador'), {
								expiresIn: '1d',
							});
							return res.status(201).json({
								mensaje: 'Autenticacion exitosa',
								token: token,
							});
						}
					} else {
						//Si los datos no son correctos no se hará el token
						return res.status(201).json({
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

// MiddleWare para verificar el token
const verificacion = Router();

verificacion.use((req, res, next) => {
	let token = req.headers['x-acces-token'] || req.headers['authorization'];
	if (!token) {
		return res.status(401).send('Se necesita el token para la autenticación');
	}

	if (token.startsWith('Bearer ')) {
		token = token.replace('Bearer ', '');
	}

	if (token) {
		jsonwebtoken.verify(token, app.get('keyOperador'), (errO, decodedO) => {
			if (!errO) {
				req.rol = 'O';
				req.decoded = decodedO;
				next();
			} else {
				jsonwebtoken.verify(token, app.get('keyCliente'), (errC, decodedC) => {
					if (!errC) {
						req.rol = 'C';
						req.decoded = decodedC;
						next();
					} else {
						return res.json({ mensaje: 'El token no es valido' });
					}
				});
			}
		});
	}
});

// Separacion de rutas por tablas
app.use(verificacion);
app.use(routerUsuario);
app.use(routerRol);
app.use(routerEstado);
app.use(routerCliente);
app.use(routerCategoria);
app.use(routerOrden);
app.use(routerProducto);
app.use(routerDetalles);

//Inicializacion de servidor
app.listen(3000);
