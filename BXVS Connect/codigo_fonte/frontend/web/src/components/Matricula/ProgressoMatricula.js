import { useState } from "react"
import styles from "./ProgressoMatricula.module.css"
import ProgressoMatriculaItem from "./ProgressoMatriculaItem"
import { FiUser } from "react-icons/fi";
import { LuScrollText, LuScanEye } from "react-icons/lu";

export default function ProgressoMatricula(props){
    
    return(
        <div className={styles.progressoMatriculaContainer}>
            <ProgressoMatriculaItem icon={<FiUser size={20}/>} iconConcluido={<FiUser size={20} color="#9ECD1D"/>} title={"Dados Pessoais"} status={props.dadosPessoais.dadosPessoais} setStatus={props.dadosPessoais.setDadosPessoais}/>
            <ProgressoMatriculaItem icon={<LuScrollText size={20}/>} iconConcluido={<LuScrollText size={20} color="#9ECD1D"/>} title={"Escolha de plano e pagamento"} status={props.escolhaPlano.escolhaPlano} setStatus={props.escolhaPlano.setEscolhaPlano}/>
            <ProgressoMatriculaItem icon={<LuScanEye size={20}/>} iconConcluido={<LuScanEye size={20} color="#9ECD1D"/>} title={"Biometria Facial"} status={props.biometria.biometria} setStatus={props.biometria.setBiometria}/>
        </div>
    )
}