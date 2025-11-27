import CardGestaoAlunos from "../components/GestaoAluno/CardGestaoAlunos"
import styles from "./GestaoAlunos.module.css"
import { LuUser, LuUserRoundPlus, LuUserRoundX, LuUserRoundMinus, LuNotepadText, LuNotebookPen } from "react-icons/lu";
import { FiBarChart2, FiSend } from "react-icons/fi";
import { LuSearch, LuSlidersHorizontal, LuScanEye } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { SlNote } from "react-icons/sl";
import axios from "axios"

export default function GestaoAlunos({
    setLembreteGeral,
    setBtnLembreteGeral,
    lembreteGeral,
    setTempo,
    btnLembreteGeral,
    tempo,
    setBlur,
    formContatarAluno,
    setFormContatarAluno,
    btnContatarAtivo,
    setBtnContatarAtivo,
    temposInatividadeBtnContatar,
    setTemposInatividadeBtnContatar,
    setAlunoSelecionadoGestaoAlunos,
    alunoSelecionadoGestaoAlunos
}) {

    const [estatisticas, setEstatisticas] = useState(null);
    const inputNotaInternaRef = useRef(null);
    const [alunos, setAlunos] = useState([]
    );
    const [litaGrafico, setListagrafico] = useState([]);
    const [filtroTodos, setFiltroTodos] = useState(false);
    const [filtroFrequencia, setFiltroFrequencia] = useState(false);
    const [txtFiltroTodos, setTxtFiltroTodos] = useState("Todos");
    const [txtFiltroFrequencia, setTxtFiltroFrequencia] = useState("Todos");
    const [enviado, setEnviado] = useState(false);
    const [txtPesquisa, setTxtPesquisa] = useState("");
    const [msg, setMsg] = useState("");
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);

    const buscarAlunos = async () => {
        await axios.get("https://joaofarias16.pythonanywhere.com/gestaoAlunos/alunos")
            .then(res => {
                res.data ? setAlunos(res.data) : setMsg("Nenhum aluno encontrado");
            })
    };



    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/estatisticasGestaoAlunos").then(res => setEstatisticas(res.data));
    }, []);

    useEffect(() => {
        buscarAlunos();
    }, []);


    const filtrar = async (filtro, setLista) => {
        try {
            const res = await axios.get(
                "https://joaofarias16.pythonanywhere.com/gestaoAlunos/alunos",
                { validateStatus: (status) => status < 500 }
            );

            let list = res.status === 404 ? [] : res.data;

            switch (filtro) {
                case "Todos":
                    setLista(list);
                    break;
                case "Em dia":
                    setLista(list.filter(a => a.statusPagamento === "Pago"));
                    break;
                case "Pendentes":
                    setLista(list.filter(a => a.statusPagamento === "Pendente"));
                    break;
                case "Presentes":
                    setLista(list.filter(a => a.horarioChegada && !a.horarioSaida));
                    break;
                case "Inativo":
                    setLista(list.filter(a => a.statusMatricula === "Inativa"));
                    break;
                case "Ordem de A a Z":
                    setLista([...list].sort((a, b) => a.nome.localeCompare(b.nome)));
                    break;
                case "Ordem de Z a A":
                    setLista([...list].sort((a, b) => b.nome.localeCompare(a.nome)));
                    break;
                default:
                    setLista(list);
                    break;
            }
        } catch (err) {
            console.error("Erro inesperado ao filtrar alunos:", err);
        }
    };

    useEffect(() => {
        filtrar(txtFiltroTodos, setAlunos);
    }, [txtFiltroTodos]);

    useEffect(() => {
        filtrar(txtFiltroFrequencia, setListagrafico);
    }, [txtFiltroFrequencia]);



    const pesquisar = async (valor) => {
        if (!valor) {
            buscarAlunos();
            setMsg("");
            return;
        }

        try {
            const res = await axios.get(
                `https://joaofarias16.pythonanywhere.com/gestaoAlunos/pesquisa/${valor}`,
                { validateStatus: (status) => status < 500 }
            );

            if (res.status === 404) {
                setAlunos([]);
                setMsg(`Sem resultados para ${valor}`);
            } else {
                setAlunos(res.data);
                setMsg("");
            }
        } catch (err) {
            console.error("Erro inesperado ao pesquisar alunos:", err);
            setAlunos([]);
            setMsg("Ocorreu um erro na pesquisa");
        }
    };


    const ItemAluno = ({ aluno }) => {
        const [alunoAtual, setAlunoAtual] = useState(aluno);
        if (alunoSelecionadoGestaoAlunos) {
            axios.get(`https://joaofarias16.pythonanywhere.com/cliente/${alunoSelecionadoGestaoAlunos?.idCliente}`).then(res => { setAlunoSelecionado(res.data); setAlunoSelecionadoGestaoAlunos(null); setAlunoAtual(res.data); });

        }
        return (
            <div className={`${styles.itemTodos} ${alunoAtual?.idCliente === alunoSelecionado?.idCliente ? styles.ativo : ""}`} onClick={() => {
                setAlunoSelecionado(aluno);
            }}>
                <div className={styles.containerNome}>
                    <img src="/img/iconUser.png" className={styles.imgItemTodos} alt="User" />
                    <p className={styles.titleLista}>{aluno.nome}</p>
                </div>
                <p className={styles.txtItemTodos}>{aluno.horarioChegada && !aluno.horarioSaida ? "Presente" : "Ausente"}</p>
                <p className={styles.txtItemTodos}>{aluno.nomePlano}</p>
                <p className={`${styles.txtItemTodos} ${aluno.statusPagamento === "Pago" ? styles.pago :
                    aluno.statusPagamento === "Pendente" ? styles.pendente : styles.atrasado
                    }`}>{aluno.statusPagamento}</p>
                <p className={styles.txtItemTodos}>{new Date(aluno.dataInicio).toLocaleDateString("pt-BR")}</p>
                <p className={styles.txtItemTodos}>{new Date(aluno.dataFim).toLocaleDateString("pt-BR")}</p>
                <p className={styles.titleId}>{aluno.idCliente}</p>
            </div>
        )
    }

    const ItemGrafico = ({ aluno }) => {
        const primeiroNome = aluno?.nome?.split(" ")[0] || "";
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "end" }}>
                <div className={styles.barraGrafico} style={{ height: `${aluno.frequencia}`, minHeight: 2 }}>
                </div>
            </div>
        )
    }

    const enviarLembreteGeral = () => {
        setEnviado(true);
        setTimeout(() => {
            setLembreteGeral(!lembreteGeral);
            setBtnLembreteGeral(false);
            setBlur(false);
            setEnviado(false);
        }, 2000);

        setTimeout(() => {
            setBtnLembreteGeral(true);
        }, 60000);
        tempoInatividade();
    }

    const tempoInatividade = () => {
        let intervalo = setInterval(() => {
            setTempo(prev => (prev - 1));
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalo);
            setTempo(60);
        }, 60000);
    }

    const tempoInatividadeContatar = () => {
        let intervalo = setInterval(() => {
            setTemposInatividadeBtnContatar(prev => ({ ...prev, [alunoSelecionado?.idCliente]: prev[alunoSelecionado?.idCliente] - 1 }));
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalo);
            setTemposInatividadeBtnContatar(prev => ({ ...prev, [alunoSelecionado?.idCliente]: 60 }));
        }, 60000);
    }

    const contatarAluno = () => {
        setTemposInatividadeBtnContatar(prev => ({ ...prev, [alunoSelecionado?.idCliente]: 60 }));
        setEnviado(true);
        setTimeout(() => {
            setBtnContatarAtivo(false)
            setFormContatarAluno(false)
            setBlur(false);
            setEnviado(false);
        }, 2000);
        setTimeout(() => {
            setBtnContatarAtivo(true);
        }, 60000);
        tempoInatividadeContatar();
    }

    const notaInterna = () => {
        inputNotaInternaRef.current.disabled = false;
        inputNotaInternaRef.current.focus();
    }

    const adicionarNotaInterna = async () => {
        if (alunoSelecionado.notaInterna) {
            await axios.put(`https://joaofarias16.pythonanywhere.com/gestaoAlunos/notaInterna/${alunoSelecionado.idCliente}`, {
                notaInterna: alunoSelecionado.notaInterna
            });
            inputNotaInternaRef.current.disabled = true;
            inputNotaInternaRef.current.blur();
            setAlunos(prev =>
                prev.map(aluno =>
                    aluno.idCliente === alunoSelecionado.idCliente
                        ? { ...aluno, notaInterna: alunoSelecionado.notaInterna }
                        : aluno
                )
            );
        }
    }

    return (
        <div className={styles.container}>
            {alunos && estatisticas ?
                <>
                    <div className={`${styles.lembreteGeral} ${lembreteGeral && styles.exibirLembreteGeral}`}>
                        {enviado ?
                            <div className={styles.containerLembreteEnviado}>
                                <p className={styles.tituloLembreteGeral}>Lembrete geral enviado com sucesso!</p>
                            </div> :
                            <>
                                <div className={styles.headerLembreteGeral}>
                                    <p className={styles.tituloLembreteGeral}>Lembrete geral de pagamento</p>
                                    <p className={styles.descricaoLembreteGeral}>Envie um lembrete pronto para todos os alunos inadimplentes de uma só vez</p>
                                </div>
                                <div className={styles.contanerBotoesLembreteGeral}>
                                    <button className={styles.btnEnviarLembreteGeral} onClick={enviarLembreteGeral}><FiSend size={15} /> Enviar lembrete geral</button>
                                    <button className={styles.btnCancelarEnvio} onClick={() => { setLembreteGeral(false); setBlur(false); }}>Cancelar envio</button>
                                </div>
                                <div className={styles.headerLembreteGeral}>
                                    <p className={styles.txtFooterLembreteGeral}>Envios de lembretes de pagamento não podem ser desfeitos uma vez que enviados.</p>
                                    <p className={styles.txtFooterLembreteGeral}>Obs: Após o envio, você terá de aguardar 1 minuto para enviar outro</p>
                                </div>
                            </>}
                    </div>
                    <div className={`${styles.containerContatarAluno} ${formContatarAluno && styles.exibirContainerContatarAluno}`}>
                        {enviado ?
                            <div className={styles.containerLembreteEnviado}>
                                <p className={styles.tituloLembreteGeral}>Mensagem enviada para {alunoSelecionado?.nome}</p>
                            </div> :
                            <>
                                <div className={styles.headerLembreteGeral}>
                                    <p className={styles.tituloLembreteGeral}>Contatar aluno</p>
                                    <p className={styles.descricaoLembreteGeral}>Enviar uma mensagem para {alunoSelecionado?.nome}</p>
                                </div>
                                <textarea className={styles.taContatarAluno} placeholder="Digite seu texto aqui" />
                                <div className={styles.contanerBotoesLembreteGeral}>
                                    <button className={styles.btnEnviarLembreteGeral} onClick={contatarAluno}><FiSend size={15} /> Enviar</button>
                                    <button className={styles.btnCancelarEnvio} onClick={() => { setFormContatarAluno(false); setBlur(false); }}>Cancelar envio</button>
                                </div>
                                <div className={styles.headerLembreteGeral}>
                                    <p className={styles.txtFooterLembreteGeral}>Obs: Após o envio, você terá de aguardar 1 minuto para enviar outro</p>
                                </div>
                            </>}
                    </div>
                    <div className={styles.conteudo}>
                        <div className={styles.containerCards}>
                            <CardGestaoAlunos titulo="Matriculados" Icon={LuUser} txt={estatisticas?.matriculados ? estatisticas?.matriculados : 0} />
                            <CardGestaoAlunos titulo="Novos do mês" Icon={LuUserRoundPlus} txt={estatisticas?.novosMes ? estatisticas?.novosMes : 0} />
                            <CardGestaoAlunos titulo="Inadimplentes" Icon={LuUserRoundX} txt={estatisticas?.inadimplentes ? estatisticas?.inadimplentes : 0} color="#FFC300" />
                            <CardGestaoAlunos titulo="Inativos" Icon={LuUserRoundMinus} txt={estatisticas?.inativos ? estatisticas?.inativos : 0} color="#FF7979" />
                            <CardGestaoAlunos titulo="Presença média" Icon={FiBarChart2} txt={estatisticas?.presencaMedia ? estatisticas?.presencaMedia : 0} />
                        </div>
                        <div className={styles.containerTodos}>
                            <p className={styles.titulo}>Todos</p>
                            <div className={styles.containerPesquisa}>
                                <div className={styles.containerBarraPesquisa}>
                                    <LuSearch size={15} />
                                    <input type="text" placeholder="Pesquisar alunos" className={styles.inputPesquisa} value={txtPesquisa} onChange={e => { setTxtPesquisa(e.target.value); pesquisar(e.target.value); }} />
                                </div>
                                <button className={`${styles.btnLembreteGeral} ${!btnLembreteGeral && styles.btnDesativado}`} onClick={() => { setLembreteGeral(!lembreteGeral); setBlur(true); }}>
                                    <p>Enviar lembrete geral</p>
                                    {!btnLembreteGeral ? tempo + "s" : <FiSend size={15} strokeWidth={3} />}
                                </button>
                                <div className={styles.containerFiltro}>
                                    <p className={styles.labelFiltro}>Filtrar por: {txtFiltroTodos}</p>
                                    <button className={styles.btnFiltrar}><LuSlidersHorizontal style={{ zIndex: 2 }} size={15} strokeWidth={2.5} onClick={() => setFiltroTodos(!filtroTodos)} /></button>
                                    <div className={`${styles.listaFiltro} ${filtroTodos && styles.filtroAberto}`}>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroTodos("Todos"); setFiltroTodos(!filtroTodos) }}>Todos</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroTodos("Em dia"); setFiltroTodos(!filtroTodos) }}>Em dia</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroTodos("Pendentes"); setFiltroTodos(!filtroTodos) }}>Pendentes</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroTodos("Presentes"); setFiltroTodos(!filtroTodos) }}>Presentes</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroTodos("Inativo"); setFiltroTodos(!filtroTodos) }}>Inativo</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroTodos("Ordem de A a Z"); setFiltroTodos(!filtroTodos) }}>Ordem de A a Z</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroTodos("Ordem de Z a A"); setFiltroTodos(!filtroTodos) }}>Ordem de Z a A</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.hrTodos}></div>
                            <div className={styles.containerListaTodos}>
                                <div className={styles.titlesLista}>
                                    <p className={styles.ajuste}>Nome</p>
                                    <p className={styles.titleLista}>Status</p>
                                    <p className={styles.titleLista}>Plano</p>
                                    <p className={styles.titleLista}>Situação</p>
                                    <p className={styles.titleLista}>Pago em</p>
                                    <p className={styles.titleLista}>Vence em</p>
                                    <p className={styles.titleId}>ID</p>
                                </div>
                                <div className={styles.listaTodos}>
                                    {!msg && alunos.length > 0 ? alunos.map(aluno =>
                                        <ItemAluno aluno={aluno} key={aluno.idCliente} />
                                    ) : txtPesquisa ?
                                        `Sem resultados para ${txtPesquisa}` :
                                        msg}
                                </div>
                            </div>
                        </div>
                        <div className={styles.frequenciaGeral}>
                            <div className={styles.headerFrequenciaGeral}>
                                <p className={styles.tituloFrequenciaGeral}>Frequência geral</p>
                                <div className={styles.containerFiltro}>
                                    <p className={styles.labelFiltro}>Filtrar por: {txtFiltroFrequencia}</p>
                                    <button className={styles.btnFiltrar}><LuSlidersHorizontal style={{ zIndex: 2 }} size={15} strokeWidth={2.5} onClick={() => setFiltroFrequencia(!filtroFrequencia)} /></button>
                                    <div className={`${styles.listaFiltro} ${filtroFrequencia && styles.filtroAberto}`}>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroFrequencia("Todos"); setFiltroFrequencia(!filtroFrequencia) }}>Todos</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroFrequencia("Em dia"); setFiltroFrequencia(!filtroFrequencia) }}>Em dia</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroFrequencia("Pendentes"); setFiltroFrequencia(!filtroFrequencia) }}>Pendentes</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroFrequencia("Presente"); setFiltroFrequencia(!filtroFrequencia) }}>Presente</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroFrequencia("Inativo"); setFiltroFrequencia(!filtroFrequencia) }}>Inativo</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroFrequencia("Ordem de A a Z"); setFiltroFrequencia(!filtroFrequencia) }}>Ordem de A a Z</p>
                                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltroFrequencia("Ordem de Z a A"); setFiltroFrequencia(!filtroFrequencia) }}>Ordem de Z a A</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.grafico}>
                                <div className={styles.numerosGrafico}>
                                    <p className={styles.txtPorcentagem} style={{ color: "#9ECD1D" }}>100%</p>
                                    <p className={styles.txtPorcentagem}>80%</p>
                                    <p className={styles.txtPorcentagem}>60%</p>
                                    <p className={styles.txtPorcentagem} style={{ color: "#FFA64D" }}>40%</p>
                                    <p className={styles.txtPorcentagem}>20%</p>
                                    <p className={styles.txtPorcentagem} style={{ color: "#FF4B4B" }}>0%</p>
                                </div>
                                <div className={styles.linhasGrafico}>
                                    <hr className="hrPorcentagem"></hr>
                                    <hr className="hrPorcentagem"></hr>
                                    <hr className="hrPorcentagem"></hr>
                                    <hr className="hrPorcentagem"></hr>
                                    <hr className="hrPorcentagem"></hr>
                                    <hr className="hrPorcentagem"></hr>
                                    <div className={styles.listaGrafico}>
                                        <div className={styles.lista}>
                                            {litaGrafico.map(aluno => <ItemGrafico aluno={aluno} key={aluno.idCliente} />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.containerFicha}>
                        <p className={styles.tituloFicha}>Ficha completa</p>
                        {alunoSelecionado ?
                            <>
                                <div className={styles.headerFicha}>
                                    <div className={styles.imgHeaderFicha}></div>
                                    <div className={styles.containerTxtHeaderFicha}>
                                        <p className={styles.txtHeaderFicha}>ID: {alunoSelecionado.idCliente}</p>
                                        <p className={styles.nomeHeaderFicha}>{alunoSelecionado.nome}</p>
                                        <div className={styles.containerStatus}>
                                            <div className={`${styles.circuloStatus} ${alunoSelecionado.horarioChegada && !alunoSelecionado.horarioSaida ? styles.presente : ""}`}></div>
                                            <p className={styles.txtHeaderFicha}>{alunoSelecionado.horarioChegada && !alunoSelecionado.horarioSaida ? "Presente" : "Ausente"}</p>
                                        </div>
                                    </div>
                                </div>
                                <hr className={styles.hrFicha}></hr>
                                <div className={styles.containerDados}>
                                    <p className={styles.tituloDados}>Dados pessoais</p>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Data de nascimento</p>
                                            <input type="date" className={styles.inputDados} value={alunoSelecionado.dataNascimento} disabled />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Contato de emergência</p>
                                            <input type="text" className={styles.inputDados} placeholder="Não informado" disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Sexo</p>
                                            <input type="text" className={styles.inputDados} placeholder="Masculino" value={alunoSelecionado.sexo} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>CPF</p>
                                            <input type="text" className={styles.inputDados} placeholder="000.000.000-00" value={alunoSelecionado.cpf} disabled />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>RG</p>
                                            <input type="text" className={styles.inputDados} placeholder="000.000.000-0" value={alunoSelecionado.rg} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Telefone</p>
                                            <input type="text" className={styles.inputDados} placeholder="(00) 00000-0000" value={alunoSelecionado.telefone} disabled />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Contato de emergência</p>
                                            <input type="text" className={styles.inputDados} placeholder="(00) 00000-0000" value={alunoSelecionado.telefone} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>E-mail</p>
                                            <input type="email" className={styles.inputDados} placeholder="usuario@example.com" value={alunoSelecionado.email} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Endereço completo</p>
                                            <input type="text" className={styles.inputDados} placeholder="Cidade Exemplo, Bairro de Exemplo, 761" value={alunoSelecionado.endereco} disabled />
                                        </div>
                                    </div>
                                    <p className={styles.titulosFicha}>Planos de assinatura</p>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Escolha</p>
                                            <input type="text" className={styles.inputDados} placeholder="Plano PRO" value={alunoSelecionado.nomePlano} disabled />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Preco</p>
                                            <input type="text" className={styles.inputDados} placeholder="R$ 150,00" value={alunoSelecionado.valorPlano} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Data pagamento</p>
                                            <input type="date" className={styles.inputDados} value={alunoSelecionado.dataInicio} disabled />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Data vencimento</p>
                                            <input type="date" className={styles.inputDados} value={alunoSelecionado.dataFim} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Status</p>
                                            <input type="text" className={styles.inputDados} value={alunoSelecionado.statusPagamento} disabled />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Via</p>
                                            <input type="text" className={styles.inputDados} value={alunoSelecionado.metodoPagamento} disabled />
                                        </div>
                                    </div>
                                    <p className={styles.titulosFicha}>Frequência</p>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Percentual</p>
                                            <input type="text" className={styles.inputDados} value={alunoSelecionado.frequencia ? alunoSelecionado.frequencia : "0%"} disabled />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Total de faltas</p>
                                            <input type="text" className={styles.inputDados} value={alunoSelecionado.faltas} disabled />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Presença no mês</p>
                                            <input type="text" className={styles.inputDados} disabled value={`${30 - alunoSelecionado.faltas}/30`} />
                                        </div>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Faltas no mês</p>
                                            <input type="text" className={styles.inputDados} disabled value={`${alunoSelecionado.faltas}/30`} />
                                        </div>
                                    </div>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Último check-in</p>
                                            <input type="date" style={{ textAlign: "center" }} className={styles.inputDados} value={alunoSelecionado.ultimoCheckin != null && alunoSelecionado.ultimoCheckin} disabled />
                                        </div>
                                    </div>
                                    <p className={styles.titulosFicha}>Biometria facial</p>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Imagem cadastrada</p>
                                            <div className={styles.imgCadastrada}>
                                                <div className={styles.placeHolder}>Sem imagem</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={styles.titulosFicha}>Observações</p>
                                    <div className={styles.containerInputs}>
                                        <div className={styles.containerInput}>
                                            <p className={styles.labelInput}>Nota interna</p>
                                            <textarea className={styles.inputNotaInterna} placeholder="Nota interna" disabled ref={inputNotaInternaRef} value={alunoSelecionado.notaInterna ? alunoSelecionado.notaInterna : ""} onChange={e => setAlunoSelecionado(prev => ({ ...prev, notaInterna: e.target.value }))} required />
                                            {document.activeElement === inputNotaInternaRef.current && <button className={styles.btnAdicionarNotaInterna} onClick={adicionarNotaInterna}>Adicionar</button>}
                                        </div>
                                    </div>
                                </div>
                                <hr className={styles.hrFicha}></hr>
                                <p className={styles.tituloAcoes}>Ações</p>
                                <div className={styles.containerAcoes}>
                                    <div className={styles.cardAcao}>
                                        <LuScanEye size={15} />
                                        <p>Atualizar biometria facial</p>
                                    </div>
                                    <div className={styles.cardAcao} onClick={notaInterna}>
                                        <SlNote size={15} />
                                        <p>Adicionar nota interna</p>
                                    </div>
                                    <div className={`${styles.cardAcao} ${temposInatividadeBtnContatar[alunoSelecionado?.idCliente] < 60 && styles.btnDesativado}`} onClick={() => { setFormContatarAluno(true); setBlur(true); }}>
                                        <FaRegCommentDots size={15} color="#fff" />
                                        <p>Contatar aluno</p>
                                        {temposInatividadeBtnContatar[alunoSelecionado?.idCliente] < 60 && temposInatividadeBtnContatar[alunoSelecionado?.idCliente] + "s"}
                                    </div>
                                </div>
                            </> :
                            <p className={styles.placeHolder}>Selecione um aluno para ver sua ficha</p>}
                    </div>
                </> :
                <p>Carregando...</p>}
        </div>
    )
}