import http from 'http';
import fs from 'fs';
/*import rotas from "./routes.js";*/
import sqlite3 from 'sqlite3';
import { sequelize, criaProduto, leProduto, leProdutoporid, atualizaProdutoporid, deletaProdutoporid } from './models.js';

const db = new sqlite3.Database('./tic.db', (erro) => {
    if(erro) {
        console.log('Falha ao incializar o banco de dados');
        return;
    }
    console.log('Banco de dados inicializado');
});

fs.writeFile('./mensagem.txt', 'Olá, Tic em Trilhas do arquivo!', 'utf-8', (erro) => {if (erro) {
    console.log('Falha ao escrever o arquivo', erro);
    return;
    }
    console.log('Arquivo foi criado com sucesso!');
});

fs.readFile('./mensagem.txt', 'utf-8', (erro, conteudo) => {if (erro) {
    console.log('Falha na leitura do arquivo', erro);
    return
    }
    console.log(`Conteudo: ${conteudo}`);

    iniciaServidor(conteudo);
});

async function iniciaServidor(conteudo){
    await sequelize.sync();

    await criaProduto({ nome: 'Açai Tradicional', preco: 10.50});
    await criaProduto({ nome: 'Açai com Granola', preco: 12.50});
    await leProduto();
    await leProdutoporid(2);
    await leProdutoporid(20);
    await atualizaProdutoporid(2, { preco: 13.00});
    await deletaProdutoporid(1);
    await leProduto();

    const servidor = http.createServer((req, res) => {
    rotas(req, res, { conteudo });
});

const porta = 3000;
const host = 'localhost';

servidor.listen(porta, host, () => {
    console.log(`Servidor executando em http://${host}:${porta}/`)
});
}

