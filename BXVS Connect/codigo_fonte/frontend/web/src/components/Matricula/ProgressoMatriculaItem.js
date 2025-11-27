import styles from "./ProgressoMatriculaItem.module.css"

export default function ProgressoMatriculaItem({ icon, iconConcluido, title, status}) {

    return (
        <div className={styles.progressoMatriculaItemContainer}>
            {status === "concluido" ? (
                <>
                    {iconConcluido}
                    <p className={`${styles.title} ${styles.verde}`}>{title}</p>
                    <div className={styles.linha}>
                        <hr className={styles.fullBar}></hr>
                    </div>
                    <img src="/img/checkIcon.png" alt="Check icon" className={styles.checkIcon}/>
                </>
            ) : status === "andamento" ? (
                <>
                    {icon}
                    <p className={styles.title}>{title}</p>
                    <div className={styles.linha}>
                        <hr className={styles.fullBar}></hr>
                    </div>
                    <div className={styles.ball}/>
                </>
            ) : (
                <>
                    {icon}
                    <p className={styles.title}>{title}</p>
                    <div className={styles.linha}>
                        <hr></hr>
                    </div>
                </>
            )}
        </div>
    )
}