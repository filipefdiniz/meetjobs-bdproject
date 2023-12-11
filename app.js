const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 5500;

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123', 
  database: 'trabalhofinal_bd'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao MySQL');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Rota para a consulta de freelancers por cidade
app.post('/freelancers-por-cidade', (req, res) => {
  const cidade = req.body.cidade;

  const query = `SELECT nome_completo
                 FROM freelancers f
                 JOIN ENDERECO e ON f.cep = e.CEP
                 WHERE e.Cidade = ?`;

  db.query(query, [cidade], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Rota para a consulta de serviços que pagam mais de X
app.post('/servicos-mais-500', (req, res) => {
    const quantidade = req.body.quantidade;

    const query = 'SELECT * FROM servicos WHERE proposta > ?';

    db.query(query, [quantidade], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});




// Rota para a consulta do número de serviços por estado
app.get('/num-servicos-por-estado', (req, res) => {
  const query = `SELECT e.Estado, COUNT(*) AS num_servicos
                 FROM servicos s
                 JOIN ENDERECO e ON s.localizacao = e.Cidade
                 GROUP BY e.Estado`;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


// Rota para criar um freelancer
app.post('/criar-freelancer', (req, res) => {
    const {
      nome_completo, email, telefone, cpf_cnpj, data_nascimento, senha,
      criado_em, descricao, competencias, cep
    } = req.body;
  
    const query = `INSERT INTO freelancers 
                   (nome_completo, email, telefone, cpf_cnpj, data_nascimento, senha, criado_em, descricao, competencias, cep)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [nome_completo, email, telefone, cpf_cnpj, data_nascimento, senha, criado_em, descricao, competencias, cep], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
  
  
  // Rota para criar um contratante
  app.post('/criar-contratante', (req, res) => {
    const { nome_completo, CPF_CNPJ, descricao, senha, CEP, email, telefone, criado_em, id_servico_fk } = req.body;
  
    const query = `INSERT INTO CONTRATANTE 
                   (nome_completo, CPF_CNPJ, descricao, senha, CEP, email, telefone, criado_em, id_servico_fk) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [nome_completo, CPF_CNPJ, descricao, senha, CEP, email, telefone, criado_em, id_servico_fk], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
  
  
// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});