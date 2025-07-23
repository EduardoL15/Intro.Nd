import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize ({
    dialect: 'sqlite',
    Storage: './tic.db'
});

sequelize.authenticate();

export const Produto = sequelize.define('produto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true  
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false  
    }
});

export async function criaProduto(produto) {
    try{
        const resultado = await Produto.create(produto);
    console.log(`O produto ${resultado.nome} foi criado com sucesso!`);
    return resultado;
    } catch(erro) {
        console.log('Erro ao criar o produto', erro);
        throw erro;
    } 
}
export async function leProduto() {
    try{
        const resultado = await Produto.findAll();
    console.log(`Produtos consultados com sucesso!`, resultado);
    return resultado;
    } catch(erro) {
        console.log('Erro ao buscar produto', erro);
        throw erro;
    }
}
export async function leProdutoporid(id) {
    try{
        const resultado = await Produto.findByPk(id);
    console.log(`Produto consultado com sucesso!`, resultado);
    return resultado;
    } catch(erro) {
        console.log('Erro ao buscar o produto', erro);
        throw erro;
    }
}
export async function atualizaProdutoporid(id, dadosProduto) {
    try{
        const resultado = await Produto.findByPk(id);
        if(resultado?.id){
            for (const chave in dadosProduto) {
                if(chave in resultado) {
                    resultado[chave] = dadosProduto[chave];
                }
            }
            resultado.save();
            console.log(`Produto atualizado com sucesso!`, resultado);
        }
    return resultado;
    } catch(erro) {
        console.log('Erro ao atualizar o produto', erro);
        throw erro;
    }
}
export async function deletaProdutoporid(id) {
    try{
        const resultado = await Produto.destroy({ where: { id: id }});
    console.log(`Produto deletado com sucesso!`, resultado);
    } catch(erro) {
        console.log('Erro ao deletar o produto', erro);
        throw erro;
    }
}