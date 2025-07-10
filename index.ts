// backend/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { livrosRoutes } from './livros';

const fastify = Fastify();

fastify.register(cors, {
  origin: '*', // Libera para qualquer origem (ajuste se necessário)
});

fastify.register(livrosRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(` Servidor rodando em: ${address}`);
});
