import webview
import mysql.connector
from datetime import date, datetime, timedelta

class Api:
    def conectar(self):
        return mysql.connector.connect(
            host="localhost",
            user="root",        # seu usuário MySQL
            password="root",        # sua senha MySQL
            database="academia" # banco criado
        )

    def listar_alunos(self):
        conn = self.conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM cliente")
        clientes = cursor.fetchall()
        conn.close()
        for c in clientes:
            for key, value in c.items():
                if isinstance(value, (date, datetime)):
                    c[key] = value.isoformat()  # ou .strftime("%d/%m/%Y")
        return clientes
    
    def listaControleAcesso(self):
        conn = self.conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM controleAcesso")
        checkins = cursor.fetchall()
        conn.close()
        for c in checkins:
            for key, value in c.items():
                if isinstance(value, (date, datetime)):
                    c[key] = value.isoformat()  # ou value.strftime("%d/%m/%Y %H:%M:%S")
                elif isinstance(value, timedelta):
                # converte para string no formato HH:MM:SS
                    total_seconds = int(value.total_seconds())
                    hours, remainder = divmod(total_seconds, 3600)
                    minutes = divmod(remainder, 60)
                    c[key] = f"{hours:02d}:{minutes:02d}"
        return checkins
    
if __name__ == "__main__":
    api = Api()
    window = webview.create_window("Sistema da Academia", "web/index.html", js_api=api)
    webview.start(lambda: window.maximize())