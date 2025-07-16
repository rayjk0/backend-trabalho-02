import Fastify from 'fastify';
import cors from '@fastify/cors';
import mysql from 'mysql2/promise';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: '*',
  methods: ['POST', 'GET', 'DELETE', 'PUT']
});

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'biblioteca'
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

fastify.get('/', async (_req, reply) => {
  reply.send({ mensagem: "API Livros - Biblioteca" });
});

fastify.get('/generos', async () => {
  const conn = await getConnection();
  const [rows] = await conn.query('SELECT * FROM generos');
  await conn.end();
  return rows;
});

fastify.post('/generos', async (request) => {
  const { nome } = request.body as { nome: string };
  const conn = await getConnection();
  await conn.query('INSERT INTO generos (nome) VALUES (?)', [nome]);
  await conn.end();
  return { message: 'Gênero criado com sucesso' };
});
fastify.get('/livros', async () => {
  const conn = await getConnection();
  const [rows] = await conn.query(`
    SELECT l.*, GROUP_CONCAT(g.nome SEPARATOR ', ') AS generos
    FROM livros l
    LEFT JOIN livros_generos lg ON l.id = lg.livro_id
    LEFT JOIN generos g ON g.id = lg.genero_id
    GROUP BY l.id
  `);
  await conn.end();
  return rows;
});

fastify.get('/livros/:id', async (request) => {
  const id = Number((request.params as any).id);
  const conn = await getConnection();
  const [[livro]] = await conn.query('SELECT * FROM livros WHERE id = ?', [id]);

  const [generos] = await conn.query(`
    SELECT g.id, g.nome FROM generos g
    INNER JOIN livros_generos lg ON g.id = lg.genero_id
    WHERE lg.livro_id = ?
  `, [id]);

  await conn.end();
  return { ...livro, generos };
});

fastify.post('/livros', async (request) => {
  const {
    titulo,
    autor,
    paginas,
    anoPublicacao,
    editora,
    imagem,
    ondeComprar,
    nota,
    generos
  } = request.body as {
    titulo: string;
    autor: string;
    paginas: number;
    anoPublicacao: number;
    editora: string;
    imagem: string;
    ondeComprar: string;
    nota: number;
    generos: number[];
  };

  const conn = await getConnection();

  const [result] = await conn.query(
    'INSERT INTO livros (titulo, autor, paginas, anoPublicacao, editora, imagem, ondeComprar, nota) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [titulo, autor, paginas, anoPublicacao, editora, imagem, ondeComprar, nota]
  );

  const livroId = (result as any).insertId;

  for (const generoId of generos) {
    await conn.query(
      'INSERT INTO livros_generos (livro_id, genero_id) VALUES (?, ?)',
      [livroId, generoId]
    );
  }

  await conn.end();
  return { message: 'Livro criado com sucesso' };
});

fastify.put('/livros/:id', async (request) => {
  const id = Number((request.params as any).id);
  const {
    titulo,
    autor,
    paginas,
    anoPublicacao,
    editora,
    imagem,
    ondeComprar,
    nota,
    generos
  } = request.body as {
    titulo: string;
    autor: string;
    paginas: number;
    anoPublicacao: number;
    editora: string;
    imagem: string;
    ondeComprar: string;
    nota: number;
    generos: number[];
  };

  const conn = await getConnection();

  await conn.query(`
    UPDATE livros SET
      titulo = ?, autor = ?, paginas = ?, anoPublicacao = ?,
      editora = ?, imagem = ?, ondeComprar = ?, nota = ?
    WHERE id = ?
  `, [titulo, autor, paginas, anoPublicacao, editora, imagem, ondeComprar, nota, id]);

  await conn.query('DELETE FROM livros_generos WHERE livro_id = ?', [id]);

  for (const generoId of generos) {
    await conn.query('INSERT INTO livros_generos (livro_id, genero_id) VALUES (?, ?)', [id, generoId]);
  }

  await conn.end();
  return { message: 'Livro atualizado com sucesso' };
});

fastify.delete('/livros/:id', async (request) => {
  const id = Number((request.params as any).id);
  const conn = await getConnection();
  await conn.query('DELETE FROM livros WHERE id = ?', [id]);
  await conn.end();
  return { message: 'Livro deletado com sucesso' };
});

// ======================
// INICIAR SERVIDOR
// ======================
const start = async () => {
  try {
    await fastify.listen({ port: 8000 });
    console.log('Servidor rodando em http://localhost:8000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
