import Fastify from 'fastify';
import cors from '@fastify/cors';
import { livrosRoutes } from './livros';

const app = Fastify();


app.register(cors, {
  origin: '*', 
});


app.register(livrosRoutes);


app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
