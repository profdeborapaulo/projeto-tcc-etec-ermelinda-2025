import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Plano from '../components/Home/Plano';

export default function Home(props) {

    const [rosto, setRosto] = useState(null);
    const [planos, setPlanos] = useState([]);

    useEffect(() => {
        
        const buscarRosto = async () => {
            if (props.cliente?.statusPagamento !== "Pago") return;
            const res = await axios.get("https://joaofarias16.pythonanywhere.com/cliente/" + props.cliente.idCliente);
            setRosto(res.data.face_embedding);
            props.setCliente(res.data);
            localStorage.setItem("cliente", JSON.stringify(res.data));
        }
        buscarRosto();
    }, [props.cliente]);

    useEffect(() => {
        axios.get("https://joaofarias16.pythonanywhere.com/api/planos").then(res => setPlanos(res.data));
    }, []);

    return (
        <>
            <Header cliente={props.cliente} setCliente={props.setCliente} />
            <div className={styles.container}>
                <div className={styles.imgInicio}>
                    <div className={styles.boxInicio}>
                        <p className={styles.titleInicio}>
                            <span className={styles.verde}>BXVS</span> VIDA SAUDÁVEL
                        </p>
                        <p className={styles.txtDescricao}>
                            MUITO MAIS QUE UM TREINO, UM ESTILO DE VIDA
                        </p>
                        <a href="#planos">
                            <button className={styles.btnConferirPlanos}>CONFERIR PLANOS</button>
                        </a>
                    </div>
                    <div className={styles.gradientBottom}></div>
                    <hr className={styles.hrInicio}></hr>
                    <div className={styles.boxRight}></div>
                    <div className={styles.gradientRight}></div>
                </div>
                <main>
                    <h1 className={styles.sobreh1} id="sobre">SOBRE O BXVS</h1>
                    <div className={styles.descricaoContainer}>
                        <div className={styles.txtDescricaoContainer}>
                            <h2 className={styles.tituloDescricao}>UM ESTILO DE VIDA</h2>
                            <p className={styles.txtDescricao}>
                                O <span className={styles.verde}>BOX VIDA SAUDÁVEL</span> É UM CENTRO DE TREINAMENTO FOCADO<br></br>
                                EM PROPORCIONAR EXPERIÊNCIAS TRANSFORMADORAS,<br></br> UNINDO MÉTODOS MODERNOS DE{' '}
                                <span className={styles.verde}>CROSS TRAINING</span>, <br></br> ACOMPANHAMENTO PRÓXIMO E UM AMBIENTE ACOLHEDOR.
                            </p>
                        </div>
                        <img src="/img/imgDescricao1.png" alt="Mulher treinando" className={styles.imgDescricao} />

                    </div>
                    <div className={styles.descricaoContainer}>
                        <img src="/img/imgDescricao2.png" alt="Mulher treinando" className={styles.imgDescricao} />
                        <div className={styles.txtDescricaoContainer}>
                            <h2 className={styles.tituloDescricao}>COMUNIDADE ATIVA</h2>
                            <p className={styles.txtDescricao}>
                                Criamos uma comunidade onde alunos e treinadores<br></br>
                                <span className={styles.verde}>se apoiam</span>, compartilham conquistas e se motivam<br></br>
                                todos os dias. Aqui, cada vitória é celebrada <span className={styles.verde}>em grupo</span>.
                            </p>
                        </div>
                    </div>
                    <div className={styles.professoresContainer} id="professores">
                        <p className={styles.tituloProfessores}>PROFESSORES ESPECIALIZADOS</p>
                        <div className={styles.cardsProfessor}>
                            <div className={styles.cardProfessor}>
                                <img src="/img/professor1.png" alt="Professor 1" className={styles.imgProfessor} />
                                <p className={styles.nomeProfessor}>PEDRO FRANCISCO</p>
                            </div>
                            <div className={styles.cardProfessor}>
                                <img src="/img/professor2.png" alt="Professor 1" className={styles.imgProfessor} />
                                <p className={styles.nomeProfessor}>JIN JEN</p>
                            </div>
                            <div className={styles.cardProfessor}>
                                <img src="/img/professor3.png" alt="Professor 1" className={styles.imgProfessor} />
                                <p className={styles.nomeProfessor}>AMIEL SHARON</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.descricaoContainer}>
                        <div className={styles.txtDescricaoContainer}>
                            <h2 className={styles.tituloDescricao}>Venha nos conhecer!</h2>
                            <p className={styles.txtDescricao}>
                                Estamos localizados na R. Padre Luís Alves de<br></br>
                                Siqueira e Castro, 527 - C6 - Jardim Parnaiba, Santana <br></br>
                                de Parnaíba - SP, 06501-210
                                <br></br>
                                <br></br>
                                Próximo à secretaria da mulher
                            </p>
                        </div>
                        <img src="/img/imgDescricao3.png" alt="Mulher treinando" className={styles.imgDescricao} />
                    </div>
                    <div className={styles.planosContainer} id="planos">
                        <hr className={styles.hr}></hr>
                        <p className={styles.tituloPlanos}>PLANOS</p>
                        <div className={styles.cardsPlanosContainer}>
                            {planos?.map(plano => <Plano plano={plano} key={plano.idPlano}/>)}
                        </div>
                    </div>
                    <div className={styles.treinosEspeciaisContainer}>
                        <hr className={styles.hr}></hr>
                        <p className={styles.tituloTreinosEspeciais}>TREINOS ESPECIAIS</p>
                        <div className={styles.cardsTreinosEspeciais}>
                            <div className={styles.cardTreinoEspecial}>
                                <img src="/img/imgTreinoEspecial1.png" alt="Treino Especial 1" className={styles.imgTreinoEspecial} />
                                <div className={styles.txtCardTreinoEspecial}>
                                    <p className={styles.nomeTreinoEspecial}>CROSS FIT <span className={styles.greenGradient}>RAIZ</span></p>
                                    <p className={styles.descricaoTreinoEspecial}>No Treino Raiz, a pegada é <span className={styles.verde}>old scholl</span>: movimentos clássicos, <span className={styles.verde}>intensidade máxima</span> e aquele espírito de superação que faz a diferença.</p>
                                </div>
                                <div className={styles.gradientTreinoEspecial}></div>
                            </div>
                            <div className={styles.cardTreinoEspecial}>
                                <img src="/img/imgTreinoEspecial2.png" alt="Treino Especial 2" className={styles.imgTreinoEspecial}></img>
                                <div className={styles.txtCardTreinoEspecial}>
                                    <p className={styles.nomeTreinoEspecial}>hyrox</p>
                                    <p className={styles.descricaoTreinoEspecial}>corrida funcional que combina <span className={styles.verde}>8 km</span> de corrida intercalados com 8 estações de exercícios que envolvem resistência, força e condicionamento.</p>
                                </div>
                                <div className={styles.gradientTreinoEspecial}></div>
                            </div>
                        </div>
                        <div className={styles.cardsTreinosEspeciais}>
                            <div className={styles.cardTreinoEspecial}>
                                <img src="/img/imgTreinoEspecial3.png" alt="Treino Especial 3" className={styles.imgTreinoEspecial} />
                                <div className={styles.txtCardTreinoEspecial}>
                                    <p className={styles.nomeTreinoEspecial}>treino de corrida</p>
                                    <p className={styles.descricaoTreinoEspecial}>Ou papa-léguas, Aqui o foco é desenvolver velocidade, resistência e técnica. Um treino que desafia seus limites a cada quilômetro.</p>
                                </div>
                                <div className={styles.gradientTreinoEspecial}></div>
                            </div>
                            <div className={styles.cardTreinoEspecial}>
                                <img src="/img/imgTreinoEspecial4.png" alt="Treino Especial 4" className={styles.imgTreinoEspecial} />
                                <div className={styles.txtCardTreinoEspecial}>
                                    <p className={styles.nomeTreinoEspecial}>força <span className={styles.greenGradient}>total</span></p>
                                    <p className={styles.descricaoTreinoEspecial}>No Força Total, a sexta-feira é dia de explosão, com exercícios pesados, foco absoluto e aquela energia coletiva que faz você ir além do limite.</p>
                                </div>
                                <div className={styles.gradientTreinoEspecial}></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.garantirVagaContainer} id="matricula">
                        <hr className={styles.hr}></hr>
                        <p className={styles.tituloGarantirVaga}>GARANTA SUA VAGA E COMECE SUA<br /> JORNADA NO BXVS PARNAÍBA!</p>
                        {props.cliente?.face_embedding ?
                            <>
                                <button className={styles.btnGarantirVagaDesativado} >INICIAR MATRÍCULA</button>
                                <p className={styles.txtMatriculado}>Já matriculado. <Link to={"/perfil"} className={styles.linkVerMatricula}>Ver minha matrícula</Link></p>
                            </> : localStorage.getItem("cliente") ?
                            <Link className={styles.btnGarantirVaga} to={"/matricula"}>CONTINUAR MATRÍCULA</Link> : 
                            <Link className={styles.btnGarantirVaga} to={"/matricula"}>INICIAR MATRÍCULA</Link>}
                    </div>
                </main>
            </div>
            <Footer />
        </>
    )
}