import styles from "./Confirmacao.module.css"

export default function Confirmacao({logout, setConfirmacao}){
    return(
        <div className={styles.container}>
            <p className={styles.titulo}>Sair</p>
            <p className={styles.txt}>Tem certeza que deseja sair?</p>
            <div className={styles.containerBotoes}>
                <button className={styles.btnCancelar} onClick={() => setConfirmacao(false)}>Cancelar</button>
                <button className={styles.btnSair} onClick={logout}>Sim</button>
            </div>
        </div>
    )
}