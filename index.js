import express from "express";
import cors from 'cors';

import { routerPrincipal } from "./routes/index.js";
import { conexion } from "./db/conexion.js";

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
app.use('/', routerPrincipal);

app.listen(5555, () => {
    console.log('corriendo');
});