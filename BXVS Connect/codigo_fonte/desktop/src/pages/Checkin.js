import React, { useRef, useEffect, useState } from "react";
import useFace from "../hooks/useFace";
import FaceFeedback from "../components/Checkin/FaceFeedback";
import styles from "./Checkin.module.css";

export default function Checkin() {
    const videoRef = useRef(null);
    const { detectFace } = useFace(videoRef);

    const [resultadoFace, setResultadoFace] = useState(null);
    const ultimaPessoaRef = useRef(null); // última pessoa detectada

    // 🔹 Inicia a câmera
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(console.error);
    }, []);

    // 🔹 Aguarda o vídeo estar pronto
    const esperarVideoPronto = () => {
        return new Promise(resolve => {
            const checkVideo = setInterval(() => {
                if (videoRef.current && videoRef.current.readyState === 4) {
                    clearInterval(checkVideo);
                    resolve(true);
                }
            }, 100);
        });
    };

    // 🔹 Função principal de validação do rosto
    const validarRosto = async () => {
        const encoding = await detectFace();

        if (!encoding) {
            setResultadoFace({ match: false, msg: "Nenhum rosto detectado" });
            ultimaPessoaRef.current = null; // libera última pessoa
            return;
        }

        try {
            const resposta = await fetch("https://joaofarias16.pythonanywhere.com/validar-face", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ encoding })
            });

            const json = await resposta.json();

            if (!json.match) {
                setResultadoFace({ match: false, msg: "❌ Rosto não reconhecido" });
                ultimaPessoaRef.current = null;
                return;
            }

            // Se a mesma pessoa ainda estiver na frente, não faz nada
            if (ultimaPessoaRef.current === json.cliente.idCliente) {
                return;
            }

            // Atualiza a última pessoa detectada
            ultimaPessoaRef.current = json.cliente.idCliente;

            // Faz check-in/checkout
            const checkinRes = await fetch("https://joaofarias16.pythonanywhere.com/checkin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idCliente: json.cliente.idCliente })
            }).then(r => r.json());

            if (checkinRes.status === "checkin") {
                setResultadoFace({ match: true, msg: "✅ Check-in realizado!" });
            } else if (checkinRes.status === "checkout") {
                setResultadoFace({ match: true, msg: "✅ Check-out realizado!" });
            } else {
                setResultadoFace({ match: true, msg: "⚠️ Já fez check-in e check-out hoje!" });
            }

        } catch (err) {
            console.error("Erro ao validar rosto:", err);
            setResultadoFace({ match: false, msg: "❌ Rosto não cadastrado" });
            ultimaPessoaRef.current = null;
        }
    };

    // 🔹 Detecta continuamente, após vídeo estar pronto
    useEffect(() => {
        let ativo = true;

        const detectarContinuo = async () => {
            await esperarVideoPronto(); // garante vídeo pronto

            while (ativo) {
                await validarRosto();
                await new Promise(r => setTimeout(r, 100)); // detecta rápido, mas sem travar o loop
            }
        };

        detectarContinuo();

        return () => { ativo = false; };
    }, []);

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className={styles.video}
            />
            <FaceFeedback resultado={resultadoFace} />
        </div>
    );
}
