import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./Graficos.module.css"


export default function GraficoBarrasHorizontais({dados, titulo}) {
  return (
    <div className={styles.container}>
      <p className={styles.titulo}>{titulo}</p>
      {dados ? <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dados}
          layout="vertical"
          barSize={15}
        >

          <XAxis type="number" hide /> 
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#fff", fontSize: 12 }}
          />

          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#1f1f1f",
              border: "none",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="valor"
            fill="#9ECD1D"
            background={{fill: "rgba(158, 205, 29, 0.3)", radius: 10}}
            radius={10} // 🔹 bordas arredondadas
          />
        </BarChart>
      </ResponsiveContainer> : <p className={styles.txtGraficoVazio}>Não há {titulo}</p>}
    </div>
  );
}
