import { FastifyInstance } from 'fastify';
import { db } from './db';

export async function livrosRoutes(fastify: FastifyInstance) {
  fastify.get('/livros', async () => {
    const [rows] = await db.query('SELECT * FROM livros');
    return rows;
  });

  ///get
  fastify.get('/livros/:id', async (request) => {
    const { id } = request.params as { id: string };
    const [rows] = await db.query('SELECT * FROM livros WHERE id = ?', [id]);
    return rows[0] || { erro: 'Livro não encontrado' };
  });
///post 
  fastify.post('/livros', async (request, reply) => {
    const { titulo, autor, ano, genero, preco, imagem } = request.body as any;
    await db.query(
      'INSERT INTO livros (titulo, autor, ano, genero, preco, imagem) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, autor, ano, genero, preco, imagem]
    );
    reply.code(201).send({ mensagem: 'Livro adicionado com sucesso' });
  });

  /////put
  fastify.put('/livros/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { titulo, autor, ano, genero, preco, imagem } = request.body as any;
    await db.query(
      'UPDATE livros SET titulo = ?, autor = ?, ano = ?, genero = ?, preco = ?, imagem = ? WHERE id = ?',
      [titulo, autor, ano, genero, preco, imagem, id]
    );
    reply.send({ mensagem: 'Livro atualizado com sucesso' });
  });

  ////delet
  fastify.delete('/livros/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await db.query('DELETE FROM livros WHERE id = ?', [id]);
    reply.send({ mensagem: 'Livro deletado com sucesso' });
  });
}
