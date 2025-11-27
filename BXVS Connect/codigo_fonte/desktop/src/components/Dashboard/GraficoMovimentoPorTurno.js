import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./Graficos.module.css"

export default function GraficoMovimentoPorTurno({dados}) {
    const coresPorTurno = {
        "Manhã": "#9ECD1D",
        "Tarde": "#F200FF",
        "Noite": "#00C2FF"
    };

    const dadosComCor = dados?.map(item => ({
        ...item,
        fill: coresPorTurno[item.turno] || "#999"
    }));

    return (
        <div className={styles.graficoTurno}>
            <div className={styles.headerGraficoTurno}>
                <p className={styles.titulo}>Movimento p/turno</p>

                {dados && <div style={{ display: "flex", gap: 10 }}>
                    {dadosComCor.map((item) => (
                        <div key={item.turno} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div
                                style={{
                                    width: 15,
                                    height: 15,
                                    borderRadius: "50%",
                                    backgroundColor: item.fill,
                                }}
                            />
                            <span>{item.turno}</span>
                        </div>
                    ))}
                </div>}
            </div>
            {dados ? <ResponsiveContainer width="100%" height="100%" style={{position: "relative"}}>
                <p className={styles.txtMeioGraficoCircular}>100%</p>
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="90%"
                    barSize={10}
                    data={dadosComCor}
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive={false}
                >
                    <RadialBar
                        background
                        dataKey="porcentagem"
                        isAnimationActive={false}
                        fill="#fff"
                    />

                    <Tooltip
                        cursor={false}
                        contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                        labelStyle={{ color: "#9ECD1D" }}
                    />
                </RadialBarChart>
            </ResponsiveContainer> : <p className={styles.txtGraficoVazio}>Não hove movimento hoje</p>}
            
        </div>
    );
}
