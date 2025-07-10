// backend/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { livrosRoutes } from './livros';

const app = Fastify();

// Habilita CORS para aceitar chamadas do frontend (React)
app.register(cors, {
  origin: '*', // ou use seu domínio frontend: 'http://localhost:5173'
});

// Registra as rotas CRUD dos livros
app.register(livrosRoutes);

// Inicia o servidor
app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
