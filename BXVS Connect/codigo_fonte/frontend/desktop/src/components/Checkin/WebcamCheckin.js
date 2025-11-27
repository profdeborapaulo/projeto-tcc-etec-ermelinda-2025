import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function WebcamCheckin({ onCapture }) {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Carregar modelos do face-api
    async function loadModels() {
      const MODEL_URL = "/models";
      
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setLoaded(true);
    }
    loadModels();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    // Iniciar webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream;
    });

    // Verificar rosto continuamente
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections) {
        console.log("Rosto detectado!");
        capturePhoto();
        clearInterval(interval); // Só captura uma vez
      }
    }, 300);

    return () => clearInterval(interval);
  }, [loaded]);

  // Capturar foto automaticamente
  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    const base64 = canvas.toDataURL("image/jpeg");

    onCapture(base64);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: "100%" }} />
    </div>
  );
}
