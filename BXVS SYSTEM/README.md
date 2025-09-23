# BXVS SYSTEM

Projeto desenvolvido em **Python (Flask)** no backend e **HTML/CSS** no frontend.

---

## 🚀 Tecnologias
- Python 3.10+
- Flask
- HTML5
- CSS3

---

## 📂 Estrutura do projeto + ⚙️ Como rodar
```bash
BXVS
├── .vscode/
├── banco_dados/
│   └── scripts.sql
├── codigo_fonte/
│   ├── backend/
│   │   ├── __pycache__/
│   │   ├── controllers/
│   │   ├── app.py
│   │   └── db.py
│   ├── BXVS_desktop/
│   │   ├── web/
│   │   ├── app.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── __pycache__/
│       ├── static/
│       ├── templates/
│       └── requirements.txt
├── documentação/
└── README.md


# 🔧 Como rodar o projeto

# Clonar o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

# Abrir o CMD no diretório do projeto

# Criar a pasta do ambiente virtual
python -m venv venv

# Ativar o ambiente virtual
.\venv\Scripts\activate

# Instalar dependências (requirements dentro de codigo_fonte)
pip install -r codigo_fonte/requirements.txt

# Setar variáveis de ambiente
set FLASK_APP=codigo_fonte/backend/app.py
set FLASK_DEBUG=1

# Rodar o servidor
flask run
