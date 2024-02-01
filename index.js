import express from "express";
import cors from 'cors';

import { routerVentas } from "./routes/routerVentas.js";
import { conexion } from "./db/conexion.js";

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { routerProveedores } from "./routes/routerProveedores.js";
import { routerTipoProductos } from "./routes/routerTipoProductos.js";
import { routerProductos } from "./routes/routerProductos.js";
import { routerUsuarios } from "./routes/routerUsuarios.js";
import { routerToken } from "./routes/routerToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Conexión a BD
conexion();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/optimizadas', express.static(path.join(__dirname, '/optimizadas')));

// rutas de la aplicación
app.use('/', routerToken);
app.use('/ventas', routerVentas);
app.use('/usuarios', routerUsuarios);
app.use('/productos', routerProductos);
app.use('/proveedores', routerProveedores);
app.use('/tipo-producto', routerTipoProductos);


app.listen(process.env.PORT, () => {
    console.log('corriendo en el puerto', process.env.PORT);
});