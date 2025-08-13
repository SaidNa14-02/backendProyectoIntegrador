import express from 'express';
import rutaRoutes from './routes/rutaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import viajeCompartidoRoutes from './routes/viajeRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import rutaFavoritaRoutes from './routes/rutaFavoritaRoutes.js';
import cors from 'cors';
const app = express();
app.use(cors());
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/rutas', rutaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/viajes', viajeCompartidoRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/rutas-favoritas', rutaFavoritaRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});