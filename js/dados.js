/**
 * ==========================================
 * LOGICA DA MESA DE JOGO (ROLAGEM.HTML)
 * ==========================================
 */

let corAtual = "";

// Mapeamento de cores de fundo mais suaves para a interface (combinando com o tom do texto)
const coresBackground = {
  Verde: "#c8f7c5", Amarelo: "#fff9c4", Roxo: "#e1bee7", Azul: "#bbdefb",
  Vermelho: "#ffcdd2", Cinza: "#e0e0e0", Laranja: "#ffe0b2", Rosa: "#f8bbd0",
  Ciano: "#b2ebf2", Marrom: "#d7ccc8", Preto: "#cfd8dc", Ouro: "#fff9c4"
};

window.onload = function () {
  // 1. Recupera o histórico local se ele existir
  const historicoSalvo = localStorage.getItem("historico");
  if (historicoSalvo) {
    document.getElementById("historico").innerHTML = historicoSalvo;
  }

  // 2. Lê as configurações passadas pelo criador na tela inicial
  const configRaw = localStorage.getItem('configuracaoMesa');
  if (configRaw) {
    const config = JSON.parse(configRaw);
    // Gera dinamicamente os botões permitidos na mesa
    gerarBotoesDados(config.dadosPermitidos, config.dadoBooleano);
  } else {
    // Caso o usuário tente acessar direto pela URL sem configurar a sala, usa um padrão (D6 e D20)
    gerarBotoesDados(['d6', 'd20'], false);
  }
};

// Monitora a seleção de cores do jogador ativo
document.getElementById("cor").addEventListener("change", function () {
  corAtual = this.value;
  document.getElementById("cor-selecionada").innerText = corAtual ? `Jogador ativo: ${corAtual}` : "";
  
  // Aplica as cores de fundo suaves nos containers
  const corHex = coresBackground[corAtual] || "#ffffff";
  document.getElementById("resultado").style.backgroundColor = corHex;
  document.getElementById("historico").style.backgroundColor = corHex;
});

// Renderiza os botões na tela baseado na escolha do criador da sala
function gerarBotoesDados(dadosPermitidos, incluirBooleano) {
  const container = document.getElementById('container-botoes-dados');
  container.innerHTML = ""; // Limpa o container para evitar duplicações

  // Cria dinamicamente os botões numéricos (d2, d4, d20, d100, etc)
  dadosPermitidos.forEach(dado => {
    const lados = dado.replace('d', ''); // Extrai o número do texto (ex: "d20" vira 20)
    const btn = document.createElement('button');
    btn.innerText = `Rolar ${dado.toUpperCase()}`;
    btn.onclick = () => rolarComSuspense(() => rolarDadoNumerico(parseInt(lados)));
    container.appendChild(btn);
  });

  // Cria dinamicamente o dado Booleano customizado (V / F), se ativo
  if (incluirBooleano) {
    const btnBool = document.createElement('button');
    btnBool.innerText = "Rolar Dado V / F";
    btnBool.style.background = "#009688"; // Cor destacada para indicar que é customizado
    btnBool.onclick = () => rolarComSuspense(rolarDadoBooleano);
    container.appendChild(btnBool);
  }
}

// Aplica a animação de suspense visual antes de exibir os resultados
function rolarComSuspense(funcaoRolagem) {
  if (!corAtual) {
    alert("Escolha sua cor de jogador antes de rolar os dados!");
    return;
  }
  const resultado = document.getElementById("resultado");
  resultado.classList.add("rolando");
  resultado.innerText = "🎲 Rolando dados...";
  
  // Executa a rolagem após 1.5 segundos de animação
  setTimeout(() => {
    resultado.classList.remove("rolando");
    funcaoRolagem();
  }, 1500);
}

// Mecânica unificada para qualquer dado numérico (D2 até D100)
function rolarDadoNumerico(lados) {
  const valor = Math.floor(Math.random() * lados) + 1;
  let texto = `Rolagem D${lados}: 🎲 ${valor}`;
  
  // Adiciona a inteligência do seu D2 original (Esquerda ou Direita)
  if (lados === 2) {
    const direcao = valor === 1 ? "➡️ Direita" : "⬅️ Esquerda";
    texto = `Direção (D2): 🎲 ${valor} → ${direcao}`;
  }

  document.getElementById("resultado").innerHTML = texto;
  adicionarAoHistorico(texto);
}

// Mecânica do Dado Personalizado Booleano solicitado
function rolarDadoBooleano() {
  const sorteio = Math.random() < 0.5;
  const resultadoFinal = sorteio ? "✅ VERDADEIRO" : "❌ FALSO";
  const texto = `Dado Customizado: 🧭 ${resultadoFinal}`;
  
  document.getElementById("resultado").innerHTML = texto;
  adicionarAoHistorico(texto);
}

// Registra a jogada no HTML interno, no localStorage e dispara para o Discord
function adicionarAoHistorico(texto) {
  const historico = document.getElementById("historico");
  const linha = document.createElement("div");
  const select = document.getElementById("cor");
  const corHex = select.querySelector(`option[value="${corAtual}"]`)?.dataset.color || "#000";
  
  linha.innerHTML = `
    <hr style="border: none; border-top: 1px dashed #ccc; margin: 10px 0;">
    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${corHex}; margin-right: 10px; vertical-align: middle;"></span>
    <strong style="color:${corHex}">${corAtual}</strong> → ${texto}
  `;
  
  historico.appendChild(linha);
  localStorage.setItem("historico", historico.innerHTML);
  
  // Envia a mensagem integrada ao Discord através do arquivo externo discord.js
  enviarParaDiscord(`🎲 [Mesa RPG] ${corAtual} → ${texto}`);
}

function limparHistorico() {
  document.getElementById("historico").innerHTML = "<strong>Histórico de Rolagens:</strong>";
  localStorage.removeItem("historico");
}

function voltarAoMenu() {
  window.location.href = "index.html";
}
