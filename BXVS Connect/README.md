<<<<<<< HEAD
# Estrutura do Projeto

Esta é a organização completa dos diretórios e arquivos do projeto.

``` bash
.
├── banco_de_dados/
│   └── scripts.sql
├── codigo_fonte/
│   ├── backend/
│   │   ├── app.py
│   │   ├── db.py
│   │   ├── requirements.txt
│   │   ├── routes.py   
│   │   
│   │   
│   │   
│   │      
│   │      
│   │      
│   │      
│   │       
│   └── frontend/
│       ├── desktop/
│       │   ├── build/
│       │   ├── node_modules/
│       │   ├── public/
│       │   ├── src/
│       │   ├── .gitignore
│       │   ├── package-lock.json
│       │   ├── package.json
│       │   └── README.md
│       └── web/
│           ├── build/
│           ├── node_modules/
│           ├── public/
│           ├── src/
│           ├── .gitignore
│           ├── package-lock.json
│           ├── package.json
│           └── README.md
├── documentacao/
│   └── diagramas/
│       ├── Caso_de_uso.png
│       ├── Diagrama_de_cl...
│       └── ER.mwb
├── Requisitos.pdf
└── README.md


## Configuração do Ambiente de Desenvolvimento

Para que o projeto funcione corretamente após o clone, você precisará instalar as dependências em cada um dos quatro módulos (`backend/desktop`, `backend/web`, `frontend/desktop`, `frontend/web`).

O **frontend** utiliza **React** e requer a instalação dos pacotes Node.js especificados no **`package.json`** usando o **`npm`**.

* **Instalação de Dependências:**
    Acesse cada um dos diretórios e execute o comando de instalação:

    ```bash
    # Para o Frontend Sitema
    cd codigo_fonte/frontend/desktop/
    npm install
    npm start

    # Para o Frontend Web
    cd ../web/
    npm install
    npm start
    ```