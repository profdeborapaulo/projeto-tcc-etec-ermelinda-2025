export default function FaceFeedback({ resultado }) {
    if (!resultado) return null;

    return (
        <div style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: resultado.match ? "#4caf50" : "#f44336",
            color: "#fff",
            fontWeight: "bold",
            zIndex: 10
        }}>
            {resultado.msg}
        </div>
    );
}
