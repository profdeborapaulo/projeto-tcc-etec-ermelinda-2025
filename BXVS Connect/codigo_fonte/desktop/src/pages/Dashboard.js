import styles from "./Dashboard.module.css";
import { LuSlidersHorizontal, LuCircleDollarSign, LuScrollText, LuUserRoundCheck } from "react-icons/lu";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { useEffect, useState } from "react";
import GraficoPlanos from "../components/Dashboard/GraficoPlanos";
import GraficoMovimentoPorTurno from "../components/Dashboard/GraficoMovimentoPorTurno";
import GraficoBarras from "../components/Dashboard/GraficoBarras";
import GraficoBarrasHorizontais from "../components/Dashboard/GraficoBarrasHorizontais";
import axios from "axios";

export default function Dashboard() {

    const [txtFiltro, setTxtFiltro] = useState("");
    const [filtro, setFiltro] = useState(false);
    const [receitaTotal, setReceitaTotal] = useState(0);
    const [lucroMensal, setLucroMensal] = useState(0);
    const [pagamentosPendentes, setPagamentosPendentes] = useState(0);
    const [matriculasMes, setMatriculasMes] = useState(0);
    const [planosMaisEscolhidos, setPlanosMaisEscolhidos] = useState(null)
    const [faturamentoMes, setFaturamentoMes] = useState(null);
    const [movimentoSemanal, setMovimentoSemanal] = useState(null);
    const [movimentoTurno, setMovimentoTurno] = useState(null);
    const [publico, setPublico] = useState(null);
    const [faixaEtaria, setFaixaEtaria] = useState(null);

    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/receitaTotal")
        .then(res => setReceitaTotal(res.data.receitaTotal ? res.data.receitaTotal : 0));
    },[]);

    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/lucroMensal")
        .then(res => setLucroMensal(res.data.lucroMensal ? res.data.lucroMensal : 0));
    },[]);

    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/pagamentosPendentes")
        .then(res => setPagamentosPendentes(res.data.pagamentosPendentes ? res.data.pagamentosPendentes : 0));
    },[]);
    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/matriculasMes")
        .then(res => setMatriculasMes(res.data.matriculasMes ? res.data.matriculasMes : 0));
    },[]);
    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/planosMaisEscolhidos")
        .then(res => {
            if(res.data){
                const planos = res.data;
                let quantidadeEscolhido = 0;
                planos.map(plano => {
                    if(plano.quantidadeEscolhido > 0) quantidadeEscolhido = plano.quantidadeEscolhido;
                })
                setPlanosMaisEscolhidos(!quantidadeEscolhido ? null : planos)
            }
        });
    },[]);
    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/faturamentoMes")
        .then(res => {
            if(!res.data?.length){
                return;
            } else {
                setFaturamentoMes(res.data);
            }
        });
    },[]);
    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/movimentoSemanal")
        .then(res => {
            if(!res.data?.length){
                return;
            } else {
                setMovimentoSemanal(res.data);
            }
        });
    },[]);
    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/movimentoTurno")
        .then(res => {
            if(!res.data?.length){
                return;
            } else{
                setMovimentoTurno(res.data);
            }
        });
    },[]);
    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/publico")
        .then(res => {
            if(res.data){
                const publicos = res.data;
                let total = 0;
                publicos.map(publico => {
                    if(publico.total > 0) total = publico.total;
                })
                setPublico(!total ? 0 : publicos);
            }
        });
    },[]);
    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/dashboard/faixaEtaria")
        .then(res => {
            if(!res.data?.length){
                return;
            } else{
                setFaixaEtaria(res.data);
            }
        });
    },[]);


    const CardMenor = ({ Icon, titulo, conteudo = 0, cor }) => {
        return (
            <div className={styles.cardMenor}>
                <div className={styles.containerTituloCardMenor}>
                    <Icon color={cor} size={20} />
                    <p className={styles.tituloCardMenor}>{titulo}</p>
                </div>
                <p className={styles.conteudoCardMenor}>{`${String(conteudo)?.includes(".") ? "R$" : ""} ${conteudo = 0 ? conteudo : conteudo?.toString().replace(".", ",")}`}</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {faixaEtaria && 
            receitaTotal ? 
            <>
            <div className={styles.containerCardsMenores}>
                <div className={styles.containerFiltro}>
                    <button className={styles.btnFiltrar}><LuSlidersHorizontal style={{ zIndex: 2 }} size={15} strokeWidth={2.5} onClick={() => setFiltro(!filtro)} /></button>
                    <p className={styles.labelFiltro}>Filtrar por: {txtFiltro}</p>
                    <div className={`${styles.listaFiltro} ${filtro && styles.filtroAberto}`}>
                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltro("Semana"); setFiltro(!filtro) }}>Semana</p>
                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltro("Mês"); setFiltro(!filtro) }}>Mês</p>
                        <p className={styles.itemFiltro} onClick={() => { setTxtFiltro("Ano"); setFiltro(!filtro) }}>Ano</p>
                    </div>
                </div>
                <CardMenor Icon={LuCircleDollarSign} titulo="Receita total" conteudo={receitaTotal} cor="#9ECD1D" />
                <CardMenor Icon={HiArrowTrendingUp} titulo="Lucro mensal" conteudo={lucroMensal} cor="#fff" />
                <CardMenor Icon={LuScrollText} titulo="Pagamentos pendentes" conteudo={pagamentosPendentes} cor="#FFC300" />
                <CardMenor Icon={LuUserRoundCheck} titulo="Matrícula nesse mês" conteudo={matriculasMes} cor="#fff" />
            </div>
            <div className={styles.containerCardsMaiores}>
                <div className={styles.linhaCardsMaiores}>
                    <GraficoPlanos dados={planosMaisEscolhidos} />
                    <GraficoBarras dados={faturamentoMes} titulo="Faturamento p/mês" minTickGap={20} dataKey={"faturamento"} />
                </div>
                <div className={styles.linhaCardsMaiores}>
                    <GraficoBarras dados={movimentoSemanal} titulo="Movimento semanal" minTickGap={50} dataKey={"porcentagem"} />
                    <GraficoMovimentoPorTurno dados={movimentoTurno} />
                </div>
                <div className={styles.linhaCardsMaiores}>
                    <GraficoBarrasHorizontais dados={publico} titulo="Público" />
                    <GraficoBarrasHorizontais dados={faixaEtaria} titulo="Faixa etária" />
                </div>
            </div>
            </> : <p>Carregando...</p>}
        </div>
    )
}