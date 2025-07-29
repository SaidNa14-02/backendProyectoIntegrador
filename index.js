import express from 'express';
import rutaRoutes from './routes/rutaRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/rutas', rutaRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});