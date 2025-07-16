# Backend da Livraria Online

Este é o backend da aplicação de Livraria Online, implementado com Fastify e MySQL. Ele fornece uma API REST para gerenciar livros e gêneros, suportando operações CRUD completas.

## Tecnologias Utilizadas

- Node.js
- Fastify
- MySQL
- TypeScript
- @fastify/cors
- mysql2

## Configuração

### Banco de Dados

Crie o banco de dados e as tabelas necessárias no MySQL:

```sql
CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE livros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  autor VARCHAR(255),
  paginas INT,
  anoPublicacao INT,
  editora VARCHAR(255),
  imagem VARCHAR(1000),
  ondeComprar VARCHAR(255),
  nota INT CHECK (nota BETWEEN 1 AND 10)
);

CREATE TABLE generos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) UNIQUE
);

CREATE TABLE livros_generos (
  livro_id INT,
  genero_id INT,
  FOREIGN KEY (livro_id) REFERENCES livros(id),
  FOREIGN KEY (genero_id) REFERENCES generos(id)
);
```

## Como executar

### 1. Instalar dependências

```bash
npm install
npm install fastify
```

### 2. Rodar o servidor

```bash
npm run dev
```

> O servidor estará disponível em: `http://localhost:8000`

## Rotas disponíveis

- `GET /` - Mensagem de status da API
- `GET /generos` - Lista todos os gêneros
- `POST /generos` - Cria um novo gênero
- `GET /livros` - Lista todos os livros com seus gêneros
- `GET /livros/:id` - Detalhes de um livro específico
- `POST /livros` - Cria um novo livro
- `PUT /livros/:id` - Atualiza um livro existente
- `DELETE /livros/:id` - Deleta um livro
