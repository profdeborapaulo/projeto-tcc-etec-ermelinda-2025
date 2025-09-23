const carregarEstatisticas = async () => {
  const clientes = await window.pywebview.api.listaControleAcesso();
  const alunosPresentes = document.querySelector("#alunosPresentes");
  const entradasRegistradas = document.querySelector("#entradasRegistradas");
  const saidasRegistradas = document.querySelector("#saidasRegistradas");
  const alunosPendencias = document.querySelector("#alunosPendencias");
  let presentes = 0;
  let entradas = 0;
  let saidas = 0;
  let pendencias = 0;

  clientes.forEach(cliente => {
    if (cliente.horarioChegada && !cliente.horarioSaida) {
      presentes++
    }
    if (cliente.horarioChegada) {
      entradas++
    }
    if (cliente.horarioChegada && cliente.horarioSaida) {
      saidas++
    }
    if (cliente.situacaoMatricula == "Pendente") {
      pendencias++
    }
  });

  alunosPresentes.textContent = presentes.toString();
  entradasRegistradas.textContent = entradas.toString();
  saidasRegistradas.textContent = saidas.toString();
  alunosPendencias.textContent = pendencias.toString();
}

const exibir = cliente => {
  const aluno = document.querySelector(".aluno");

  aluno.innerHTML = `
      <p class="titleControleAcesso">
                Aluno selecionado
      </p>
      <div class="alunoPerfil">
        <img src="" alt="" class="alunoPerfilImg">
        <div class="alunoTxt">
          <div class="alunoNome">${cliente.nome}</div>
            <div class="alunoStatus">
              <div class=${!cliente.horarioSaida ? "alunoBolinha" : "alunoBolinhaAusente"}></div>
              <div class="alunoPresenca">${!cliente.horarioSaida ? "Presente" : "Ausente"}</div>
            </div>
          </div>
      </div>
      <div class="dadosCheckinAluno">
        <div class="dadoCheckinAluno">
          <p class="labelDadoCheckinAluno">Chegou em:</p>
          <p class="conteudoDadoCheckinAluno">${cliente.horarioChegada}</p>
        </div>
        <div class="dadoCheckinAluno">
          <p class="labelDadoCheckinAluno">Saiu em:</p>
          <p class="conteudoDadoCheckinAluno">${cliente.horarioSaida ? cliente.horarioSaida : "Presente"}</p>
        </div>
        <div class="dadoCheckinAluno"> 
          <p class="labelDadoCheckinAluno">Código ID</p>
          <p class="conteudoDadoCheckinAluno">${cliente.id}</p>
        </div>
      </div>
      <div class="cardsAluno">
        <div class="alunoCard">
          <p class="titleCardAluno">Situação de pagamento</p>
          <p class="dadoCardAluno">${cliente.situacaoMatricula}</p>
        </div>
        <div class="alunoCard">
          <p class="titleCardAluno">Plano ativo</p>
          <p class="dadoCardAluno">${cliente.plano}</p>
        </div>
        <div class="alunoCard">
          <p class="titleCardAluno">Frequência</p>
          <p class="dadoCardAluno">100%</p>
        </div>
      </div>
      <div class="btnContatar">
        Contatar
      </div>
      <div class="btnVerFichaCompleta">
      Ver ficha completa
      </div>
    `;
}

async function listaControleAcesso() {
  const clientes = await window.pywebview.api.listaControleAcesso();
  const listaCheckin = document.querySelector(".listaCheckin");
  listaCheckin.replaceChildren();

  const fragment = document.createDocumentFragment();

  clientes.forEach(cliente => {
    const modeloCheckin = document.createElement("div");
    modeloCheckin.className = "modeloCheckin";
    modeloCheckin.addEventListener("click", () => {
      exibir(cliente);
    });

    modeloCheckin.innerHTML = `
      <div class="nomeFotoCheckin">
        <img class="imgCheckin">
        <p class="nomeCheckin">${cliente.nome}</p>
      </div>
      <p class="pCheckin">${cliente.horarioChegada}</p>
      <p class="pCheckin">${cliente.horarioSaida ? cliente.horarioSaida : "Presente"}</p>
      <p class="situacaoMatricula ${cliente.situacaoMatricula}">
        ${cliente.situacaoMatricula}
      </p>
      <p class="pCheckin">${cliente.id}</p>
    `;

    fragment.appendChild(modeloCheckin);
  });

  listaCheckin.appendChild(fragment);

  const modelosCheckin = document.querySelectorAll(".modeloCheckin");
  const ativarLink = (modeloCheckin) => {
    modelosCheckin.forEach(m => m.classList.remove('ativo'));
    modeloCheckin.classList.add('ativo');
  };
  modelosCheckin.forEach(modeloCheckin => {
    modeloCheckin.addEventListener('click', () => ativarLink(modeloCheckin));
  });

  carregarEstatisticas();
}