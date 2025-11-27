import { Link } from "react-router-dom"
import styles from "./Concluido.module.css"

export default function Concluido({nome}) {
    return (
        <div className={styles.container}>
            <img src="/img/logo.png" alt="Logo" className={styles.logo} />
            <p className={styles.titulo}>matrícula concluída</p>
            <p className={styles.descricao}>Seja bem-vindo ao BXVS – Box Vida Saudável
                {}.</p>
            <Link to={"/"} className={styles.btnPaginaInicial}>voltar à pagina inicial</Link>
            <Link to={"/perfil"} className={styles.linkMatricula}>Ver minha matrícula</Link>
        </div>
    )
}