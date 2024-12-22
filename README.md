# ** PROYECTO DE TIENDA ONLINE PARA OPTIMA TECNOLOGIA **

#### _Autor_

Kevin Adrian Argueta López

### _No. Código_

GDA00452-OT

### _Fecha de realización del proyecto_

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

## Estructura para realizar request

### Usuarios

_Acceso: Solo operadores_

- GET | /obtenerUsurios
- POST | /agregarUsuario
  Estructura json {
  "rol": int,
  "cliente": int / null,
  "correo": string,
  "nombre": string,
  "password": string,
  "telefono": string,
  "fechaNacimiento": "yyyy-MM-dd"
  }
- PATCH | /eliminarUsuario/:id
  Estructura json{
  "estado": int
  }

_Acceso: Operadores y clientes_

- PUT | /actualizarUsuario/:id
  Estructura json {
  "nombre": string,
  "telefono": string
  }
- GET | /obtenerUsuarioID/:id
- GET | /obtenerHistorialCarrito/:id

### Estados

_Acceso: Solo operadores_

- GET | /obtenerEstados
- POST | /agregarEstado
  Estructura json{
  "nombre": string
  }
- PUT | /actualizarEstado/:id
  Estructura json{
  "nombre": string
  }
- GET | /obtenerEstadoID/:id

### Rol

_Acceso: Solo operadores_

- GET | /obtenerRoles
- POST | /agregarRol
  Estructura json{
  rol: string
  }
- PUT | /actualizarRol/:id
  Estructura json{
  nombre: string
  }
- GET | /obtenerRolID/:id

### Clientes

_Acceso: Solo operadores_

- GET | /obtenerClientes
- POST | /agregarCliente
  Estructura json{
  "razonSocial": string,
  "nombreComercial": string,
  "telefono": string,
  "email": string,
  "direccion": string
  }

_Acceso: Operadores y clientes_

- PUT | /actualizarCliente/:id
  Estuctura json{
  "razonSocial": string,
  "nombreComercial": string,
  "telefono": string,
  "email": string,
  "direccion": string
  }
- GET | /obtenerClienteID/:id

### Categorias

_Acceso: Solo operadores_

- POST | /agregarCategoria
  Estructura json{
  "usuario": int,
  "nombre": string
  }
- PUT | /actualizarCategoria/:id
  Estructura json{
  "nombre": string
  }
- PATCH | /eliminarCategoria/:id
  Estructura json{
  "estado": int
  }

_Acceso: Operadores y clientes_

- GET | /obtenerCategorias
- GET | /obtenerCategoriaID/:id

### Productos

_Acceso: Solo operadores_

- POST | /agregarProducto
  Estructura json{
  "categoria": int,
  "usuario": int,
  "nombre": string,
  "marca": string,
  "codigo": string,
  "stock": int,
  "precio": float,
  "foto": binary
  }
- PUT | /actualizarProducto/:id
  Estructura json{
  "categoria": int,
  "nombre": string,
  "marca": string,
  "codigo": string,
  "stock": int,
  "precio": float,
  "foto": binary
  }
- PATCH | /eliminarProducto/:id
  Estructura json{
  "estado": int
  }
- PUT | /actualizarStock
  Estructura json{
  "producto": int,
  "stock": int,
  "estado": int
  }

_Acceso: Operadores y clientes_

- GET | /obtenerProductos
- GET | /obtenerProductoID/:id
- GET | /buscarProductoNombre
  Estructura json{
  "nombre": string
  }

### Orden

_Acceso: Solo operadores_

- GET | /obtenerOrdenes

_Acceso: Operadores y clientes_

- POST | /agregarOrden
  Estructura json{
  "usuario": int,
  }
- PUT | /actualizarOrden/:id
  Estructura json{
  "nombre": string,
  "direccion": string,
  "telefono": string,
  "correo": string,
  "fecha": 'yyyy-MM-dd'
  }
- PATCH | /cambiarEstadoOrden/:id
  Estructura json{
  "estado": int
  }
- GET | /obtenerOrdenID/:id
- GET | /obtenerCarrito/:id
- GET | /obtenerCarritoActual/:id
- GET | /obtenerCarritoDetallado/:id
- PUT | /limpiarCarrito/:id

### Detalles de orden

_Acceso: Solo operadores_

- GET | /obtenerDetalles

_Acceso: Clientes y operadores_

- POST | /agregarDetalles
  Estructura json{
  "orden": int,
  "producto": int,
  "cantidad": int
  }
- PUT | /actualizarDetalles/:id
  Estructura json{
  "cantidad": int
  }
- DELETE | /eliminarOrdenDetalles/:id
- GET | /obtenerDetallesID/:id
