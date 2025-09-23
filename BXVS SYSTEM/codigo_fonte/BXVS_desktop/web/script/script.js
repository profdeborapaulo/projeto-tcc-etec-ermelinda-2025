async function listar() {
  let alunos = await window.pywebview.api.listar_alunos();
  let lista = document.getElementById("lista");
  lista.innerHTML = "";
  alunos.forEach(a => {
    let li = document.createElement("li");
    li.textContent = `${a.idCliente} - ${a.nome} (${a.email} anos) - Plano: ${a.senha} `;
    lista.appendChild(li);
  });
}


async function carregarPagina(pagina) {
  try {
    const resposta = await fetch(pagina);
    const html = await resposta.text();
    document.querySelector("main").innerHTML = html;
    if (pagina.includes("controleacesso.html")) {
      listaControleAcesso();
    }
  } catch (e) {
    document.querySelector("main").innerHTML = "<p>Erro ao carregar a página.</p>";
  }
}