import styles from "./CardGestaoAlunos.module.css"

export default function CardGestaoAlunos({titulo, Icon, txt, color = null}){
    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.titulo}>{titulo}</p>
                <Icon strokeWidth={3} color={color}/>
            </div>
            <p className={`${styles.txt}    ${titulo === "Presença média" && styles.colorPresencaMedia}`}>{titulo === "Presença média" ? txt + "%" : txt}</p>
        </div>
    )
}