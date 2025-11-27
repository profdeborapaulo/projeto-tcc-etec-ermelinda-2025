import { useState } from "react";
import styles from "./Menu.module.css";
import LinkMenu from "./LinkMenu";
import { LuCircleHelp, LuSquareUser } from "react-icons/lu";
import { GoGraph } from "react-icons/go";
import { PiGearFineBold } from "react-icons/pi";
import { GiLockedDoor } from "react-icons/gi";
import { TbUserScan } from "react-icons/tb";

export default function Menu({ abrirMain, setAbrirMain, menuFechado, setPagina, ativo, setAtivo }) {

  return (
    <div className={`${styles.menu} ${menuFechado ? styles.fechado : ""}`}>
      <div className={styles.titleMenu}>
        <p className={styles.txtTitleMenu}>BXVS CONNECT</p>
      </div>

      <div className={styles.linksMenu}>
        <p className={styles.titleLinksMenu}>Menu</p>
        <LinkMenu
          Icon={GiLockedDoor}
          texto="Controle de acesso"
          ativo={ativo === "Controle de acesso"}
          setAtivo={setAtivo}
          abrirMain={abrirMain}
          setAbrirMain={setAbrirMain}
          onClick={() => setPagina("Controle de Acesso")}
        />
        <LinkMenu
          Icon={LuSquareUser}
          texto="Gestão de Alunos"
          ativo={ativo === "Gestão de Alunos"}
          setAtivo={setAtivo}
          abrirMain={abrirMain}
          setAbrirMain={setAbrirMain}
          onClick={() => setPagina("Gestão de Alunos")}
        />
        <LinkMenu
          Icon={GoGraph}
          texto="Dashboard"
          ativo={ativo === "Dashboard"}
          setAtivo={setAtivo}
          abrirMain={abrirMain}
          setAbrirMain={setAbrirMain}
          onClick={() => setPagina("Dashboard")}
        />
        <LinkMenu
          Icon={TbUserScan}
          texto="Checkin"
          ativo={ativo === "Checkin"}
          setAtivo={setAtivo}
          abrirMain={abrirMain}
          setAbrirMain={setAbrirMain}
          onClick={() => setPagina("Checkin")}
        />
      </div>

      <div className={styles.linksMenu}>
        <p className={styles.titleLinksMenu}>Configurações</p>
        <LinkMenu
          Icon={PiGearFineBold}
          texto="Configurações"
          ativo={ativo === "Configurações"}
          setAtivo={setAtivo}
          abrirMain={abrirMain}
          setAbrirMain={setAbrirMain}
          onClick={() => setPagina("Configurações")}
        />
        <LinkMenu
          Icon={LuCircleHelp}
          texto="Ajuda"
          ativo={ativo === "Ajuda"}
          setAtivo={setAtivo}
          abrirMain={abrirMain}
          setAbrirMain={setAbrirMain}
          onClick={() => setPagina("Ajuda")}
        />
      </div>
    </div>
  );
}
