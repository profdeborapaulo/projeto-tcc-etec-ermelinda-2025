import { useState } from "react"
import styles from "./Login.module.css"
import axios from "axios";

export default function Login({setLogin, setAdm}){

    const[usuario, setUsuario] = useState({});

    const change = e => {
        setUsuario(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const login = () => {
        axios.post("https://joaofarias16.pythonanywhere.com/adm", {
            usuario: usuario.usuario, 
            cod: usuario.cod
        }).then(res => {setAdm(res.data); setLogin(true); });
    }

    return(
        <div className={styles.containerLogin}>
            <div className={styles.gradentLeft}>
                <div className={styles.boxBemVindo}>
                    <p className={styles.txtBemVindo}>BEM VINDO AO</p>
                    <img src="/img/logo.png" alt="Logo" className={styles.logoLogin}/>
                    <p className={styles.txtTitleLogin}>BXVS CONNECT</p>
                    <p className={styles.txtSubTitleLogin}>SUA GESTÃO INTELIGENTE</p>
                </div>
            </div>
            <div className={styles.gradentBottom}></div>
            <div className={styles.filtro}></div>
            <div className={styles.boxLogin}>
                <p className={styles.titleLogin}>INICIAR SESSÃO</p>
                <input type="text" className={styles.inputLogin} placeholder="Nome de usuário" onChange={change} name="usuario"/>
                <input type="text" className={styles.inputLogin} placeholder="COD. Acesso" onChange={change} name="cod"/>
                <input type="submit" className={styles.btnEntrar} value="Entrar" onClick={login}/>
            </div>
        </div>
    )
}