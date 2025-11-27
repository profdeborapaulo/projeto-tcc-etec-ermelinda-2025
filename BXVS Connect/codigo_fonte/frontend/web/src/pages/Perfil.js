import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "./Perfil.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Confirmacao from "../components/Perfil/Confirmacao";

export default function Perfil({ cliente, setCliente }) {
    const [soLer, setSoLer] = useState(true);
    const [formCliente, setFormCliente] = useState(null);
    const nomeRef = useRef(null);
    const navigate = useNavigate();
    const [confirmacao, setConfirmacao] = useState(false);

    // Alterna entre modo leitura e edição
    const toggleEdit = () => setSoLer(prev => !prev);

    // Foco automático no input "nome" quando entrar em edição
    useEffect(() => {
        if (!soLer) {
            nomeRef.current?.focus();
        }
    }, [soLer]);

    // Busca os dados atualizados do cliente no servidor
    useEffect(() => {
        if (cliente?.idCliente) {
            const fetchCliente = async () => {
                try {
                    const res = await axios.get(
                        `https://joaofarias16.pythonanywhere.com/cliente/${cliente.idCliente}`
                    );
                    setFormCliente(res.data);      // atualiza o estado local
                    setCliente(res.data);          // atualiza o estado global também
                } catch (error) {
                    console.error("Erro ao buscar cliente:", error);
                }
            };
            fetchCliente();
        }
    }, [cliente?.idCliente, setCliente]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // Checa se houve mudanças
        const mudou = Object.keys(formCliente).some(
            key => formCliente[key] !== cliente[key]
        );

        if (!mudou) {
            setSoLer(true);
            return;
        }

        try {
            await axios.put(
                `https://joaofarias16.pythonanywhere.com/cliente/${formCliente.idCliente}`,
                formCliente
            );
            setCliente(formCliente); // atualiza estado global
            setSoLer(true);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar dados!");
        }
    };

    const logout = () => {
        localStorage.removeItem("cliente");
        localStorage.removeItem("token");
        setCliente(null);
        navigate("/");
    }


    return (
        <>
            <Header cliente={cliente} setCliente={setCliente} pagina="Perfil" />
            {formCliente && cliente ? (
                <div className={styles.container}>
                    <form onSubmit={handleSubmit} className={styles.cardMatricula}>
                        <div className={styles.headerCardMatricula}>
                            <p className={styles.tituloMatricula}>Minha matrícula</p>
                            {soLer ? (
                                <div onClick={toggleEdit} className={styles.btnInformacoes}>
                                    Editar informações
                                </div>
                            ) : (
                                <button type="submit" className={styles.btnSalvar}>
                                    Confirmar
                                </button>
                            )}
                        </div>
                        <hr className={styles.hr} />
                        <div className={styles.containerPerfil}>
                            <img
                                className={styles.imgPerfil}
                                alt="Perfil"
                                src="/img/iconUser.png"
                            />
                            <p className={styles.nomePerfil}>{cliente.nome}</p>
                        </div>

                        <div className={styles.containerDados}>
                            <div className={styles.containerInputs}>
                                <div className={styles.containerInput}>
                                    <label>Nome completo</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        ref={nomeRef}
                                        className={styles.inputPerfil}
                                        value={formCliente.nome || ""}
                                        disabled={soLer}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.containerInput}>
                                    <label>CPF</label>
                                    <input
                                        type="text"
                                        name="cpf"
                                        className={styles.inputPerfil}
                                        value={formCliente.cpf || ""}
                                        disabled={soLer}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.containerInput}>
                                    <label>Estado civil</label>
                                    <select
                                        name="estadoCivil"
                                        className={styles.inputPerfil}
                                        value={formCliente.estadoCivil || ""}
                                        onChange={handleChange}
                                        disabled={soLer}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Solteiro(a)">Solteiro(a)</option>
                                        <option value="Casado(a)">Casado(a)</option>
                                        <option value="Divorciado(a)">Divorciado(a)</option>
                                        <option value="Viúvo(a)">Viúvo(a)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.containerInputs}>
                                <div className={styles.containerInput}>
                                    <label>Data de nascimento</label>
                                    <input
                                        type="date"
                                        name="dataNascimento"
                                        className={styles.inputPerfil}
                                        value={formCliente.dataNascimento || ""}
                                        disabled={soLer}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.containerInput}>
                                    <label>RG</label>
                                    <input
                                        type="text"
                                        name="rg"
                                        className={styles.inputPerfil}
                                        value={formCliente.rg || ""}
                                        disabled={soLer}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.containerInput}>
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        className={styles.inputPerfil}
                                        value={formCliente.email || ""}
                                        disabled={soLer}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.containerInputs}>
                                <div className={styles.containerInput}>
                                    <label>Sexo</label>
                                    <select
                                        name="sexo"
                                        className={styles.inputPerfil}
                                        value={formCliente.sexo || ""}
                                        onChange={handleChange}
                                        disabled={soLer}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                                <div className={styles.containerInput}>
                                    <label>Telefone</label>
                                    <input
                                        type="text"
                                        name="telefone"
                                        className={styles.inputPerfil}
                                        value={formCliente.telefone || ""}
                                        disabled={soLer}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.containerInput}>
                                    <label>Endereço completo</label>
                                    <input
                                        type="text"
                                        name="endereco"
                                        className={styles.inputPerfil}
                                        value={formCliente.endereco || ""}
                                        disabled={soLer}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.containerCardPlano}>
                                <label>Meu plano</label>
                                <div className={styles.cardPlano}>
                                    <div className={styles.textPlano}>{formCliente.nomePlano}</div>
                                    <p className={styles.textPlano}>{formCliente.descricaoPlano}</p>
                                    <div className={styles.vencimentoContainer}>
                                        <p className={styles.textPlano}>Vence em:</p>
                                        <p className={styles.vencimento}>{formCliente.dataVencimento}</p>
                                    </div>
                                    <hr className={styles.hr} />
                                    <div className={styles.containerPagamento}>
                                        <div className={styles.containerValor}>
                                            <p className={styles.textPlano}>Valor:</p>
                                            <p className={styles.textPlano}>R$ {formCliente.valorPlano}</p>
                                        </div>
                                        <button
                                            className={
                                                formCliente.parcelaAtualPaga
                                                    ? styles.btnMercadoPagoDesativado
                                                    : styles.btnMercadoPago
                                            }
                                            disabled={formCliente.parcelaAtualPaga}
                                        >
                                            <img
                                                alt="Mercado pago"
                                                src="/img/mercadoPagoIcon.png"
                                                className={styles.imgMercadoPago}
                                            />
                                            <p>Realizar pagamento</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <button className={styles.btnLogout} onClick={() => setConfirmacao(true)}>Sair</button>
                </div>
            ) : (
                <div className={styles.container}>
                    <div className={styles.cardCarregamento}>
                        <p className={styles.txtCarregamento}>Carregando...</p>
                    </div>
                </div>
            )}
            {confirmacao && <Confirmacao logout={logout} setConfirmacao={setConfirmacao} />}
            <Footer />
        </>
    );
}
