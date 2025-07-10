// backend/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { livrosRoutes } from './livros';

const app = Fastify();

app.register(cors, {
  origin: '*', // Libera para qualquer origem (ajuste se necessário)
});

app.register(livrosRoutes);


/* GET /livros (com filtro ?titulo=) */
app.get('/livros', async (req, reply) => {
  try {
    const { titulo } = req.query as any;
    const [rows] = await conn.query(
      titulo ? 'SELECT * FROM livro WHERE titulo LIKE ?'
             : 'SELECT * FROM livro',
      titulo ? [`%${titulo}%`] : []
    );
    reply.send(rows);
  } catch (err) {
    console.error('GET /livros', err);
    reply.code(500).send({ erro: 'Falha ao listar', detalhes: String(err) });
  }
});

/* POST /livros */
app.post('/livros', async (req, reply) => {
  try {
    const { titulo, ano_publicacao, preco } = req.body as any;
    const [r]: any = await conn.query(
      'INSERT INTO livro (titulo, ano_publicacao, preco) VALUES (?,?,?)',
      [titulo, ano_publicacao, preco]
    );
    reply.code(201).send({ id: r.insertId, titulo, ano_publicacao, preco });
  } catch (err) {
    console.error('POST /livros', err);
    reply.code(500).send({ erro: 'Falha ao criar', detalhes: String(err) });
  }
});

/* PUT /livros/:id */
app.put('/livros/:id', async (req, reply) => {
  try {
    const { id } = req.params as any;
    const { titulo, ano_publicacao, preco } = req.body as any;
    await conn.query(
      'UPDATE livro SET titulo=?, ano_publicacao=?, preco=? WHERE id=?',
      [titulo, ano_publicacao, preco, id]
    );
    reply.send({ id, titulo, ano_publicacao, preco });
  } catch (err) {
    console.error('PUT /livros', err);
    reply.code(500).send({ erro: 'Falha ao atualizar', detalhes: String(err) });
  }
});

/* DELETE /livros/:id */
app.delete('/livros/:id', async (req, reply) => {
  try {
    await conn.query('DELETE FROM livro WHERE id=?', [req.params.id]);
    reply.code(204).send();
  } catch (err) {
    console.error('DELETE /livros', err);
    reply.code(500).send({ erro: 'Falha ao excluir', detalhes: String(err) });
  }
});

/* Relatório INNER JOIN */
app.get('/relatorio', async (_req, reply) => {
  try {
    const [rows] = await conn.query(`
      SELECT l.id, l.titulo, l.ano_publicacao, l.preco,
             c.nome AS categoria,
             GROUP_CONCAT(a.nome SEPARATOR ', ') AS autores
      FROM livro l
      JOIN categoria c ON c.id = l.categoria_id
      JOIN livro_autor la ON la.livro_id = l.id
      JOIN autor a ON a.id = la.autor_id
      GROUP BY l.id
    `);
    reply.send(rows);
  } catch (err) {
    console.error('GET /relatorio', err);
    reply.code(500).send({ erro: 'Falha no relatório', detalhes: String(err) });
  }
});

/* porta 8000 (igual ao repo) */
app.listen({ port: 8000 }).then(() =>
  console.log(' backend em http://localhost:8000')
);

