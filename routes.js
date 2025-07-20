import fs from 'fs';
import { sequelize, criaProduto, leProduto, leProdutoporid, atualizaProdutoporid, deletaProdutoporid } from './models.js';

export default function rotas(req, res, dado) {
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

    if (req.method === 'POST' && req.url === '/produtos') {
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', () => {
            const produtos = JSON.parse(corpo);

            res.statusCode = 400;

            if (!produtos?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produtos`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            fs.writeFile(`${produtos.nome}.txt`, produtos?.conteudo ?? '', 'utf-8', (erro) => {
                if (erro) {
                    console.log('Falha ao criar produtos', erro);

                    res.statusCode = 500;

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao criar o produtos ${produtos.nome}`
                        }
                    };

                    res.end(JSON.stringify(resposta));

                    return;
                }

                res.statusCode = 201;

                const resposta = {
                    mensagem: `Produto ${produtos.nome} criado com sucesso`
                };
                res.end(JSON.stringify(resposta));

                return;
            });
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

    if (req.method === 'PATCH' && req.url === '/arquivos') {
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', () => {
            const produtos = JSON.parse(corpo);

            res.statusCode = 400;

            if (!produtos?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a atualização do produtos`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            if (!produtos?.conteudo) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'conteudo' não foi encontrado, porém é obrigatório para a atualização do produtos`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            fs.access(`${produtos.nome}.txt`, fs.constants.W_OK, (erro) => {
                if(erro) {
                    console.log('Falha ao acessar produtos', erro);

                    res.statusCode = erro.code === 'ENOENT' ? 404 : 403;

                    const resposta = {
                        erro:{
                            mensagem: `Falha ao acessar o produtos ${produtos.nome}`
                        }
                    };

                    res.end(JSON.stringify(resposta));

                    return;
                }

                fs.appendFile(`${produtos.nome}.txt`, `\n${produtos.conteudo}`, 'utf-8', (erro) => {
                if (erro) {
                    console.log('Falha ao atualizar produtos', erro);

                    res.statusCode = 500;

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao atualizar o produtos ${produtos.nome}`
                        }
                    };

                    res.end(JSON.stringify(resposta));

                    return;
                }

                res.statusCode = 200;

                const resposta = {
                    mensagem: `Produto ${produtos.nome} atualizado com sucesso`
                };
                res.end(JSON.stringify(resposta));

                return;
                });

            });

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

    if (req.method === 'DELETE' && req.url === '/arquivos') {
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', () => {
            const produtos = JSON.parse(corpo);

            res.statusCode = 400;

            if (!produtos?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a remoção do produtos`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            fs.access(`${produtos.nome}.txt`, fs.constants.W_OK, (erro) => {
                if(erro) {
                    console.log('Falha ao acessar produtos', erro);

                    res.statusCode = erro.code === 'ENOENT' ? 404 : 403;

                    const resposta = {
                        erro:{
                            mensagem: `Falha ao acessar o produtos ${produtos.nome}`
                        }
                    };

                    res.end(JSON.stringify(resposta));

                    return;
                }

                fs.rm(`${produtos.nome}.txt`, (erro) => {
                if (erro) {
                    console.log('Falha ao remover produtos', erro);

                    res.statusCode = 500;

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao remover o produtos ${produtos.nome}`
                        }
                    };

                    res.end(JSON.stringify(resposta));

                    return;
                }

                res.statusCode = 200;

                const resposta = {
                    mensagem: `Produto ${produtos.nome} removido com sucesso`
                };
                res.end(JSON.stringify(resposta));

                return;
                });

            });

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
    res.statusCode = 404;

    const resposta = {
        erro: {
            mensagem: 'Rota não encontrada!',
            url: req.url
        }
    };

    res.end(JSON.stringify(resposta));
}