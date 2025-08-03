import { text } from "express";
import pool from "../db.js";
class ViajeCompartido {
  async createViajeCompartido(viaje) {
    const {
      origen,
      destino,
      fecha_hora_salida,
      asientos_ofrecidos,
      id_conductor,
    } = nuevoViaje;
    try {
      const query = {
        text: "INSERT INTO viajecompartido (origen, destino, fecha_hora_salida, asientos_ofrecidos, id_conductor) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error al crear el viaje compartido: ", error);
      throw error;
    }
  }

  async getViajesCompartidos() {
    try {
      const query = `SELECT * FROM viajecompartido RETURNING *`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener los viajes compartidos: ", error);
      throw error;
    }
  }

  async getViajeCompartidoByUserId(userId) {
    try {
      const query = {
        text: `SELECT * FROM viajecompartido WHERE id_conductor = $1 RETURNING *`,
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error(
        "Error al obtener los viajes creados por el usuario: ",
        error
      );
      throw error;
    }
  }

  async getViajeCompartidoById(id) {
    try {
      const query = {
        text: `SELECT 1 FROM viajecompartido WHERE id = $1 RETURNING *`,
        values: [id],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error al obtener el elemento: ", error);
      throw error;
    }
  }

  async deleteViajeCompartidoById(id) {
    try {
      const query = {
        text: `DELETE FROM viajecompartido WHERE id = $1 RETURNING *`,
        values: [id],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return null; // No se encontró el viaje compartido
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error al eliminar el viaje compartido: ", error);
      throw error;
    }
  }
}