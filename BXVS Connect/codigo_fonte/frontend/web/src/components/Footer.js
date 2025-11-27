import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer>
            <div className={styles.footerContainer}>
                <img className={styles.logoFooterLeft} src="/img/logo.png" alt="Logo da empresa" />
                <img className={styles.logoFooterRight} src="/img/logo.png" alt="Logo da empresa" />
                <section>
                    <p className={styles.tituloFooter}><span className={styles.green}>BXVS</span> PARNAÍBA</p>
                </section>
                <section>
                    <a href="#sobre"><p className={styles.linkFooter}>QUEM SOMOS</p></a>
                    <a href="#professores"><p className={styles.linkFooter}>PROFESSORES</p></a>
                    <a href="#planos"><p className={styles.linkFooter}>PLANOS</p></a>
                    <a href="#matricula"><p className={styles.linkFooter}>MATRÍCULAS</p></a>
                </section>
                <section>
                    <p className={styles.linkFooter}>contato:  (11) 99234-0416</p>
                    <p className={styles.linkFooter}>Endereço: R. Padre Luís Alves de Siqueira<br /> e Castro, 527 - C6 - Jardim Parnaiba,<br /> Santana de Parnaíba - SP, 06501-210 </p>
                </section>
                <section>
                    <div className={styles.redeSocialItem}>
                        <img className={styles.redeSocialIcon} src="/img/iconInstagram.png" alt="Ícone do Instagram" />
                        <p className={styles.linkRedeSocial}>Instagram</p>
                    </div>
                    <div className={styles.redeSocialItem}>
                        <img className={styles.redeSocialIcon} src="/img/iconFacebook.png" alt="Ícone do Facebook" />
                        <p className={styles.linkRedeSocial}>Facebook</p>
                    </div>
                    <div className={styles.redeSocialItem}>
                        <img className={styles.redeSocialIcon} src="/img/iconYoutube.png" alt="Ícone do Youtube" />
                        <p className={styles.linkRedeSocial}>Youtube</p>
                    </div>
                </section>
            </div>
            <p className={styles.direitosAutorais}>@ 2025 bxvs academia | todos os direitos reservados</p>
        </footer>
    )

}