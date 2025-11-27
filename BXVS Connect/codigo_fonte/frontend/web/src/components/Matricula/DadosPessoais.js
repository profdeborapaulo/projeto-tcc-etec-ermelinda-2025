import { useState } from "react";
import axios from "axios";
import styles from "./DadosPessoais.module.css";

export default function DadosPessoais(props) {
  const [form, setForm] = useState({});
  const [erros, setErros] = useState({});
  // ===========================
  // MÁSCARAS
  // ===========================
  const mascaraCPF = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const mascaraTelefone = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");

  const mascaraRG = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1})$/, "$1-$2");

  // ===========================
  // VALIDAÇÕES
  // ===========================
  const validacoes = {
    nome: (v) => v?.trim().length >= 3 || "Nome inválido",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email inválido",
    senha: (v) => v?.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
    telefone: (v) =>
      v?.replace(/\D/g, "").length === 11 || "Telefone inválido",
    sexo: (v) => v !== "" || "Selecione um sexo",
    rg: (v) => v?.replace(/\D/g, "").length >= 9 || "RG inválido",
    cpf: (v) => v?.replace(/\D/g, "").length === 11 || "CPF inválido",


    // === ⬇️ NOVO: idade mínima 10 anos
    dataNascimento: (v) => {
      if (!v) return "Informe sua data de nascimento";
      const hoje = new Date();
      const nasc = new Date(v);

      const idade = hoje.getFullYear() - nasc.getFullYear();
      const ajuste =
        hoje.getMonth() < nasc.getMonth() ||
          (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())
          ? 1
          : 0;

      return idade - ajuste >= 10 || "Idade mínima é 10 anos";
    },

    estadoCivil: (v) => v !== "" || "Selecione o estado civil",
    endereco: (v) => v?.trim().length >= 5 || "Endereço inválido",
  };

  const validateField = (name, value) => {
    const validar = validacoes[name];
    if (!validar) return;

    const resultado = validar(value);
    setErros((prev) => ({
      ...prev,
      [name]: resultado === true ? null : resultado,
    }));
  };

  // ===========================
  // IMPEDIR COLAR INVÁLIDO (NOVO)
  // ===========================
  const handlePaste = (e) => {
    const name = e.target.name;

    if (["cpf", "telefone", "rg"].includes(name)) {
      const texto = e.clipboardData.getData("text");

      // Só permite colar se for SÓ número
      if (!/^[0-9]+$/.test(texto)) {
        e.preventDefault();
      }
    }
  };

  // ===========================
  // ONCHANGE COM MÁSCARAS
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;

    // === PRIMEIRO: CEP (isolado)
    if (name === "cep") {
      novoValor = value
        .replace(/\D/g, "")     // só números
        .slice(0, 8)            // máximo 8
        .replace(/(\d{5})(\d)/, "$1-$2");

      setForm({ ...form, [name]: novoValor });
      validateField(name, novoValor);
      return; // 👈 impede que o CEP caia no bloco errado
    }

    // === CPF, TELEFONE e RG
    if (["cpf", "telefone", "rg"].includes(name)) {
      let apenasNumeros = value.replace(/\D/g, "");

      if (name === "cpf") apenasNumeros = apenasNumeros.slice(0, 11);
      if (name === "telefone") apenasNumeros = apenasNumeros.slice(0, 11);
      if (name === "rg") apenasNumeros = apenasNumeros.slice(0, 9);

      novoValor = apenasNumeros;
    }

    // MÁSCARAS
    if (name === "cpf") novoValor = mascaraCPF(novoValor);
    if (name === "telefone") novoValor = mascaraTelefone(novoValor);
    if (name === "rg") novoValor = mascaraRG(novoValor);

    setForm({ ...form, [name]: novoValor });
    validateField(name, novoValor);
  };


  // ===========================
  // SUBMIT
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errosNovos = {};
    Object.keys(validacoes).forEach((campo) => {
      const resultado = validacoes[campo](form[campo]);
      if (resultado !== true) errosNovos[campo] = resultado;
    });

    setErros(errosNovos);

    if (Object.keys(errosNovos).length > 0) {
      alert("Corrija os campos inválidos antes de continuar.");
      return;
    }

    const dadosCliente = {
      ...form,
      dataCadastro: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    try {
      const res = await axios.post(
        "https://joaofarias16.pythonanywhere.com/cliente",
        dadosCliente
      );

      const result = await axios.get(
        "https://joaofarias16.pythonanywhere.com/clientePorEmail/" +
        dadosCliente.email
      );

      localStorage.setItem("cliente", JSON.stringify(result.data));

      if (props.setDadosPessoais && props.setEscolhaPlano) {
        props.setDadosPessoais("concluido");
        props.setEscolhaPlano("andamento");
      }
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
      alert("Erro ao cadastrar cliente. Verifique os dados e tente novamente.");
    }
  };

  // ===========================
  // FORÇA DA SENHA (NOVO)
  // ===========================
  const calcularForcaSenha = (senha) => {
    let forca = 0;

    if (!senha) return "Senha fraca";

    if (senha.length >= 6) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;

    if (forca <= 1) return "Senha fraca";
    if (forca === 2) return "Senha média";
    return "Senha forte";
  };

  // ===========================
  // BUSCAR CEP AUTOMÁTICO (NOVO)
  // ===========================
  const buscarCEP = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");

    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) return;

      setForm((prev) => ({
        ...prev,
        endereco: `${data.localidade}, ${data.bairro}, ${data.logradouro}`,
      }));

      validateField("endereco", `${data.localidade}, ${data.bairro}, ${data.logradouro}`);
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
    }
  };





  return (
    <div className={styles.container}>
      <div className={styles.conteudo}>

        {/* TÍTULO */}
        <div className={styles.tituloContainer}>
          <p className={styles.txtEtapa}>1° Etapa</p>
          <p className={styles.txtTitulo}>Preencha seus dados iniciais</p>
          <p className={styles.txtDescricao}>
            Essas informações são importantes para mantermos seu cadastro organizado e garantir sua integração <br />
            automática à nossa academia.
          </p>
        </div>

        <form className={styles.formContainer} onSubmit={handleSubmit}>

          {/* NOME */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>Nome completo</p>
            <input
              type="text"
              name="nome"
              placeholder="Digite seu nome"
              className={styles.inputDados}
              onChange={handleChange}
              required
            />
            {erros.nome && <p className={styles.erro}>{erros.nome}</p>}
          </div>

          {/* EMAIL */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>E-mail</p>
            <input
              type="email"
              name="email"
              placeholder="Ex: aluno@bxvs.com"
              className={styles.inputDados}
              onChange={handleChange}
              required
            />
            {erros.email && <p className={styles.erro}>{erros.email}</p>}
          </div>

          {/* SENHA */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>Senha</p>
            <input
              type="password"
              name="senha"
              placeholder="Crie uma senha segura"
              className={styles.inputDados}
              onChange={(e) => {
                handleChange(e);
                setErros((prev) => ({
                  ...prev,
                  senhaForca: calcularForcaSenha(e.target.value),
                }));
              }}

              required
            />
            {erros.senhaForca && (
              <p
                className={styles.erro}
                style={{
                  color:
                    erros.senhaForca === "Senha forte"
                      ? "green"
                      : erros.senhaForca === "Senha média"
                        ? "orange"
                        : "red",
                }}
              >
                {erros.senhaForca}
              </p>
            )}

          </div>

          {/* CONTATO */}
          <div className={styles.contatoContainer}>
            <div className={styles.inputContainer}>
              <p className={styles.labelInput}>Telefone</p>
              <input
                type="text"
                name="telefone"
                placeholder="(00) 00000-0000"
                className={styles.inputDados}
                value={form.telefone || ""}
                onChange={handleChange}
                required
              />
              {erros.telefone && <p className={styles.erro}>{erros.telefone}</p>}
            </div>

            <div className={styles.inputContainer}>
              <p className={styles.labelInput}>Sexo</p>
              <select
                name="sexo"
                className={styles.inputDados}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
              {erros.sexo && <p className={styles.erro}>{erros.sexo}</p>}
            </div>
          </div>

          {/* RG */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>RG</p>
            <input
              type="text"
              name="rg"
              placeholder="00.000.000-0"
              className={styles.inputDados}
              value={form.rg || ""}
              onChange={handleChange}
              required
            />
            {erros.rg && <p className={styles.erro}>{erros.rg}</p>}
          </div>

          {/* CPF */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>CPF</p>
            <input
              type="text"
              name="cpf"
              placeholder="000.000.000-00"
              value={form.cpf || ""}
              className={styles.inputDados}
              onChange={handleChange}
              onPaste={handlePaste}  // 👈 NOVO
              required
            />
            {erros.cpf && <p className={styles.erro}>{erros.cpf}</p>}
          </div>

          {/* DATA NASC */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>Data de nascimento</p>
            <input
              type="date"
              name="dataNascimento"
              className={styles.inputDados}
              onChange={handleChange}
              required
            />
            {erros.dataNascimento && <p className={styles.erro}>{erros.dataNascimento}</p>}
          </div>

          {/* ESTADO CIVIL */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>Estado civil</p>
            <select
              name="estadoCivil"
              className={styles.inputDados}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
            </select>
            {erros.estadoCivil && <p className={styles.erro}>{erros.estadoCivil}</p>}
          </div>
          {/* CEP */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>CEP</p>
            <input
              type="text"
              name="cep"
              placeholder="00000-000"
              className={styles.inputDados}
              value={form.cep || ""}
              onChange={handleChange}
              onBlur={buscarCEP}   // 👈 NOVO
              maxLength={9}
              required
            />
          </div>

          {/* ENDEREÇO */}
          <div className={styles.inputContainer}>
            <p className={styles.labelInput}>Endereço completo</p>
            <input
              type="text"
              name="endereco"
              placeholder="Cidade, bairro e rua"
              value={form.endereco || ""}
              className={styles.inputDados}
              onChange={handleChange}
              required
            />
            {erros.endereco && <p className={styles.erro}>{erros.endereco}</p>}
          </div>

          <button className={styles.btnContinuar} type="submit">
            Continuar
          </button>
        </form>

        <img src="/img/logo.png" alt="Logo" className={styles.logoFundo} />
      </div>

      <p className={styles.leiDados}>
        Seus dados pessoais serão utilizados exclusivamente para fins de matrícula, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
        garantindo segurança e confidencialidade das informações.
      </p>
    </div>
  );
}