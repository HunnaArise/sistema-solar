// Tema claro e escuro nas quatro páginas.
const botaoTema = document.querySelector("#mudar-tema");
let temaEscuro = new URLSearchParams(window.location.search).get("tema") === "escuro";

function aplicarTema() {
  // O CSS usa esta classe no corpo da página para trocar as cores.
  document.body.classList.toggle("tema-escuro", temaEscuro);
  botaoTema.setAttribute("aria-pressed", String(temaEscuro));

  // Os links carregam a escolha entre páginas, mesmo abrindo o site pelo arquivo.
  document.querySelectorAll('a[href^="index.html"], a[href^="planetas.html"], a[href^="simulador.html"], a[href^="sobre.html"], a[href^="contato.html"]').forEach(function (link) {
    const [caminho, ancora] = link.getAttribute("href").split("#");
    const arquivo = caminho.split("?")[0];
    link.setAttribute("href", arquivo + (temaEscuro ? "?tema=escuro" : "") + (ancora ? "#" + ancora : ""));
  });
}

botaoTema.addEventListener("click", function () {
  // Inverte a escolha atual e aplica as cores correspondentes.
  temaEscuro = !temaEscuro;
  aplicarTema();
});

aplicarTema();

// Interação dos cartões na aba Planetas.
const cartoes = document.querySelectorAll(".planeta");

cartoes.forEach(function (cartao) {
  const resumo = cartao.querySelector("summary");
  let abertoPeloMouse = false;

  // O mouse abre temporariamente. Toque e teclado usam o comportamento do HTML.
  cartao.addEventListener("pointerenter", function (evento) {
    if (evento.pointerType === "mouse" && !cartao.open) {
      cartao.open = true;
      abertoPeloMouse = true;
    }
  });

  cartao.addEventListener("pointerleave", function () {
    if (abertoPeloMouse) {
      cartao.open = false;
      abertoPeloMouse = false;
    }
  });

  // Um clique pode manter aberto o cartão que apareceu ao passar o mouse.
  resumo.addEventListener("click", function (evento) {
    if (abertoPeloMouse) {
      evento.preventDefault();
      abertoPeloMouse = false;
    }
  });
});

// O simulador só é configurado na página que tem o formulário.
if (document.querySelector('#simulador')) {
  // Cada planeta tem um fator de gravidade e a duração do ano em dias terrestres.
  const dados = {
    mercurio: { gravidade: 0.38, dias: 87.97 },
    venus: { gravidade: 0.91, dias: 224.7 },
    terra: { gravidade: 1, dias: 365.25 },
    marte: { gravidade: 0.38, dias: 686.98 },
    jupiter: { gravidade: 2.53, dias: 4332.59 },
    saturno: { gravidade: 1.06, dias: 10759.22 },
    urano: { gravidade: 0.89, dias: 30688.5 },
    netuno: { gravidade: 1.14, dias: 60182 }
  };

  const formulario = document.querySelector("#simulador");
  const planeta = document.querySelector("#planeta");
  const balanca = document.querySelector("#balanca");
  const anos = document.querySelector("#anos");
  const resultadoBalanca = document.querySelector("#resultado-balanca");
  const resultadoTempo = document.querySelector("#resultado-tempo");
  const aviso = document.querySelector("#aviso-simulador");
  const resultados = document.querySelector("#resultados");
  const titulo = document.querySelector("#titulo-resultado");
  const cartaoBalanca = document.querySelector("#cartao-balanca");
  const cartaoTempo = document.querySelector("#cartao-tempo");
  const referenciaBalanca = document.querySelector("#referencia-balanca");
  const referenciaTempo = document.querySelector("#referencia-tempo");
  const formato = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

  formulario.addEventListener("submit", function (evento) {
    // Impede que o formulário recarregue a página ao clicar em Calcular.
    evento.preventDefault();
    const temBalanca = balanca.value !== "";
    const temTempo = anos.value !== "";
    aviso.hidden = temBalanca || temTempo;
    resultados.hidden = !aviso.hidden;
    if (!aviso.hidden) return;

    // Mostra apenas os cartões correspondentes aos campos preenchidos.
    cartaoBalanca.hidden = !temBalanca;
    cartaoTempo.hidden = !temTempo;

    const escolhido = dados[planeta.value];
    const nome = planeta.options[planeta.selectedIndex].text;
    titulo.textContent = "Resultados · " + nome;

    // A balança é estimada multiplicando o valor terrestre pelo fator de gravidade.
    if (temBalanca) {
      const leituraTerra = balanca.valueAsNumber;
      const leitura = leituraTerra * escolhido.gravidade;
      resultadoBalanca.textContent = formato.format(leitura) + " kg";
      referenciaBalanca.textContent = "Na Terra, a balança marca " + formato.format(leituraTerra) + " kg.";
    }

    // As voltas ao redor do Sol são convertidas primeiro em dias e depois em anos terrestres.
    if (temTempo) {
      const diasTerrestres = anos.valueAsNumber * escolhido.dias;
      const anosTerrestres = diasTerrestres / dados.terra.dias;
      resultadoTempo.textContent = formato.format(anosTerrestres) + " anos";
      referenciaTempo.textContent = formato.format(diasTerrestres) + " dias terrestres.";
    }
  });
}
