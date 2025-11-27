import { useEffect, useState } from "react"
import styles from "./Configuracoes.module.css"
import { LuCamera } from "react-icons/lu";
import axios from "axios";

export default function Configuracoes({ adm, setAdm }) {

    const [admAtualizado, setAdmAtualizado] = useState(null);

    useEffect(() => {
        if (adm) {
            setAdmAtualizado(adm)
        }
    }, [adm]);


    useEffect(() => {
        if (!admAtualizado || !adm) return;

        if (JSON.stringify(adm) !== JSON.stringify(admAtualizado)) {
            axios.put(`https://joaofarias16.pythonanywhere.com/adm/${adm.idProfessor}`, admAtualizado).then(() => setAdm(admAtualizado))
                .catch(err => console.log(err));
        }
    }, [admAtualizado, adm]);


    return (
        <div className={styles.container}>
            <section>
                <h2>Tema e aparência</h2>
                <div className={styles.containerInput}>
                    <label>Tema do sistema</label>
                    <select value={admAtualizado?.tema} onChange={e => setAdmAtualizado(prev => ({ ...prev, tema: e.target.value }))}>
                        <option value="Padrão">Padrão</option>
                        <option value="Tema 2">Tema 2</option>
                    </select>
                </div>
                <div className={styles.containerInput}>
                    <label>Cor primária/destaque</label>
                    <select value={admAtualizado?.corPrimaria} onChange={e => setAdmAtualizado(prev => ({ ...prev, corPrimaria: e.target.value }))}>
                        <option value="Padrão (BXVS)">Padrão (BXVS)</option>
                        <option value="Cor secundária">Cor secundária</option>
                    </select>
                </div>
            </section>
            <section>
                <h2>Sistema e operação</h2>
                <div className={styles.containerInput}>
                    <label>Idioma</label>
                    <select value={admAtualizado?.idioma} onChange={e => setAdmAtualizado(prev => ({ ...prev, idioma: e.target.value }))}>
                        <option value="Português">Português</option>
                        <option value="Inglês">Inglês</option>
                    </select>
                </div>
                <div className={styles.containerInput}>
                    <label>Mostrar data/horário</label>
                    <div className={styles.containerBtnTroca}>
                        <button className={`${styles.btnTroca} ${!admAtualizado?.mostrarDataHora && styles.desativado}`}></button>
                        <p className={styles.txtBtnTroca} onClick={() => setAdmAtualizado(prev => ({ ...prev, mostrarDataHora: 1 }))}>Ativado</p>
                        <p className={styles.txtBtnTroca} onClick={() => setAdmAtualizado(prev => ({ ...prev, mostrarDataHora: 0 }))}>Desativado</p>
                    </div>
                </div>
                <div className={styles.containerInput}>
                    <label>Fuso horário</label>
                    <select value={admAtualizado?.fusoHorario} onChange={e => setAdmAtualizado(prev => ({ ...prev, fusoHorario: e.target.value }))}>
                        <option value="Horário de Brasília">Horário de Brasília</option>
                        <option value="Horário 2">Horário 2</option>
                    </select>
                </div>
                <div className={styles.containerInput}>
                    <label>Notificações</label>
                    <p className={styles.dica}>Enviar lembrete para alunos</p>
                    <div className={styles.containerBtnTroca}>
                        <button className={`${styles.btnTroca} ${!admAtualizado?.notificacoes && styles.desativado}`}></button>
                        <p className={styles.txtBtnTroca} onClick={() => setAdmAtualizado(prev => ({ ...prev, notificacoes: 1 }))}>Ativado</p>
                        <p className={styles.txtBtnTroca} onClick={() => setAdmAtualizado(prev => ({ ...prev, notificacoes: 0 }))}>Desativado</p>
                    </div>
                </div>
            </section>
            <section>
                <h2>Minha conta</h2>
                <label style={{ width: 100, textAlign: "center" }}>Foto de perfil</label>
                <div className={styles.containerConta}>
                    <div className={styles.containerPerfil}>
                        <div className={styles.fotoPerfil}>
                            <LuCamera size={30} />
                        </div>
                    </div>
                    <button className={`${styles.btnPerfil} ${styles.btnCinza}`}>Adicionar foto</button>
                    <button className={`${styles.btnPerfil} ${styles.btnExcluirFoto}`}>Excluir foto</button>
                </div>
                <div className={styles.containerInput}>
                    <label>Nome de usuário</label>
                    <input className={styles.inputConfiguracao} type="text" placeholder={adm.nome} disabled />
                </div>
                <div className={styles.containerInput}>
                    <label>Código de acesso</label>
                    <button className={`${styles.btnPerfil} ${styles.btnCinza}`}>Alterar código</button>
                </div>
                <div className={styles.containerInput}>
                    <label>Authenticação em duas etapas <span className={styles.dica}>Em breve</span></label>
                    <select disabled defaultValue="desativado">
                        <option value="desativado">Desativado</option>
                    </select>
                </div>
            </section>
            <section>
                <h2>Dados e privacidade</h2>
                <div className={styles.containerInput}>
                    <label>Cache</label>
                    <button className={`${styles.btnPerfil} ${styles.btnCinza}`}>Limpar cache</button>
                    <label>Termos de uso e política LGPD</label>
                    <button className={`${styles.btnPerfil} ${styles.btnCinza}`}>Ver termos de uso</button>
                </div>
            </section>
        </div>
    )
}