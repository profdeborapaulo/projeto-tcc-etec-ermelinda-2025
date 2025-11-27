import parseReal from "../ParseReal"
import ParseReal from "../ParseReal"
import styles from "./Plano.module.css"

export default function Plano(props){
    return(
        <div className={styles.planoCard}>
            <div className={`${styles.radioButton} ${props.plano?.nome === props.titulo ? styles.checked : ""}`} onClick={() => props.escolherPlano(props.titulo, props.preco)}></div>
            <p className={styles.titulo}>{props.titulo}</p>
            <p className={styles.descricao}>{props.descricao}</p>
            <p className={styles.preco}>{parseReal(props.preco)}<span className={styles.txtMes}>/mês</span></p>
        </div>
    )
}