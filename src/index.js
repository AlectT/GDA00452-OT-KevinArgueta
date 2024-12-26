import dotenv from 'dotenv';
import express from 'express';
import routerUsuario from './rutas/rutasUsuario.js';
import routerRol from './rutas/rutasRol.js';
import routerEstado from './rutas/rutasEstado.js';
import routerCliente from './rutas/rutasCliente.js';
import routerCategoria from './rutas/rutasCategoria.js';
import routerOrden from './rutas/rutasOrden.js';
import routerProducto from './rutas/rutasProducto.js';
import routerDetalles from './rutas/rutasDetalles.js';
import keys from './config/keys.js';
import cors from 'cors';
import verificacionToken from './middleware/verificacionToken.js';
import iniciarSesion from './middleware/IniciarSesion.js';

dotenv.config();

const app = express();

// Utilizacion del metodo cors para consumir el API
app.use(cors());

//Configuracion de express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuracion de las keys para el JWT
app.set('keyOperador', keys.keyOperador);
app.set('keyCliente', keys.keyCliente);

// MiddleWare para iniciar sesion
app.use(iniciarSesion);

// MiddleWare de validacion de Token
app.use(verificacionToken);
// Separacion de rutas por tablas
app.use(routerUsuario);
app.use(routerRol);
app.use(routerEstado);
app.use(routerCliente);
app.use(routerCategoria);
app.use(routerOrden);
app.use(routerProducto);
app.use(routerDetalles);

//Inicializacion de servidor
app.listen(4000);
export default app;
