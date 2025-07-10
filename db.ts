// backend/db.ts
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',        // coloque sua senha do MySQL se houver
  database: 'livraria',
});
