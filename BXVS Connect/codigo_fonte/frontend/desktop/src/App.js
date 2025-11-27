import { useEffect, useState } from "react";
import Menu from "./components/App/Menu";
import styles from "./App.module.css"
import ControleAcesso from "./pages/ControleAcesso";
import BackgrounHome from "./components/App/BackgroundHome";
import Login from "./pages/Login"
import TelaSplash from "./components/App/TelaSpalsh"
import TelaDescanco from "./components/App/TelaDescanco";
import GestaoAlunos from "./pages/GestaoAlunos";
import Dashboard from "./pages/Dashboard";
import Configuracoes from "./pages/Configuracoes";
import Checkin from "./pages/Checkin";

export default function App() {
  const [abrirMain, setAbrirMain] = useState(false);
  const [menuFechado, setMenuFechado] = useState(false);
  const [pagina, setPagina] = useState("ControleAcesso");
  const [login, setLogin] = useState(false);
  const [telaSplash, setTelaSplash] = useState(true);
  const [fade, setFade] = useState(false);
  const [data, setData] = useState(new Date());
  const [btnLembreteGeral, setBtnLembreteGeral] = useState(true);
  const [lembreteGeral, setLembreteGeral] = useState(false);
  const [tempo, setTempo] = useState(60);
  const [blur, setBlur] = useState(false);
  const [formContatarAluno, setFormContatarAluno] = useState(false);
  const [btnContatarAtivo, setBtnContatarAtivo] = useState(true);
  const [temposInatividadeBtnContatar, setTemposInatividadeBtnContatar] = useState({});
  const [alunoSelecionadoGestaoAlunos, setAlunoSelecionadoGetaoAlunos] = useState(null);
  const [adm, setAdm] = useState(null);
  const [ativo, setAtivo] = useState(null);
  
  const renderizarPagina = () => {
    switch (pagina) {
      case "Controle de Acesso":
        return <ControleAcesso 
        setPagina={setPagina} 
        setAlunoSelecionadoGestaoAlunos={setAlunoSelecionadoGetaoAlunos}
        setAtivo={setAtivo} />;
      case "Gestão de Alunos":
        return <GestaoAlunos
          btnLembreteGeral={btnLembreteGeral}
          setBtnLembreteGeral={setBtnLembreteGeral}
          lembreteGeral={lembreteGeral}
          setLembreteGeral={setLembreteGeral}
          tempo={tempo}
          setTempo={setTempo}
          setBlur={setBlur}
          formContatarAluno={formContatarAluno}
          setFormContatarAluno={setFormContatarAluno}
          setBtnContatarAtivo={setBtnContatarAtivo}
          btnContatarAtivo={btnContatarAtivo}
          temposInatividadeBtnContatar={temposInatividadeBtnContatar}
          setTemposInatividadeBtnContatar={setTemposInatividadeBtnContatar}
          setAlunoSelecionadoGestaoAlunos={setAlunoSelecionadoGetaoAlunos}
          alunoSelecionadoGestaoAlunos={alunoSelecionadoGestaoAlunos} />;
      case "Dashboard":
        return <Dashboard />;
      case "Configurações":
        return <Configuracoes adm={adm} setAdm={setAdm} />;
      case "Checkin":
        return <Checkin />;
      default:
        return "Nada ainda";
    }
  };

  useEffect(() => {
    const intervalo = setInterval(() => setData(new Date()), 1000);
    return () => clearInterval(intervalo); // limpa quando o componente desmontar
  }, []);

  useEffect(() => {
    const showSplash = () => {
      setFade(true);
      setTimeout(() => {
        setTelaSplash(false);
      }, 500);
    }
    setTimeout(() => showSplash(), 3000);
  }, []);

  useEffect(() => {
    const menu = () => {
      if (window.innerWidth < 1024) {
        setMenuFechado(true);
      } else {
        setMenuFechado(false);
      }
    }
    menu();
    window.addEventListener("resize", menu);
  }, []);

  useEffect(() => {
    if(adm) localStorage.setItem("adm", JSON.stringify(adm));
  }, [adm]);

  useEffect(() => {
  const admSalvo = localStorage.getItem("adm");
  if (admSalvo) {
    setAdm(JSON.parse(admSalvo));
    setLogin(true);
  }
  }, []);


  return (
    <>
      {blur && <div className={styles.blur} onClick={() => { setLembreteGeral(false); setBlur(false); setFormContatarAluno(false); }}></div>}
      {login ? (
        <>
          {telaSplash && <TelaSplash fade={fade} />}
          <TelaDescanco />
          <div className={styles.container}>
            <img
              className={`${styles.imgTitleMenu} ${menuFechado && styles.imgTitleMenuFechado}`}
              src="/img/logo.png"
              onClick={() => setMenuFechado(!menuFechado)}
              alt="Logo"
            />
            <Menu
              abrirMain={abrirMain}
              setAbrirMain={setAbrirMain}
              menuFechado={menuFechado}
              setPagina={setPagina}
              pagina={pagina}
              ativo={ativo} 
              setAtivo={setAtivo}
            />
            {abrirMain ?
              <main>
                <header className={`${menuFechado && styles.paddingLeft}`}>
                  <p className={styles.txtHeader}>{pagina}</p>
                  {adm.mostrarDataHora ? <>
                    <p className={styles.txtHeader}>{data.toLocaleDateString()}</p>
                    <p className={styles.txtHeader}>{data.toLocaleTimeString()}</p></>: ""}
                </header>
                {renderizarPagina()}
              </main> :
              <BackgrounHome />}
          </div>
        </>
      ) : (
        <Login setLogin={setLogin} setAdm={setAdm} />
      )}
    </>
  );
}
