import { useEffect, useState } from 'react';
import styles from './TelaDescanco.module.css';

export default function TelaDescanco() {
    const [ativa, setAtiva] = useState(false);
    const [visivel, setVisivel] = useState(false);

    const [hora, setHora] = useState(new Date());

    useEffect(() => {
        const intervalo = setInterval(() => {
            setHora(new Date());
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {

        let tempoInativo;
        const resetTempoInativo = () => {
            clearTimeout(tempoInativo);
            tempoInativo = setTimeout(() => {
                setAtiva(true);
                setTimeout(() => setVisivel(true), 10);
            }, 300000); // 5 minutos
        };

        resetTempoInativo();
        const events = ['mousemove', 'click', 'keydown', 'wheel'];
        events.forEach(event => window.addEventListener(event, () => resetTempoInativo()));

        if (visivel) {
            events.forEach(event => window.addEventListener(event, () => { setVisivel(false); setTimeout(() => setAtiva(false), 500); }));
        }

    }, [visivel]);

    return (
        <div className={`${styles.telaDescanso} ${ativa && styles.telaDescansoAtiva} ${visivel && styles.telaDescansoAparecendo}`}>
            <div className={styles.filtro} />
            <div className={styles.gradientTop} />
            <div className={styles.box}>
                <img className={styles.logoDescanco} src="/img/logo.png" alt='Logo' />
                <p className={styles.nomeApp}>BXVS CONNECT</p>
                <p className={styles.txtApp}>SUA GESTÃO INTELIGENTE</p>
            </div>
            <div className={styles.gradientBottom}>
                <p className={styles.data}>{hora.toLocaleDateString()}</p>
                <p className={styles.data}>{hora.toLocaleTimeString()}</p>
            </div>
        </div>
    );
}