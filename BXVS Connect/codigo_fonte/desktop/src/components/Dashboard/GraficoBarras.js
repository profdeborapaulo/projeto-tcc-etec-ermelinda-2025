import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./Graficos.module.css"

export default function GraficoBarras({ dados, titulo, minTickGap, dataKey }) {

    return (
        <div className={styles.container}>
            <p className={styles.titulo}>{titulo}</p>
            {dados ? 
            <ResponsiveContainer height="100%" width="100%">
                <BarChart
                    barSize={12}
                    data={dados}
                    responsive
                >
                    <YAxis width="auto" tickLine={false} minTickGap={minTickGap} tick={{ fill: "#D5E3AE", }} tickFormatter={value => `${titulo === "Faturamento p/mês" ? "R$" : ""}${value}${titulo === "Movimento semanal" ? "%" : ""}`} />
                    <XAxis dataKey={dataKey === "porcentagem" ? "diaSemana" : "mes"} tickLine={false} tick={{ fill: "#D5E3AE" }} />
                    <CartesianGrid horizontal={true} vertical={true} stroke="#D5E3AE" />
                    <Tooltip cursor={false} contentStyle={{
                        background: "rgba(0, 0, 0, 0.8)",
                        borderWidth: 0,
                        borderRadius: 10
                    }} />
                    <Bar dataKey={dataKey} fill="#9ECD1D" radius={5} isAnimationActive={false} />
                </BarChart>
            </ResponsiveContainer> : <p className={styles.txtGraficoVazio}>Ainda não há {titulo}</p>}
            
        </div>
    )
}