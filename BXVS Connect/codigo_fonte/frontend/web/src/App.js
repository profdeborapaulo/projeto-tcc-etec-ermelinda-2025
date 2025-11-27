import styles from "./App.module.css"
import Home from "./pages/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Matricula from "./pages/Matricula"
import ScrollToTop from "./components/ScrollToTop"
import { useEffect, useState } from "react"
import axios from "axios"
import Perfil from "./pages/Perfil"
import Login from "./pages/Login"

export default function App() {

  const [cliente, setCliente] = useState(null);
  useEffect(() => {
    const storedCliente = localStorage.getItem("cliente");
    const storedToken = localStorage.getItem("token");

    if (storedCliente && storedToken) {
      try {
        const parsedCliente = JSON.parse(storedCliente);
        setCliente(parsedCliente);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error("Erro ao parsear cliente:", err);
        localStorage.removeItem("cliente"); // limpa dados corrompidos
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home cliente={cliente} setCliente={setCliente} />} />
          <Route path="/login" element={<Login setCliente={setCliente}/>}/>
          <Route path="/matricula" element={<Matricula cliente={cliente} setCliente={setCliente} />} />
          <Route path="/perfil" element={<Perfil cliente={cliente} setCliente={setCliente} />} />
        </Routes>
      </BrowserRouter>
    </div>






  )
}