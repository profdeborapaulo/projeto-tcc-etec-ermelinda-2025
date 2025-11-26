#  **BuscaFarma**

**BuscaFarma** é um sistema disponibilizado em versões **web** e **desktop**, desenvolvido para facilitar a busca por medicamentos e aprimorar o controle de estoque em organizações farmacêuticas — como farmácias da rede privada ou postos públicos de saúde.

---

##  **Estrutura do Repositório**

```
/BuscaFarma/
├── README.md
├── Artigo_Cientifíco_Buscafarma.pdf
├── documentacao/
│   ├── Requisitos.pdf
│   ├── manual_usuario.pdf
│   ├── manual_desenvolvedor.pdf
│   └── diagramas/
│       ├── ER
│       │   ├── IMG
│       │   │   ├── DER_BuscaFarma.png
│       │   │   ├── ER-BuscaFarma.png
│       │   │   └── MER_BuscaFarma.png
│       │   └── PDF
│       │       ├── DER_BuscaFarma.pdf
│       │       ├── ER_BuscaFarma.pdf
│       │       └── MER_BuscaFarma.pdf
│       └── UML
│           ├── IMG
│           │   ├── Diagrama UML-Caso de uso - Farmácia.drawio.png
│           │   ├── Diagrama UML-Caso de uso - Usuário.drawio.png
│           │   └── Diagrama UML-Classe.png
│           └── PDF
│               ├── ClassDiagram_BuscaFarma.pdf
│               ├── UseCaseDiagram_PHARMACY.pdf
│               └── UseCaseDiagram_USER.pdf
├── codigo_fonte/
│   ├── BF-Frontend-Desktop/
│   ├── BuscaFarma-Backend/
│   └── BuscaFarma-Frontend-Web/
├── banco_de_dados/
│   └── buscaFarmaBD.sql
└── demonstracao/
    ├── Desktop
    │   └── Vídeo_BuscaFarma_Desktop.mp4
    └── Web
        └── Vídeo_BuscaFarma_Web.mp4
```

---

##  **Descrição das Pastas e Arquivos**

### ** README.md**

Instruções gerais e visão completa do projeto.

### ** Artigo_Cientifíco_Buscafarma.pdf**

Trabalho acadêmico (TCC) completo, formatado segundo normas ABNT.

### ** Documentação (`/documentacao/`)**

* **Requisitos.pdf** — Requisitos funcionais e não funcionais.
* **manual_usuario.pdf** — Guia para o usuário final.
* **manual_desenvolvedor.pdf** — Arquitetura, tecnologias e manutenção.
* **diagramas/** — Diagramas ER, MER, DER e UML (classes e casos de uso), em PNG e PDF.

### ** Código-Fonte (`/codigo_fonte/`)**

* **BF-Frontend-Desktop/** — Aplicação Desktop (Electron + Vite).
* **BuscaFarma-Backend/** — API REST com autenticação, estoque e integrações.
* **BuscaFarma-Frontend-Web/** — Aplicação Web (React + Vite).

### ** Banco de Dados (`/banco_de_dados/`)**

* **buscaFarmaBD.sql** — Script SQL completo para criação e carga inicial.

### ** Demonstração (`/demonstracao/`)**

* Vídeo demonstrativo da versão **Desktop**.
* Vídeo demonstrativo da versão **Web**.

---

#  **Execução do Projeto**

Siga os passos abaixo para rodar o sistema completo (backend, web e desktop).

---

##  **1. Configuração do `.env`**

Cada módulo tem seu próprio arquivo `.env`.
Organize conforme sua necessidade.

---

### **Backend — Exemplo de `.env`**

```
APP_NAME="BuscaFarma"
ENVIRONMENT="dev"
UPLOAD_LOCATION=C:\buscafarma_uploads
USER_IMAGE_UPLOAD_FOLDER=
API_VERSION=1
API_PORT=8088
MAINTENANCE=false

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=root
DB_NAME=buscafarma

JWT_SECRET=e412d9f41ee3608f135d70cefff0c2e6aeaa3a670747185ecf768fd282effe55798fd6b2210c26bb43bced49753092b6bcfa9b6226aa567efbbdf72c10ab961f

ANVISA_API_URI=https://bula.landin.dev.br/busca

SMTP_HOST=smtp.gmail.com
SMTP_USER=buscafarma07@gmail.com
SMTP_PASS=zzrm mkwi jupl qlir
SMTP_SECURE=TLS
SMTP_PORT=587
SMTP_CHARSET=UTF-8
```

---

### **Frontends (Web e Desktop) — Exemplo de `.env`**

```
VITE_API_URL=http://localhost:8088
```

---

##  **2. Configurar o Banco de Dados**

Importe:

```
banco_de_dados/buscaFarmaBD.sql
```

No MySQL Workbench, phpMyAdmin ou CLI.

---

##  **3. Clonar os repositórios**

Clone cada parte do sistema:

```
BF-Frontend-Desktop/
BuscaFarma-Backend/
BuscaFarma-Frontend-Web/
```

---

##  **4. Instalar dependências**

Em **cada pasta**, execute:

```
npm install
```

ou

```
npm i
```

---

##  **5. Executar o projeto**

### **Backend**

```
npm start
```

### **Frontend Web**

```
npm run dev
```

### **Frontend Desktop**

```
npm run dev
```