import { useEffect, useState } from "react"
import styles from "./ControleAcesso.module.css"
import axios from "axios"
import Aluno from "../components/ControleAcesso/Aluno";
import Checkin from "../components/ControleAcesso/Checkin";

export default function ControleAcesso({setPagina, setAlunoSelecionadoGestaoAlunos, setAtivo}) {

    const [listaCheckin, setListaCheckin] = useState(null)
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [clicado, setClicado] = useState(-1);

    useEffect(() => {
        const dadosCheckin = async () => {
            const a = await axios.get("https://joaofarias16.pythonanywhere.com/controleAcesso");
            setListaCheckin(a.data);
        }
        dadosCheckin();
    }, [listaCheckin]); 

    

    return (
        <div className={styles.controleAcesso}>
            
            <div className={styles.conteudo}>
                <input type="text" placeholder="Pesquisar alunos" className={styles.barraPesquisa} />
                <div className={styles.cards}>
                    <Checkin clicado={clicado} listaCheckin={listaCheckin} setAlunoSelecionado={setAlunoSelecionado} setClicado={setClicado} />
                    <Aluno 
                    alunoSelecionado={alunoSelecionado} 
                    setAlunoSelecionado={setAlunoSelecionado} 
                    setPagina={setPagina} 
                    setAlunoSelecionadoGestaoAlunos={setAlunoSelecionadoGestaoAlunos}
                    setAtivo={setAtivo}
                    />
                </div>
            </div>
        </div>
    )
}