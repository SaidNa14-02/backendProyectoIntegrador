import pool from './src/db.js';
import express from 'express';
const app = express();
const port = 3000;

async function obtenerRutas() {
    try {
        const res = await pool.query ('SELECT * FROM ruta');
        console.log('Resultados de la consulta', res.rows);
        return res.rows;
    }
    catch{
        console.error('Error ejecutando la consulta', err.stack);
        throw err
    }
}
app.get('/', (req, res) => {
    res.send('App de express iniciada')
});

app.listen(port, () =>{
    console.log('Servidor escuchando en puerto 3000')
    
})

obtenerRutas()