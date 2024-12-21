# ** PROYECTO DE TIENDA ONLINE PARA OPTIMA TECNOLOGIA **

#### _ Autor _

Kevin Adrian Argueta López

### _ No. Código _

GDA00452-OT

### _ Fecha de realización del proyecto _

2024-12-xx

## ** DOCUMENTACIÓN API REST **

Lenguajes utilizados:

- Javascript

Entorno de ejecución

- Node.js

Gestión de paquetes utilizados

- NPM

Paquetes utilizados

- sequelize
- bcrypt
- dotenv
- express
- jsonwebtoken

El programa necesita para funcionar

- Tener instalado node.js
- Iniciar npm
- Descargar los paquetes
- Configuración de las variables de entorno

Programas/Extensiones de testeo utilizado para los endpoints

- Postman
- RapidAPI Client

## El programa se ha modulado de la siguiente forma

- Carpeta config: Contiene la configuración para la conexion con la base de datos, también se encuentran las claves para JWT
- Carpeta controladores: Contiene las funciones que hará cada endpoint
- Carpeta rutas: Contiene los endpoints y los tipos de metodos para las consultas http
- Archivo index: Inicialización del servidor, su configuración y sesiones
