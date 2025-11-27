import styles from "./BackgroundHome.module.css"

export default function BackgrounHome(){
    return(
        <div className={styles.backgroundHome}>
            <img className={styles.imgBackgroundHome} src="/img/logo.png" alt="Logo"/>
            <p className={styles.titleBkHome}>BXVS CONNECT</p>
            <p className={styles.txtBkHome}>SUA GESTÃO INTELIGENTE</p>
        </div>
    )
}