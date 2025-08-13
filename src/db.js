import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

if (!connectionString) {
    throw new Error("La variable de entorno DATABASE_URL o DB_URL no está definida.");
}

console.log("Intentando conectar a la base de datos...");

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa:', res.rows[0]);
  }
});

export default pool;