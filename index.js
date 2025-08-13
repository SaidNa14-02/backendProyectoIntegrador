import express from 'express';
import rutaRoutes from './routes/rutaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import viajeCompartidoRoutes from './routes/viajeRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import rutaFavoritaRoutes from './routes/rutaFavoritaRoutes.js';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
const app = express();

//Middleware
app.use(express.json());
app.use(cors());
//Configuración de la limitación de solicitudes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Hemos detectado demasiadas solicitudes desde tu IP, por favor intenta más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter);

const port = 3000;

//Para el proyecto, las configuraciones por defecto de Helmet son suficientes
app.use(helmet())

// Rutas
app.use('/api/rutas', rutaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/viajes', viajeCompartidoRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/rutas-favoritas', rutaFavoritaRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});