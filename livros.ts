import { FastifyInstance } from 'fastify';
import { db } from './db';
import { RowDataPacket } from 'mysql2';

interface Livro extends RowDataPacket {
  id: number;
  titulo: string;
  autor: string;
  ano: number;
  genero: string;
  preco: number;
  imagem: string;
}
export async function livrosRoutes(fastify: FastifyInstance) {
  // GET 
  fastify.get('/livros', async () => {
    const [rows] = await db.query<Livro[]>('SELECT * FROM livros');
    return rows;
  });

  // GET 
  fastify.get('/livros/:id', async (request) => {
    const { id } = request.params as { id: string };
    const [rows] = await db.query<Livro[]>('SELECT * FROM livros WHERE id = ?', [id]);
    return rows[0] || { erro: 'Livro não encontrado' };
  });

  // POST
  fastify.post('/livros', async (request, reply) => {
    const { titulo, autor, ano, genero, preco, imagem } = request.body as {
      titulo: string;
      autor: string;
      ano: number;
      genero: string;
      preco: number;
      imagem: string;
    };

    await db.query(
      'INSERT INTO livros (titulo, autor, ano, genero, preco, imagem) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, autor, ano, genero, preco, imagem]
    );

    reply.code(201).send({ mensagem: 'Livro adicionado com sucesso' });
  });

  // DELETE 
  fastify.delete('/livros/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await db.query('DELETE FROM livros WHERE id = ?', [id]);

    reply.send({ mensagem: 'Livro deletado com sucesso' });
  });
}