import styles from "./ModeloCheckin.module.css"

export default function ModeloCheckin({aluno, onClick, ativo}) {
    return (
        <div className={`${styles.modeloCheckin} ${ativo ? styles.ativo : ""}`} onClick={onClick}>
            <div className={styles.imgNome}>
                <img className={styles.imgCheckin} alt="Foto" src="/img/aluno.svg"/>
                <p className={styles.nomeCheckin}>{aluno.nome}</p>
            </div>
            <p className={styles.txtCheckin}>{aluno.horarioChegada}</p>
            <p className={styles.txtCheckin}>{aluno.horarioSaida ? aluno.horarioSaida : "- - -"}</p>
            <div className={`${styles.situacaoMatricula} ${aluno.situacaoMatricula === "Pendente" ? styles.pendente : aluno.situacaoMatricula === "Atrasado" ? styles.atrasado : ""}`}>{aluno.situacaoMatricula}</div>
            <p className={styles.txtCheckin}>{aluno.id}</p>
        </div>
    )
}