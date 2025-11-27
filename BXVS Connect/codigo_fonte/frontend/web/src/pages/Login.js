import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"

export default function Login({ setCliente }) {

    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setUsuario(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(usuario);
        const login = await axios.post("https://joaofarias16.pythonanywhere.com/login", usuario);
        localStorage.setItem("cliente", JSON.stringify(login.data.cliente));
        localStorage.setItem("token", login.data.token);
        setCliente(login.data.cliente);
        navigate("/");
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <img className={styles.logo} src="/img/logo.png" alt="Logo"/>
                <div className={styles.containerInput}>
                    <label>E-mail</label>
                    <input className={styles.input} type="email" placeholder="E-mail" name="email" onChange={handleChange} required />
                </div>
                <div className={styles.containerInput}>
                    <label>Senha</label>
                    <input className={styles.input} type="password" placeholder="Senha" name="senha" onChange={handleChange} required />
                </div>
                <input type="submit" value="Entrar" className={styles.btnEntrar} />
                <p>Ainda não tenho conta. <span className={styles.link} onClick={() => navigate("/matricula")}>Fazer matrícula</span></p>
            </form>
        </div>
    )
}