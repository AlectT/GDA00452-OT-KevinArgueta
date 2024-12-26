import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import app from '../index.js';

const verificacionToken = Router();

// Verificación del token y rol
verificacionToken.use((req, res, next) => {
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

export default verificacionToken;
