import styles from "./Lembrete.module.css"

export default function Lembrete({setLembrete, tipo, desativarLembrete}) {
    return (
        <>
            <button className={styles.btnVoltarLembrete} onClick={() => setLembrete("")}>
                <img src="/img/iconBack.svg" alt="Voltar" className={styles.iconVoltar} />
            </button>
            <p className={styles.titleLembrete}>Lembrete de {tipo}</p>
            <textarea type="text" placeholder={`Lembrete de ${tipo}`} className={styles.textareaLembrete} >
                {`Aqui vai ficar um texto de lembrete de ${tipo} padrão`}
            </textarea>
            <button className={styles.btnEnviarLembretePagamento} onClick={() => desativarLembrete()}>Enviar</button>
        </>
    )
}