import styles from "./TelaSplash.module.css"

export default function Splash({ fade }) {
    return (
        <div className={`${styles.splash} ${fade ? styles.fadeOut : ""}`}>
            <img className={styles.imgBackgroundHome} src="/img/logo.png" alt="Logo" />
            <p className={styles.titleBkHome}>BXVS CONNECT</p>
            <p className={styles.txtBkHome}>SUA GESTÃO INTELIGENTE</p>
        </div>
    )
}