from db import mysql

class ClienteController: 
    @staticmethod
    def cadastrar(nome, email, senha, telefone, sexo, rg, cpf, dataNascimento, estadoCivil, dataCadastro):
        cursor = mysql.connection.cursor()
        cursor.execute("insert into cliente (" \
        "nome, " \
        "email, " \
        "senha, " \
        "telefone, " \
        "sexo, " \
        "rg, " \
        "cpf, " \
        "dataNascimento, " \
        "estadoCivil, " \
        "dataCadastro) values (" \
        "%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (nome, email, senha, telefone, sexo, rg, cpf, dataNascimento, estadoCivil, dataCadastro))
        mysql.connection.commit()
        cursor.close()