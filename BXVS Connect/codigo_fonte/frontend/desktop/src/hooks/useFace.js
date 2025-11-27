import { useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";

export default function useFace(videoRef) {

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";

            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

            console.log("➡ Modelos carregados!");
        };

        loadModels();
    }, []);

    const detectFace = useCallback(async () => {
        if (!videoRef.current) return null;

        const result = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!result) return null;

        return Array.from(result.descriptor); // 128 numbers
    }, [videoRef]);

    return { detectFace };
}
