import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

const app = express();

// cors() permite que o front (porta 3010) acesse o servidor (porta 3001)
// sem isso o navegador bloquearia a requisição
app.use(cors());
app.use(express.json());

// Pool é um conjunto de conexões com o banco de dados
// Reutiliza conexões em vez de abrir uma nova a cada requisição
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// ROTA 1: GET /
// Retorna o concurso mais recente
// ORDER BY concurso DESC = ordena do maior para o menor número
// LIMIT 1 = pega apenas o primeiro resultado (o mais recente)
app.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM megasena ORDER BY concurso DESC LIMIT 1'
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// ROTA 2: GET /:numero
// Retorna o concurso pelo número informado na URL
// Exemplo: acessar localhost:3001/2848 retorna os dados do concurso 2848
// $1 é um placeholder seguro — evita SQL injection
app.get('/:numero', async (req, res) => {
  const numero = parseInt(req.params.numero);

  // Verifica se o que foi passado é um número válido
  if (isNaN(numero)) {
    return res.status(400).json({ message: 'Número de concurso inválido' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM megasena WHERE concurso = $1',
      [numero]
    );

    // Se não encontrou nenhuma linha, o concurso não existe
    if (result.rows.length === 0) {
      return res.json({ message: `Não existem dados do concurso ${numero}` });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});