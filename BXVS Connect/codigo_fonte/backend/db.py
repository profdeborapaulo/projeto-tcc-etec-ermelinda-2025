import mysql.connector

def conectar():
    """Cria uma conexão com o banco de dados MySQL"""
    return mysql.connector.connect(
        host="JoaoFarias16.mysql.pythonanywhere-services.com",
        user="JoaoFarias16",
        password="Jv40028922",
        database="JoaoFarias16$default"
    )
