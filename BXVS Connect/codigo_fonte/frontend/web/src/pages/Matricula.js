import Header from "../components/Header";
import BiometriaFacial from "../components/Matricula/BiometriaFacial";
import Concluido from "../components/Matricula/Concluido";
import DadosPessoais from "../components/Matricula/DadosPessoais";
import EscolhaPlano from "../components/Matricula/EscohaPlano";
import ProgressoMatricula from "../components/Matricula/ProgressoMatricula";
import styles from "./Matricula.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Matricula(props) {

    const [dadosPessoais, setDadosPessoais] = useState("andamento");
    const [escolhaPlano, setEscolhaPlano] = useState("");
    const [biometria, setBiometria] = useState("");
    const [searchParams] = useSearchParams();
    const cliente = JSON.parse(localStorage.getItem("cliente"));


    useEffect(() => {
        const matricula = searchParams.get("external_reference");
        if (matricula) {
            setDadosPessoais("concluido");
            setEscolhaPlano("andamento");
        }
    }, [searchParams]);

    useEffect(() => {
        if (cliente && escolhaPlano !== "concluido") {
            setDadosPessoais("concluido");
            setEscolhaPlano("andamento");
        }
    }, [cliente, escolhaPlano]);

    return (
        <>
            <Header cliente={props.cliente} setCliente={props.setCliente} pagina="Matricula" />
            <div className={styles.container}>
                <ProgressoMatricula
                    dadosPessoais={{ dadosPessoais, setDadosPessoais }}
                    escolhaPlano={{ escolhaPlano, setEscolhaPlano }}
                    biometria={{ biometria, setBiometria }}
                />

                {dadosPessoais === "andamento" ? (
                    <DadosPessoais
                        setDadosPessoais={setDadosPessoais}
                        setEscolhaPlano={setEscolhaPlano}
                        setCliente={props.setCliente}
                        cliente={props.cliente}
                    />
                ) : escolhaPlano === "andamento" ? (
                    <EscolhaPlano
                        setEscolhaPlano={setEscolhaPlano}
                        setBiometria={setBiometria}
                        cliente={cliente}
                        setCliente={props.setCliente}
                    />
                ) : biometria === "andamento" ? (
                    <BiometriaFacial setBiometria={setBiometria} cliente={props.cliente} setCliente={props.setCliente} />
                ) : <Concluido nome={props.cliente.nome} />}
            </div>
        </>
    );
}
