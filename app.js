const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

const VERSION = "3.0.0";

const pool = new Pool({
  host: "db",
  database: "empresa",
  user: "admin",
  password: "admin123",
  port: 5432,
});

app.get("/", async (req, res) => {
  try {
    const versionResult = await pool.query("SELECT version();");

    const clientesResult = await pool.query(
      "SELECT id, nombre FROM clientes ORDER BY id;"
    );

    let listaClientes = "";

    clientesResult.rows.forEach((cliente) => {
      listaClientes += `<li>${cliente.id} - ${cliente.nombre}</li>`;
    });

    res.send(`
      <h1>Aplicación Node.js + Express</h1>
      <h2>Versión ${VERSION}</h2>
      <p>Conexión exitosa a PostgreSQL</p>
      <p>${versionResult.rows[0].version}</p>

      <h2>Clientes registrados</h2>
      <ul>
        ${listaClientes}
      </ul>
    `);
  } catch (error) {
    res.send(`
      <h1>Aplicación Node.js + Express</h1>
      <h2>Versión ${VERSION}</h2>
      <p>Error de conexión o consulta:</p>
      <pre>${error.message}</pre>
      <p>Si todavía no creaste la tabla clientes, hazlo desde pgAdmin.</p>
    `);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor Node.js ejecutándose en http://localhost:${PORT}`);
});