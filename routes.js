import fs from 'fs';
import { sequelize, criaProduto, leProduto, leProdutoporid, atualizaProdutoporid, deletaProdutoporid } from './models.js';

export default async function rotas(req, res, dado) {
    res.setHeader('Content-Type', 'application/json', 'utf-8')

    if (req.method === 'GET' && req.url === '/') {
        const { conteudo } = dado;

        res.statusCode = 200;

        const resposta = {
            mensagem: conteudo
        };

        res.end(JSON.stringify(resposta));

        return;
    }

    if (req.method === 'POST' && req.url === '/produto') {
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', async () => {
            const produto = JSON.parse(corpo);

            res.statusCode = 400;

            if (!produto?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            if (!produto?.preco) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }
            try{
                const resposta = await criaProduto(produto);

                res.statusCode = 201;

                res.end(JSON.stringify(resposta));

                return;
            }catch (erro) {
                 console.log('Falha ao criar produto', erro);

                    res.statusCode = 500;

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao criar o produto ${produto.nome}`
                        }
                    };

                    res.end(JSON.stringify(resposta));

                    return;
            }
        });

        req.on('error', (erro) => {
            console.log('Falha ao processa a requisição', erro);

            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisção'
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        });
        return;
    }

    if (req.method === 'PATCH' && req.url.split('')[1] === '/produtos' && !isNaN(req.url.split('')[2])) {
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', async() => {
            const produto = JSON.parse(corpo);

            res.statusCode = 400;

            if (!produto?.nome && !produto.preco) {
                const resposta = {
                    erro: {
                        mensagem: `nenhum atributo foi encontrado, porem ao menos um é obrigatório para a atualização do produto`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            const id = req.url.split('/')[2];
            try{
                const resposta = await atualizaProdutoporid(id, produto);

                res.statusCode = 200;

                res.end(JSON.stringify(resposta));

                return;
            } catch(erro) {
                console.log('Falha ao atualizar produto', erro);

                    res.statusCode = 500;

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao atualizar o produto ${produto.nome}`
                        }
                    };

                    res.end(JSON.stringify(resposta));

                    return;
                }   
        });

        req.on('error', (erro) => {
            console.log('Falha ao processa a requisição', erro);

            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisção'
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        });
        return;
    }

    if (req.method === 'DELETE' && req.url.split('')[1] === '/produtos' && !isNaN(req.url.split('')[2])) {
        const id = req.url.split('')[2];

        try{
            const resposta = await deletaProdutoporid(id);
        } catch(erro) {
            console.log('Falha ao remover produto', erro);

            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao remover o produto ${produto.nome}`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }

        res.statusCode = 204;

        res.end();

        return;
    }
    res.statusCode = 404;

    const resposta = {
        erro: {
            mensagem: 'Rota não encontrada!',
            url: req.url
        }
    };

    res.end(JSON.stringify(resposta));
}