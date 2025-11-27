import { useEffect, useState } from "react";
import styles from "./Checkin.module.css"
import ModeloCheckin from "./ModeloCheckin";
import axios from "axios";

export default function Checkin({ listaCheckin, setClicado, clicado, setAlunoSelecionado }) {

    const [totais, setTotais] = useState({});

    useEffect(() => {
        const pegarTotais = async () => {
            const t = await axios.get("https://joaofarias16.pythonanywhere.com/totais");
            setTotais(t.data);
        }
        pegarTotais();
    }, [])

    return (
        <div className={styles.conteudoControleAcesso}>
            <div className={styles.contagem}>
                <div className={styles.cardContagem}>
                    <p className={styles.labelContagem}>Alunos presentes</p>
                    <p className={styles.numeroContagem}>{totais.totalPresentes}</p>
                </div>
                <div className={styles.cardContagem}>
                    <p className={styles.labelContagem}>Entradas registradas</p>
                    <p className={styles.numeroContagem}>{totais.totalEntradas}</p>
                </div>
                <div className={styles.cardContagem}>
                    <p className={styles.labelContagem}>Saídas registradas</p>
                    <p className={styles.numeroContagem}>{totais.totalSaidas}</p>
                </div>
                <div className={styles.cardContagem}>
                    <p className={styles.labelContagem}>Alunos com pendências</p>
                    <p className={styles.numeroContagem}>{totais.totalPendencias}</p>
                </div>
            </div>
            <div className={styles.checkins}>
                <p className={styles.titleCheckin}>Check ins</p>
                <div className={styles.titlesLista}>
                    <p className={styles.ajuste}>Nome:</p>
                    <p className={styles.titleLista}>Chegou em:</p>
                    <p className={styles.titleLista}>Saiu em:</p>
                    <p className={styles.titleLista}>Situação:</p>
                    <p className={styles.titleLista}>Código ID:</p>
                </div>
                <div className={styles.listaCheckin}>
                    {listaCheckin?.length ? listaCheckin.map((aluno) => (
                        <ModeloCheckin aluno={aluno} key={aluno.id} onClick={() => { setClicado(aluno.id); setAlunoSelecionado(aluno) }} ativo={clicado === aluno.id} />
                    )): "Ainda não houve movimento hoje"}
                </div>
            </div>
        </div>
    )
}