// backend/livros.ts
import { FastifyInstance } from 'fastify';
import { db } from './db';

export async function livrosRoutes(fastify: FastifyInstance) {
  // Buscar todos os livros
  fastify.get('/livros', async () => {
    const [rows] = await db.query('SELECT * FROM livros');
    return rows;
  });

  // Buscar um livro por ID
  fastify.get('/livros/:id', async (request) => {
    const { id } = request.params as any;
    const [rows] = await db.query('SELECT * FROM livros WHERE id = ?', [id]);
    return rows[0] || { erro: 'Livro não encontrado' };
  });

  // Adicionar livro
  fastify.post('/livros', async (request, reply) => {
    const { titulo, autor, ano, genero, preco, imagem } = request.body as any;
    await db.query(
      'INSERT INTO livros (titulo, autor, ano, genero, preco, imagem) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, autor, ano, genero, preco, imagem]
    );
    reply.code(201).send({ mensagem: 'Livro adicionado com sucesso' });
  });

  // Atualizar livro
  fastify.put('/livros/:id', async (request, reply) => {
    const { id } = request.params as any;
    const { titulo, autor, ano, genero, preco, imagem } = request.body as any;
    await db.query(
      'UPDATE livros SET titulo = ?, autor = ?, ano = ?, genero = ?, preco = ?, imagem = ? WHERE id = ?',
      [titulo, autor, ano, genero, preco, imagem, id]
    );
    reply.send({ mensagem: 'Livro atualizado com sucesso' });
  });

  // Deletar livro
  fastify.delete('/livros/:id', async (request, reply) => {
    const { id } = request.params as any;
    await db.query('DELETE FROM livros WHERE id = ?', [id]);
    reply.send({ mensagem: 'Livro deletado com sucesso' });
  });
}
