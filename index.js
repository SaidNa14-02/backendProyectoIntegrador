import express from 'express';
import rutaRoutes from './routes/rutaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import viajeCompartidoRoutes from './routes/viajeRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import cors from 'cors';
import helmet from 'helmet';
const app = express();
app.use(cors());
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());
//Para el proyecto, las configuraciones por defecto de Helmet son suficientes
app.use(helmet())
// Rutas
app.use('/api/rutas', rutaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/viajes', viajeCompartidoRoutes);
app.use('/api/reservas', reservaRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});