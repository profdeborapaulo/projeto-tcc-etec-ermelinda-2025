import { useEffect, useState } from "react"
import styles from "./Aluno.module.css"
import Lembrete from "./Lembrete";

export default function Aluno({ alunoSelecionado, setAlunoSelecionado, setPagina, setAlunoSelecionadoGestaoAlunos, setAtivo }) {
    const [lembrete, setLembrete] = useState("")
    const [toastLembrete, setToastLembrete] = useState(false);
    const [temposDesativados, setTemposDesativados] = useState({});
    const [contatar, setContatar] = useState(false);
    const [popUp, setPopUp] = useState(false);

    const desativarLembrete = () => {
        setLembrete("");
        setContatar(false);
        setToastLembrete(true);
        setTimeout(() => setToastLembrete(false), 2000);


        const tempoInativo = 30; // segundos
        setTemposDesativados(prev => ({
            ...prev,
            [alunoSelecionado.id]: tempoInativo
        }));

        let intervalo = setInterval(() => {
            setTemposDesativados(prev => ({
                ...prev,
                [alunoSelecionado.id]: prev[alunoSelecionado.id] - 1
            }));
        }, 1000);        

        setTimeout(() => {
            clearInterval(intervalo);
        }, tempoInativo * 1000);
    }

     useEffect(() => {
        const menu = () => {
          if (window.innerWidth < 1400) {
            setPopUp(true);
          } else {
            setPopUp(false);
        }
        }
        menu();
        window.addEventListener("resize", menu);
      }, []);

    const tempoLembreteDesativado = alunoSelecionado ? temposDesativados[alunoSelecionado.id] || 0 : 0;
    const lembreteAtivo = tempoLembreteDesativado === 0;

    return (
        <div className={`${styles.aluno} ${popUp ? styles.popUp : ""} ${alunoSelecionado ? styles.popUpVisible : ""}`}>
            {popUp && <button className={styles.btnFechar} onClick={() => setAlunoSelecionado("")}>X</button>}
            <p className={styles.alunoSelecionado}>Aluno selecionado</p>
            {!alunoSelecionado ? (
                <p className={styles.placeholderAluno}>Clique em um aluno para ver<br /> mais informações</p>
            ) : (
                <>
                    <div className={styles.perfilAluno}>
                        <img className={styles.imgPerfilAluno} alt="Foto" src="/img/aluno.svg"/>
                        <div className={styles.txtPerfilAluno}>
                            <p className={styles.nomePerfilAluno}>{alunoSelecionado.nome}</p>
                            <div className={styles.presencaPerfilAluno}>
                                <div className={`${styles.circuloPerfilAluno} ${alunoSelecionado.horarioSaida ? styles.ausente : ""}`}></div>
                                <p className={styles.txtPresencaPerfilAluno}>{alunoSelecionado.horarioSaida ? "Ausente" : "Presente"}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.horarios}>
                        <div className={styles.itemHorario}>
                            <p className={styles.labelHorario}>Chegou em:</p>
                            <p className={styles.conteudoHorario}>{alunoSelecionado.horarioChegada}</p>
                        </div>
                        <div className={styles.itemHorario}>
                            <p className={styles.labelHorario}>Saiu em:</p>
                            <p className={styles.conteudoHorario}>{alunoSelecionado.horarioSaida ? alunoSelecionado.horarioSaida : "- - -"}</p>
                        </div>
                        <div className={styles.itemHorario}>
                            <p className={styles.labelHorario}>Código ID:</p>
                            <p className={styles.conteudoHorario}>{alunoSelecionado.id}</p>
                        </div>
                    </div>
                    <div className={styles.containerAlunoSelecionado}>
                        {!lembrete ? (
                            <>
                                <div className={styles.cardsAluno}>
                                    <div className={styles.cardAluno}>
                                        <p className={styles.labelCardAluno}>Situação de pagamento</p>
                                        <p className={styles.conteudoCardAluno}>{alunoSelecionado.situacaoMatricula}</p>
                                    </div>
                                    <div className={styles.cardAluno}>
                                        <p className={styles.labelCardAluno}>Plano ativo</p>
                                        <p className={styles.conteudoCardAluno}>{alunoSelecionado.plano}</p>
                                    </div>
                                    <div className={styles.cardAluno}>
                                        <p className={styles.labelCardAluno}>Frequência</p>
                                        <p className={styles.frequenciaCardAluno}>{alunoSelecionado.frequencia ? alunoSelecionado.frequencia : "0%"}</p>
                                    </div>
                                </div>
                                <div className={styles.bottomAlunoSelecionado}>
                                    {!contatar ? (
                                        <div className={styles.btnsAluno}>
                                            <button
                                                className={`${lembreteAtivo ? styles.btnTelaContatar : styles.btnTelaContatarDesativado}`}
                                                onClick={() => lembreteAtivo ? setContatar(true) : ""}
                                            >
                                                {!lembreteAtivo ? `Contatar novamente em ${tempoLembreteDesativado}s` : "Contatar"}
                                            </button>
                                            <button className={styles.btnVerFicha} onClick={() => {setPagina("Gestão de Alunos"); setAlunoSelecionadoGestaoAlunos(alunoSelecionado); setAtivo("Gestão de Alunos")}}>Ver ficha completa</button>
                                        </div>
                                    ) : (
                                        <div className={styles.btnsAluno}>
                                            <button className={styles.btnVoltarBottomAluno} onClick={() => setContatar(false)}>
                                                <img src="/img/iconBack.svg" alt="Voltar" className={styles.iconVoltar} />
                                            </button>
                                            <button className={styles.btnContatar} onClick={() => setLembrete("pagamento")}>Lembrete de pagamento </button>
                                            <button className={styles.btnContatar} onClick={() => setLembrete("incentivo")}>Mensagem de incentivo </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Lembrete setLembrete={setLembrete} tipo={lembrete} desativarLembrete={desativarLembrete} />
                        )}

                        <p className={`${styles.msgToast} ${toastLembrete ? styles.toast : ""}`}>Mensagem enviada!</p>
                    </div>
                </>
            )}
        </div>
    )
}
