# routes_biometria.py
from flask import Blueprint, jsonify, request, current_app
from db import conectar
import mercadopago
import os
import traceback
import base64
from datetime import date, datetime, timedelta
import math
import json

routes = Blueprint("routes", __name__)

# Inicializa Mercado Pago com Access Token de ambiente (sandbox ou produção)
MP_ENV = os.getenv("MP_ENV", "prod")  # "sandbox" ou "prod"

if MP_ENV == "prod":
    MP_ACCESS_TOKEN = os.getenv("MP_PROD_TOKEN", "APP_USR-4589833853377503-101818-580ece2e95c8406e1b65bc74a38df236-2933430400")
else:
    MP_ACCESS_TOKEN = os.getenv("MP_SANDBOX_TOKEN", "TEST-3888406908883979-102107-f546a081597f1a4e9dddbeae48d96753-488847583")

mp = mercadopago.SDK(MP_ACCESS_TOKEN)

# URLs de retorno do checkout (configuráveis via ambiente)
MP_SUCCESS_URL = os.getenv("MP_SUCCESS_URL", "https://bxvs-parnaiba.vercel.app/matricula")
MP_FAILURE_URL = os.getenv("MP_FAILURE_URL", "https://bxvs-parnaiba.vercel.app/matricula?status=failure")
MP_PENDING_URL = os.getenv("MP_PENDING_URL", "https://bxvs-parnaiba.vercel.app/matricula?status=pending")
API_KEY = "WwZH8ld_UkUu0HBFmLZ2NRuuQ3G8b2At"
API_SECRET = "aam4AX8LtD-U9iJdFH-cvONFLDBo0xuh"
FACE_API_URL = "https://api-us.faceplusplus.com/facepp/v3/compare"


# ---------------- Página inicial (React build) ----------------
@routes.route("/")
def home():
    return "Raiz"

@routes.route("/checkin", methods=["POST"])
def checkin():
    data = request.get_json()
    idCliente = data.get("idCliente")

    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    # Pega a data de hoje (YYYY-MM-DD)
    cursor.execute("SET time_zone = 'America/Sao_Paulo'")
    cursor.execute("""
        SELECT * FROM checkin
        WHERE fkCliente = %s AND DATE(dataHoraEntrada) = CURDATE()
        ORDER BY idCheckin DESC LIMIT 1
    """, (idCliente,))
    registro = cursor.fetchone()

    # Se já existe entrada hoje
    if registro:
        # Se não tem saída → fazer CHECK-OUT
        if registro["dataHoraSaida"] is None:
            cursor.execute("""
                UPDATE checkin
                SET dataHoraSaida = NOW()
                WHERE idCheckin = %s
            """, (registro["idCheckin"],))
            conn.commit()
            return jsonify({
                "status": "checkout",
                "msg": "Check-out realizado com sucesso",
                "idCheckin": registro["idCheckin"]
            })
        else:
            # Já fez check-in e check-out hoje
            return jsonify({
                "status": "already_done",
                "msg": "Você já realizou check-in e check-out hoje",
                "idCheckin": registro["idCheckin"]
            })

    # Se NÃO existe entrada hoje → fazer CHECK-IN
    cursor.execute("""
        INSERT INTO checkin (fkCliente)
        VALUES (%s)
    """, (idCliente,))
    conn.commit()

    return jsonify({
        "status": "checkin",
        "msg": "Check-in realizado com sucesso",
        "idCheckin": cursor.lastrowid
    })



@routes.route("/validar-face", methods=["POST"])
def validar_face():
    data = request.get_json()
    encoding_novo = data.get("encoding")

    # Validação do front
    if not encoding_novo or not isinstance(encoding_novo, list):
        return jsonify({"erro": "encoding (lista de floats) é obrigatório"}), 400

    conn = conectar()
    cur = conn.cursor()
    cur.execute("""
        SELECT idCliente, nome, face_embedding
        FROM cliente
        WHERE face_embedding IS NOT NULL
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    melhor = None
    menor_dist = float("inf")

    # Distância euclidiana sem numpy
    def euclidean(a, b):
        soma = 0.0
        for i in range(len(a)):
            soma += (a[i] - b[i]) ** 2
        return soma ** 0.5

    for row in rows:
        db_id, db_nome, db_embedding_json = row

        # Ignorar clientes que não têm encoding salvo
        if not db_embedding_json:
            continue

        try:
            db_encoding = json.loads(db_embedding_json)
        except:
            continue

        # Ignorar se o vetor tiver tamanho diferente
        if len(db_encoding) != len(encoding_novo):
            continue

        dist = euclidean(db_encoding, encoding_novo)

        if dist < menor_dist:
            menor_dist = dist
            melhor = {
                "idCliente": db_id,
                "nome": db_nome,
                "distancia": dist
            }

    # LIMIAR — ajuste depois conforme os testes
    THRESHOLD = 0.5  # recomendado para face-api.js
    if melhor and menor_dist < THRESHOLD:
        return jsonify({"match": True, "cliente": melhor})
    else:
        return jsonify({"match": False, "melhor": melhor, "menor_dist": menor_dist})


# ---------------- Listar planos ----------------
@routes.route("/api/planos", methods=["GET"])
def listar_planos():
    conn = None
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM plano")
        planos = cursor.fetchall()
        return jsonify(planos)
    except Exception as e:
        return jsonify({"message": "Erro ao buscar planos", "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@routes.route("/api/mercadopago/checkout/<int:id_plano>", methods=["POST"])
def checkout_plano(id_plano):
    conn = None
    try:
        data = request.get_json() or {}
        cupom = data.get("cupom", "")
        id_cliente = data.get("idCliente")

        if not id_cliente:
            return jsonify({"message": "Campo 'id_cliente' é obrigatório"}), 400

        print("[DEBUG] Dados recebidos do frontend:", data)

        conn = conectar()
        cursor = conn.cursor(dictionary=True)

        # Busca plano
        cursor.execute("SELECT * FROM plano WHERE idPlano=%s", (id_plano,))
        plano = cursor.fetchone()
        if not plano:
            return jsonify({"message": "Plano não encontrado"}), 404

        preco = float(plano["preco"])
        if cupom:
            try:
                preco -= preco * (float(cupom) / 100)
            except ValueError:
                pass

        print("[DEBUG] Preço final do plano ({}): {}".format(plano['nome'], preco))

        # Cria matrícula
        hoje = datetime.now().date()
        data_fim = hoje + timedelta(days=30)  # exemplo: validade de 1 mês
        cursor.execute(
            "INSERT INTO matricula (dataInicio, dataFim, _status, fkCliente, fkPlano) VALUES (%s,%s,%s,%s,%s)",
            (hoje, data_fim, "Pendente", id_cliente, id_plano)
        )
        conn.commit()
        id_matricula = cursor.lastrowid
        print("[DEBUG] Matrícula criada com id:", id_matricula)

        # Cria pagamento inicial
        cursor.execute(
            "INSERT INTO pagamento (valor, metodo, _status, fkMatricula) VALUES (%s,%s,%s,%s)",
            (preco, "MercadoPago", "Pendente", id_matricula)
        )
        conn.commit()
        id_pagamento = cursor.lastrowid
        print("[DEBUG] Pagamento criado com id:", id_pagamento)

        # Cria checkout no Mercado Pago
        preference_data = {
            "items": [
                {
                    "title": plano["nome"],
                    "quantity": 1,
                    "unit_price": round(preco, 2),
                    "currency_id": "BRL",
                    "description": plano["descricao"]
                }
            ],
            "back_urls": {
                "success": MP_SUCCESS_URL,
                "failure": MP_FAILURE_URL,
                "pending": MP_PENDING_URL
            },
            "notification_url": "https://joaofarias16.pythonanywhere.com/api/mercadopago/webhook",
            "auto_return": "approved",
            "external_reference": str(id_matricula)
        }

        response = mp.preference().create(preference_data)
        print("[DEBUG] Resposta do Mercado Pago:", response)

        init_point = response.get("response", {}).get("init_point")
        if not init_point:
            print("[ERROR] init_point não encontrado na resposta do Mercado Pago")
            return jsonify({"message": "Erro ao criar checkout", "error": "init_point não encontrado"}), 500

        return jsonify({
            "init_point": init_point,
            "id_matricula": id_matricula,
            "id_pagamento": id_pagamento
        })

    except Exception as e:
        current_app.logger.error(f"Erro ao criar checkout Mercado Pago: {traceback.format_exc()}")
        return jsonify({"message": "Erro ao criar checkout", "error": str(e)}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/api/mercadopago/processar_pagamento", methods=["POST"])
def processar_pagamento():
    try:
        data = request.get_json()
        payment_id = data.get("payment_id")
        external_reference = data.get("external_reference")  # id da matrícula
        payment_type = data.get("payment_type")
        payment_status = data.get("status")

        if not payment_id or not external_reference or not payment_status:
            return jsonify({"message": "Campos obrigatórios ausentes"}), 400

        # 🔹 Traduzir o tipo de pagamento (vem em inglês)
        tipo_pagamento_map = {
            "credit_card": "Cartão",
            "debit_card": "Cartão",
            "account_money": "Pix",
            "pix": "Pix",
            "ticket": "Boleto",
            "cash": "Dinheiro"
        }
        metodo_pagamento = tipo_pagamento_map.get(payment_type, "Dinheiro")

        conn = conectar()
        cursor = conn.cursor()

        if payment_status.lower() in ["approved", "paid"]:
            # Atualiza pagamento e matrícula para Pago / Ativa
            cursor.execute(
                """
                UPDATE pagamento
                SET _status='Pago', metodo=%s, dataPagamento=NOW()
                WHERE fkMatricula=%s
                """,
                (metodo_pagamento, external_reference)
            )
            cursor.execute(
                "UPDATE matricula SET _status='Ativa' WHERE idMatricula=%s",
                (external_reference,)
            )

        elif payment_status.lower() == "pending":
            cursor.execute(
                """
                UPDATE pagamento
                SET _status='Pendente', metodo=%s
                WHERE fkMatricula=%s
                """,
                (metodo_pagamento, external_reference)
            )
            cursor.execute(
                "UPDATE matricula SET _status='Pendente' WHERE idMatricula=%s",
                (external_reference,)
            )

        else:
            # Outros casos (falhou, cancelado, etc.)
            cursor.execute(
                """
                UPDATE pagamento
                SET _status='Atrasado', metodo=%s
                WHERE fkMatricula=%s
                """,
                (metodo_pagamento, external_reference)
            )
            cursor.execute(
                "UPDATE matricula SET _status='Inativa' WHERE idMatricula=%s",
                (external_reference,)
            )

        conn.commit()
        return jsonify({"message": "Pagamento processado com sucesso"}), 200

    except Exception as e:
        return jsonify({"message": "Erro ao processar pagamento", "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@routes.route("/api/mercadopago/status_pagamento", methods=["GET"])
def status_pagamento():
    external_reference = request.args.get("external_reference")  # id da matrícula
    if not external_reference:
        return jsonify({"message": "'external_reference' é obrigatório"}), 400

    conn = None
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT _status FROM pagamento WHERE fkMatricula=%s", (external_reference,))
        pagamento = cursor.fetchone()

        if not pagamento:
            return jsonify({"message": "Pagamento não encontrado"}), 404

        is_pago = pagamento["_status"].lower() == "pago"
        return jsonify({"pago": is_pago})

    except Exception as e:
        return jsonify({"message": "Erro ao buscar status do pagamento", "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@routes.route("/cupom", methods=["POST"])
def aplicar_cupom():
    conn = conectar()
    data = request.get_json()
    codigo = data.get("codigo")

    if not codigo:
        return jsonify({"erro": "Código do cupom é obrigatório"}), 400

    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cupom WHERE codigo = %s AND ativo = 1", (codigo,))
    cupom = cursor.fetchone()

    if not cupom:
        return jsonify({"erro": "Cupom inválido."}), 404

    hoje = datetime.now().date()
    if cupom["data_expiracao"] and hoje > cupom["data_expiracao"]:
        return jsonify({"erro": "Cupom expirado."}), 400

    if cupom["usos_atual"] >= cupom["usos_maximos"]:
        return jsonify({"erro": "Limite de uso atingido."}), 400

    # Atualiza usos
    cursor.execute("UPDATE cupom SET usos_atual = usos_atual + 1 WHERE id = %s", (cupom["id"],))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "sucesso": True,
        "tipo": cupom["tipo"],
        "valor": float(cupom["valor"])
    })


# ---------------- Cadastrar novo cliente ----------------

@routes.route("/cliente", methods=["POST"])
def cadastrar_cliente():
    try:
        data = request.get_json()
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor()
        sql = """
        INSERT INTO cliente (nome, email, senha, telefone, sexo, rg, cpf, dataNascimento, estadoCivil, endereco, dataCadastro)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """
        cursor.execute(sql, (
            data["nome"], data["email"], data["senha"], data["telefone"],
            data["sexo"], data["rg"], data["cpf"], data["dataNascimento"], data["estadoCivil"], data["endereco"]
        ))
        conn.commit()
        return jsonify({"message": "Cliente cadastrado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"message": "Erro ao cadastrar cliente", "error": str(e)}), 500

@routes.route("/cliente/<int:id>", methods=["GET"])
def buscarCliente(id):
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM dadosMatriculaCliente WHERE idCliente = %s", (id,))
        cliente = cursor.fetchone()

        if not cliente:
            return jsonify({"message": "Cliente não encontrado"}), 404

        # 🧠 Tratamento e formatações dos dados
        for campo, valor in cliente.items():
            if valor is None:
                continue

            # 🔹 Converte bytes (ex: face_embedding) para base64
            if isinstance(valor, bytes):
                cliente[campo] = base64.b64encode(valor).decode("utf-8")
                continue

            # 🔹 Converte objetos datetime ou date para formato brasileiro
            if isinstance(valor, (datetime, date)):
                if campo in ["dataPagamento", "dataVencimento"]:
                    cliente[campo] = valor.strftime("%d/%m/%Y")
                else:
                    cliente[campo] = valor.strftime("%Y-%m-%d")
                continue

            # 🔹 Trata strings que são datas em formato DD/MM/YYYY
            if isinstance(valor, str):
                try:
                    if "/" in valor:
                        if campo in ["dataPagamento", "dataVencimento"]:
                            cliente[campo] = valor[:10]
                        else:
                            cliente[campo] = datetime.strptime(valor[:10], "%d/%m/%Y").strftime("%Y-%m-%d")
                except ValueError:
                    pass  # ignora se não for data
                continue

            # 🔹 Formata valores monetários
            if campo in ["valorPlano", "valorPago"]:
                try:
                    cliente[campo] = f"{float(valor):.2f}".replace(".", ",")
                except (ValueError, TypeError):
                    pass

        return jsonify(cliente), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/adm", methods=["POST"])
def buscarAdm():
    conn = None
    try:
        data = request.get_json()
        email = data.get("usuario")
        senha = data.get("cod")
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM administrador WHERE email = %s and senha = %s", (email, senha,))
        administrador = cursor.fetchone()

        if not administrador:
            return jsonify({"message": "Cliente não encontrado"}), 404


        return jsonify(administrador), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/adm/<int:idProfessor>", methods=["PUT"])
def atualizarProfessor(idProfessor):
    try:
        data = request.get_json()
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor()
        sql = """
        UPDATE administrador
        SET nome = %s,
            email = %s,
            senha = %s,
            tema = %s,
            corPrimaria = %s,
            idioma = %s,
            mostrarDataHora = %s,
            fusoHorario = %s,
            notificacoes = %s
            WHERE idProfessor = %s
        """
        valores = (
            data["nome"], data["email"], data["senha"],
            data["tema"], data["corPrimaria"], data["idioma"], data["mostrarDataHora"], data["fusoHorario"], data["notificacoes"],
            idProfessor
        )

        cursor.execute(sql, valores)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Cliente não encontrado"}), 404

        return jsonify({"message": "Cliente atualizado com sucesso!"}), 200

    except Exception as e:
        return jsonify({"message": "Erro ao atualizar cliente", "error": str(e)}), 500

@routes.route("/gestaoAlunos/alunos", methods=["GET"])
def listaGestaoAlunos():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM dadosMatriculaCliente")  # 🔹 sem filtro de id
        clientes = cursor.fetchall()

        if not clientes:
            return jsonify([]), 200  # lista vazia ao invés de erro 404


        # 🧠 Tratamento e formatações dos dados
        for cliente in clientes:
            for campo, valor in cliente.items():
                if valor is None:
                    continue

                # 🔹 Converte bytes (ex: face_embedding) para base64
                if isinstance(valor, bytes):
                    cliente[campo] = base64.b64encode(valor).decode("utf-8")
                    continue

                # 🔹 Converte datetime ou date para formato brasileiro
                if isinstance(valor, (datetime, date)):
                    if campo in ["dataPagamento", "dataVencimento"]:
                        cliente[campo] = valor.strftime("%d/%m/%Y")
                    else:
                        cliente[campo] = valor.strftime("%Y-%m-%d")
                    continue

                # 🔹 Trata strings que são datas
                if isinstance(valor, str):
                    try:
                        if "/" in valor:
                            if campo in ["dataPagamento", "dataVencimento"]:
                                cliente[campo] = valor[:10]
                            else:
                                cliente[campo] = datetime.strptime(valor[:10], "%d/%m/%Y").strftime("%Y-%m-%d")
                    except ValueError:
                        pass
                    continue

                # 🔹 Formata valores monetários
                if campo in ["valorPlano", "valorPago"]:
                    try:
                        cliente[campo] = f"{float(valor):.2f}".replace(".", ",")
                    except (ValueError, TypeError):
                        pass

        return jsonify(clientes), 200  # 🔹 retorna a lista completa

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar clientes: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/gestaoAlunos/pesquisa/<string:txtPesquisa>", methods=["GET"])
def listaPesquisa(txtPesquisa):
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM dadosMatriculaCliente where nome like %s", (f"%{txtPesquisa}%",))  # 🔹 sem filtro de id
        clientes = cursor.fetchall()

        if not clientes:
            return jsonify({"message": "Nenhum cliente encontrado"}), 200

        # 🧠 Tratamento e formatações dos dados
        for cliente in clientes:
            for campo, valor in cliente.items():
                if valor is None:
                    continue

                # 🔹 Converte bytes (ex: face_embedding) para base64
                if isinstance(valor, bytes):
                    cliente[campo] = base64.b64encode(valor).decode("utf-8")
                    continue

                # 🔹 Converte datetime ou date para formato brasileiro
                if isinstance(valor, (datetime, date)):
                    if campo in ["dataPagamento", "dataVencimento"]:
                        cliente[campo] = valor.strftime("%d/%m/%Y")
                    else:
                        cliente[campo] = valor.strftime("%Y-%m-%d")
                    continue

                # 🔹 Trata strings que são datas
                if isinstance(valor, str):
                    try:
                        if "/" in valor:
                            if campo in ["dataPagamento", "dataVencimento"]:
                                cliente[campo] = valor[:10]
                            else:
                                cliente[campo] = datetime.strptime(valor[:10], "%d/%m/%Y").strftime("%Y-%m-%d")
                    except ValueError:
                        pass
                    continue

                # 🔹 Formata valores monetários
                if campo in ["valorPlano", "valorPago"]:
                    try:
                        cliente[campo] = f"{float(valor):.2f}".replace(".", ",")
                    except (ValueError, TypeError):
                        pass

        return jsonify(clientes), 200  # 🔹 retorna a lista completa

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar clientes: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()


@routes.route("/estatisticasGestaoAlunos", methods=["GET"])
def buscarClientes():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM estatisticasGestaoAlunos")
        estatisticas = cursor.fetchone()

        if not estatisticas:
            return jsonify({"message": "Cliente não encontrado"}), 404

        return jsonify(estatisticas), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/gestaoAlunos/notaInterna/<int:idCliente>", methods=["PUT"])
def notaInterna(idCliente):
    try:
        data = request.get_json()
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor()
        sql = """
        UPDATE cliente
        SET notaInterna = %s
        WHERE idCliente = %s
        """
        valores = (
            data["notaInterna"], idCliente
        )

        cursor.execute(sql, valores)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Cliente não encontrado"}), 404

        return jsonify({"message": "Cliente atualizado com sucesso!"}), 200

    except Exception as e:
        return jsonify({"message": "Erro ao atualizar cliente", "error": str(e)}), 500

@routes.route("/dashboard/receitaTotal", methods=["GET"])
def receitaTotal():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT sum(valor) receitaTotal FROM pagamento")
        dados = cursor.fetchone()

        if not dados:
            return jsonify({"message": "Receita vazia", "receitaTotal": 0}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/lucroMensal", methods=["GET"])
def lucroMensal():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT sum(valor) as lucroMensal FROM pagamento where month(dataPagamento) = month(now())")
        dados = cursor.fetchone()

        if not dados:
            return jsonify({"message": "Não há lucro mensal"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/pagamentosPendentes", methods=["GET"])
def pagamentosPendentes():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT count(_status) as pagamentosPendentes from pagamento where _status = 'Pendente'")
        dados = cursor.fetchone()

        if not dados:
            return jsonify({"message": "Sem pagamentos pendentes"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/matriculasMes", methods=["GET"])
def matriculasMes():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT count(idMatricula) as matriculasMes from matricula where month(dataInicio) = month(now())")
        dados = cursor.fetchone()

        if not dados:
            return jsonify({"message": "Nenhume matrícula nove nesse mês"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/planosMaisEscolhidos", methods=["GET"])
def planosMaisEscolhidos():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT p.nome AS nomePlano, COUNT(m.idMatricula) AS quantidadeEscolhido FROM plano p LEFT JOIN matricula m ON m.fkPlano = p.idPlano GROUP BY p.idPlano, p.nome ORDER BY quantidadeEscolhido DESC")
        dados = cursor.fetchall()

        if not dados:
            return jsonify({"message": "Sem planos contratados"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/faturamentoMes", methods=["GET"])
def faturamentoMes():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT LEFT(DATE_FORMAT(dataPagamento, '%M'), 3) AS mes, SUM(valor) AS faturamento FROM pagamento WHERE _status = 'Pago' AND YEAR(dataPagamento) = YEAR(CURDATE()) GROUP BY MONTH(dataPagamento) ORDER BY MONTH(dataPagamento);")
        dados = cursor.fetchall()

        if not dados:
            return jsonify({"message": "Ainda não hove faturamento"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/movimentoSemanal", methods=["GET"])
def movimentoSemanal():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
    SELECT
        LEFT(DATE_FORMAT(cal.dia, '%W'), 3) AS diaSemana,

        COUNT(CASE WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), p.diasPermitidos) THEN 1 END) AS possiveis,

        COUNT(CASE WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), p.diasPermitidos) AND ch.idCheckin IS NOT NULL THEN 1 END) AS presencas,

        ROUND(
            IF(
                COUNT(CASE WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), p.diasPermitidos) THEN 1 END) = 0,
                0,
                COUNT(CASE WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), p.diasPermitidos) AND ch.idCheckin IS NOT NULL THEN 1 END)
                /
                COUNT(CASE WHEN FIND_IN_SET(DAYOFWEEK(cal.dia), p.diasPermitidos) THEN 1 END)
                * 100
            )
        , 2) AS porcentagem

    FROM calendario cal
    JOIN matricula m
        ON m.dataInicio <= cal.dia
        AND m.dataFim >= cal.dia
        AND m._status = 'Ativa'
    JOIN plano p
        ON p.idPlano = m.fkPlano
    LEFT JOIN checkin ch
        ON ch.fkCliente = m.fkCliente
        AND DATE(ch.dataHoraEntrada) = cal.dia
    WHERE cal.dia BETWEEN
        (CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY)
        AND (CURDATE() + INTERVAL (6 - WEEKDAY(CURDATE())) DAY)
    GROUP BY cal.dia
    ORDER BY cal.dia;
""")

        dados = cursor.fetchall()

        if not dados:
            return jsonify({"message": "Sem movimento esta semana"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/movimentoTurno", methods=["GET"])
def movimentoTurno():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
    SELECT
        turno,

        -- Quantidade de alunos que poderiam vir hoje neste turno
        (
            SELECT COUNT(*)
            FROM matricula m
            JOIN plano p ON p.idPlano = m.fkPlano
            WHERE m._status = 'Ativa'
              AND CURDATE() BETWEEN m.dataInicio AND m.dataFim
              AND FIND_IN_SET(DAYOFWEEK(CURDATE()), p.diasPermitidos)
        ) AS possiveis,

        -- Quantidade de alunos que de fato fizeram check-in no turno
        (
            SELECT COUNT(*)
            FROM checkin ch
            WHERE DATE(ch.dataHoraEntrada) = CURDATE()
              AND (
                    (turno = 'Manhã' AND TIME(ch.dataHoraEntrada) BETWEEN '05:00:00' AND '11:59:59') OR
                    (turno = 'Tarde' AND TIME(ch.dataHoraEntrada) BETWEEN '12:00:00' AND '17:59:59') OR
                    (turno = 'Noite' AND TIME(ch.dataHoraEntrada) BETWEEN '18:00:00' AND '23:59:59')
                  )
        ) AS presencas,

        -- Porcentagem como FLOAT
        ROUND(
            (
                (
                    SELECT COUNT(*)
                    FROM checkin ch
                    WHERE DATE(ch.dataHoraEntrada) = CURDATE()
                      AND (
                            (turno = 'Manhã' AND TIME(ch.dataHoraEntrada) BETWEEN '05:00:00' AND '11:59:59') OR
                            (turno = 'Tarde' AND TIME(ch.dataHoraEntrada) BETWEEN '12:00:00' AND '17:59:59') OR
                            (turno = 'Noite' AND TIME(ch.dataHoraEntrada) BETWEEN '18:00:00' AND '23:59:59')
                          )
                ) * 100.0
                /
                NULLIF(
                    (
                        SELECT COUNT(*)
                        FROM matricula m
                        JOIN plano p ON p.idPlano = m.fkPlano
                        WHERE m._status = 'Ativa'
                          AND CURDATE() BETWEEN m.dataInicio AND m.dataFim
                          AND FIND_IN_SET(DAYOFWEEK(CURDATE()), p.diasPermitidos)
                    )
                , 0)
            )
        , 2) AS porcentagem

    FROM (
        SELECT 'Manhã' AS turno
        UNION SELECT 'Tarde'
        UNION SELECT 'Noite'
    ) AS turnos;
""")

        dados = cursor.fetchall()

        if not dados:
            return jsonify({"message": "Não hove mevimento hoje"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/publico", methods=["GET"])
def publico():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
  s.sexo AS name,
  COALESCE(c.total, 0) AS total,
  (ROUND(
      COALESCE(c.total, 0) / NULLIF(t.total_all, 0) * 100,
      0
  ) + 0) AS valor
FROM (SELECT 'Masculino' AS sexo UNION ALL SELECT 'Feminino') s
LEFT JOIN (
    SELECT
      CASE
        WHEN LOWER(TRIM(sexo)) IN ('masculino','m','male') THEN 'Masculino'
        WHEN LOWER(TRIM(sexo)) IN ('feminino','f','female') THEN 'Feminino'
      END AS sexo_norm,
      COUNT(*) AS total
    FROM cliente
    GROUP BY sexo_norm
) c ON c.sexo_norm = s.sexo
CROSS JOIN (
    SELECT COUNT(*) AS total_all FROM cliente
) t;

        """)
        dados = cursor.fetchall()

        if not dados:
            return jsonify({"message": "Sem público ainda"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/dashboard/faixaEtaria", methods=["GET"])
def faixaHetaria():
    conn = None
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
    CASE
        WHEN TIMESTAMPDIFF(YEAR, dataNascimento, CURDATE()) BETWEEN 10 AND 20 THEN '10 a 20'
        WHEN TIMESTAMPDIFF(YEAR, dataNascimento, CURDATE()) BETWEEN 21 AND 30 THEN '21 a 30'
        WHEN TIMESTAMPDIFF(YEAR, dataNascimento, CURDATE()) BETWEEN 31 AND 40 THEN '31 a 40'
        WHEN TIMESTAMPDIFF(YEAR, dataNascimento, CURDATE()) BETWEEN 41 AND 50 THEN '41 a 50'
        ELSE '50+'
    END AS name,
    COUNT(*) AS valor
FROM cliente
GROUP BY name
ORDER BY
    CASE
        WHEN name = '10 a 20' THEN 1
        WHEN name = '21 a 30' THEN 2
        WHEN name = '31 a 40' THEN 3
        WHEN name = '41 a 50' THEN 4
        ELSE 5
    END;

        """)
        dados = cursor.fetchall()

        if not dados:
            return jsonify({"message": "Sem clientes"}), 200

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({"message": f"Erro ao buscar cliente: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()

@routes.route("/clientePorMatricula/<int:matricula>", methods=["GET"])
def cliente(matricula):
    try:
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor(dictionary=True)
        sql = """
            SELECT * FROM cliente AS c
            INNER JOIN matricula AS m ON m.fkCliente = c.idCliente
            WHERE idMatricula = %s
        """
        cursor.execute(sql, (matricula,))
        cliente = cursor.fetchone()

        if not cliente:
            return jsonify({"message": "Cliente não encontrado"}), 404

        # 🔧 Remove o campo binário
        cliente.pop("face_embedding", None)

        return jsonify(cliente)

    except Exception as e:
        return jsonify({"message": "Erro ao buscar cliente", "error": str(e)}), 500


@routes.route("/clientePorEmail/<string:email>", methods=["GET"])
def buscar_cliente_email(email):
    if not email:
        return jsonify({"message": "Parâmetro 'email' é obrigatório."}), 400

    conn = None
    try:
        conn = conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM cliente WHERE email=%s", (email,))
        cliente = cursor.fetchone()

        if not cliente:
            return jsonify({"message": f"Cliente com email '{email}' não encontrado."}), 404

        # Converte campos de data para string ISO se necessário
        for campo, valor in cliente.items():
            if isinstance(valor, (date, datetime)):
                cliente[campo] = valor.isoformat()

        return jsonify(cliente)
    except Exception as e:
        return jsonify({"message": "Erro ao buscar cliente.", "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@routes.route("/cliente/<int:idCliente>", methods=["PUT"])
def atualizar_cliente(idCliente):
    try:
        data = request.get_json()
        conn = conectar()
        if not conn:
            return jsonify({"message": "Erro ao conectar ao banco"}), 500

        cursor = conn.cursor()
        sql = """
        UPDATE cliente
        SET nome = %s,
            email = %s,
            telefone = %s,
            sexo = %s,
            rg = %s,
            cpf = %s,
            dataNascimento = %s,
            endereco = %s,
            estadoCivil = %s
            WHERE idCliente = %s
        """
        valores = (
            data["nome"], data["email"], data["telefone"],
            data["sexo"], data["rg"], data["cpf"], data["dataNascimento"], data["endereco"], data["estadoCivil"],
            idCliente
        )

        cursor.execute(sql, valores)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Cliente não encontrado"}), 404

        return jsonify({"message": "Cliente atualizado com sucesso!"}), 200

    except Exception as e:
        return jsonify({"message": "Erro ao atualizar cliente", "error": str(e)}), 500

@routes.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        senha = data.get("senha")

        if not email or not senha:
            return jsonify({"message": "Email e senha são obrigatórios."}), 400

        conn = conectar()
        cursor = conn.cursor(dictionary=True)

        # Verifica credenciais
        cursor.execute("SELECT * FROM cliente WHERE email=%s AND senha=%s", (email, senha))
        cliente = cursor.fetchone()

        if not cliente:
            return jsonify({"message": "Credenciais inválidas."}), 401

        # Converte bytes para Base64
        for campo, valor in cliente.items():
            if valor is None:
                continue

            if isinstance(valor, bytes):
                cliente[campo] = base64.b64encode(valor).decode("utf-8")
                continue

        # Busca matrícula e status do pagamento
        cursor.execute("""
            SELECT m.idMatricula, m._status AS status_matricula, p._status AS status_pagamento
            FROM matricula m
            LEFT JOIN pagamento p ON m.idMatricula = p.fkMatricula
            WHERE m.fkCliente = %s
            ORDER BY m.idMatricula DESC LIMIT 1
        """, (cliente["idCliente"],))
        matricula = cursor.fetchone()

        if not matricula:
            return jsonify({"message": "Nenhuma matrícula encontrada."}), 403

        if (
            matricula["status_matricula"].lower() != "ativa" or
            matricula["status_pagamento"].lower() != "pago"
        ):
            return jsonify({"message": "Matrícula inativa ou pagamento pendente."}), 403

        token = f"TOKEN-{cliente['idCliente']}-{datetime.now().timestamp()}"

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM dadosMatriculaCliente WHERE email = %s", (email,))
        cliente2 = cursor.fetchone()

        if not cliente2:
            return jsonify({"message": "Cliente não encontrado"}), 404

        for campo, valor in cliente2.items():
            if valor is None:
                continue

            # Converte bytes para Base64
            if isinstance(valor, bytes):
                cliente2[campo] = base64.b64encode(valor).decode("utf-8")
                continue

            # Converte date/datetime
            if isinstance(valor, (date, datetime)):
                if campo == "dataPagamento":
                    cliente2[campo] = valor.strftime("%d/%m/%Y")  # formato brasileiro
                else:
                    cliente2[campo] = valor.strftime("%Y-%m-%d")  # formato ISO
                continue

            # Se for string no formato DD/MM/YYYY ou DD/MM/YYYY HH:MM
            if isinstance(valor, str):
                try:
                    if "/" in valor:
                        if campo == "dataPagamento":
                            cliente2[campo] = valor[:10]
                        else:
                            cliente2[campo] = datetime.strptime(valor[:10], "%d/%m/%Y").strftime("%Y-%m-%d")
                except ValueError:
                    pass  # ignora se não for data

            # Converte valores monetários para vírgula
            if campo in ["valorPlano", "valorPago"]:
                try:
                    cliente2[campo] = f"{float(valor):.2f}".replace(".", ",")
                except (ValueError, TypeError):
                    pass

        return jsonify({
            "message": "Login realizado com sucesso.",
            "token": token,
            "cliente": cliente2,
            "matricula": matricula
        })

    except Exception as e:
        return jsonify({"message": "Erro ao realizar login", "error": str(e)}), 500

    finally:
        if 'conn' in locals() and conn:
            conn.close()

@routes.route("/api/mercadopago/webhook", methods=["POST"])
def mercadopago_webhook():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Nenhum dado recebido"}), 400

        print("[DEBUG] Webhook recebido:", data)

        # Exemplo de dados recebidos:
        # {"id":"1234567890","topic":"payment"} ou {"type":"payment","data":{"id":...}}
        payment_id = None

        if "id" in data:
            payment_id = data["id"]
        elif "data" in data and "id" in data["data"]:
            payment_id = data["data"]["id"]

        if not payment_id:
            return jsonify({"message": "ID do pagamento não encontrado"}), 400

        # Buscar pagamento no Mercado Pago
        payment_info = mp.payment().get(payment_id)
        payment_status = payment_info["response"]["status"]
        id_matricula = payment_info["response"]["external_reference"]  # se você passar external_reference ao criar preference

        print(f"[DEBUG] Status do pagamento: {payment_status}, Matrícula: {id_matricula}")

        # Atualizar pagamento e matrícula no banco
        conn = conectar()
        cursor = conn.cursor()

        if payment_status.lower() in ["approved", "paid"]:
            # Atualiza pagamento para 'Pago'
            cursor.execute(
                "UPDATE pagamento SET _status='Pago' WHERE fkMatricula=%s",
                (id_matricula,)
            )
            # Atualiza matrícula para 'Ativa'
            cursor.execute(
                "UPDATE matricula SET _status='Ativa' WHERE idMatricula=%s",
                (id_matricula,)
            )
            conn.commit()
            print("[DEBUG] Pagamento e matrícula atualizados para Pago/Ativa")
        elif payment_status.lower() == "pending":
            cursor.execute(
                "UPDATE pagamento SET _status='Pendente' WHERE fkMatricula=%s",
                (id_matricula,)
            )
            cursor.execute(
                "UPDATE matricula SET _status='Pendente' WHERE idMatricula=%s",
                (id_matricula,)
            )
            conn.commit()
        else:
            # Qualquer outro status pode ser tratado como 'Atrasado' ou 'Cancelado'
            cursor.execute(
                "UPDATE pagamento SET _status='Atrasado' WHERE fkMatricula=%s",
                (id_matricula,)
            )
            cursor.execute(
                "UPDATE matricula SET _status='Inativa' WHERE idMatricula=%s",
                (id_matricula,)
            )
            conn.commit()

        return jsonify({"message": "Webhook processado com sucesso"}), 200

    except Exception as e:
        print("[ERROR] Erro ao processar webhook:", str(e))
        return jsonify({"message": "Erro interno no servidor", "error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

# ---------------- Upload embedding por email ----------------
@routes.route("/api/biometria/upload_embedding_email", methods=["POST"])
def upload_embedding_email():
    try:
        data = request.get_json()  # Lê JSON enviado pelo frontend
        print("---- JSON RECEBIDO ----")
        print(data)

        email = data.get("email")
        embedding = data.get("embedding")  # agora espera o vetor

        if not email or not embedding:
            return jsonify({"message": "Campos obrigatórios ausentes"}), 400

        # Converte embedding para string JSON para salvar no banco
        embedding_json = json.dumps(embedding)

        conn = conectar()
        cursor = conn.cursor()

        # Verifica se o cliente existe
        cursor.execute("SELECT idCliente FROM cliente WHERE email=%s", (email,))
        cliente = cursor.fetchone()
        if not cliente:
            return jsonify({"message": "Cliente não encontrado"}), 404

        # Atualiza o embedding no cliente
        cursor.execute(
            "UPDATE cliente SET face_embedding=%s WHERE email=%s",
            (embedding_json, email)
        )
        conn.commit()

        return jsonify({"message": "Embedding salvo com sucesso", "email": email}), 201

    except Exception as e:
        return jsonify({"message": "Erro interno", "erro": str(e)}), 500



# ---------------- Rota de status ----------------
@routes.route("/api/status")
def status():
    return jsonify({"status": "API operacional"})

@routes.route("/alunos", methods=["GET"])
def listar_alunos():
    """Lista todos os alunos cadastrados"""
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cliente")
    alunos = cursor.fetchall()
    conn.close()

    # Converte datas para JSON
    for aluno in alunos:
        for campo, valor in aluno.items():
            if isinstance(valor, (date, datetime)):
                aluno[campo] = valor.isoformat()

    return jsonify(alunos)

@routes.route("/totais", methods=["GET"])
def totais():
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("select * from totais")
    totais = cursor.fetchone()
    conn.close()
    return totais


@routes.route("/controleAcesso", methods=["GET"])
def listar_controle_acesso():
    """Lista registros de controle de acesso"""
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM controleAcesso")
    registros = cursor.fetchall()
    conn.close()

    # Converte datas e tempos para JSON
    for registro in registros:
        for campo, valor in registro.items():
            if isinstance(valor, (date, datetime)):
                registro[campo] = valor.isoformat()
            elif isinstance(valor, timedelta):
                total_segundos = int(valor.total_seconds())
                horas, resto = divmod(total_segundos, 3600)
                minutos, segundos = divmod(resto, 60)
                registro[campo] = f"{horas:02d}:{minutos:02d}:{segundos:02d}"

    return jsonify(registros)
