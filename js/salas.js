/**
 * ==========================================
 * LOGICA DA TELA INICIAL (INDEX.HTML)
 * ==========================================
 */

let listaJogadoresConfigurados = [];

const coresDisponiveis = {
  Verde: "#c8f7c5", Amarelo: "#fff9c4", Roxo: "#e1bee7", Azul: "#bbdefb",
  Vermelho: "#ffcdd2", Cinza: "#e0e0e0", Laranja: "#ffe0b2", Rosa: "#f8bbd0",
  Ciano: "#b2ebf2", Marrom: "#d7ccc8", Preto: "#cfd8dc", Ouro: "#fff9c4"
};

function mostrarConfiguracaoSala() {
    document.getElementById('container-apresentacao').classList.add('hidden');
    document.getElementById('container-config-sala').classList.remove('hidden');
}

function voltarParaApresentacao() {
    document.getElementById('container-config-sala').classList.add('hidden');
    document.getElementById('container-apresentacao').classList.remove('hidden');
}

// Abre o modal e constrói as linhas com base no número digitado de jogadores
function abrirModalJogadores() {
    const qtd = parseInt(document.getElementById('qtd-jogadores').value) || 1;
    const container = document.getElementById('container-inputs-modal');
    container.innerHTML = ""; 

    let opcoesCores = '<option value="">Escolha uma Cor</option>';
    Object.keys(coresDisponiveis).forEach(cor => {
        opcoesCores += `<option value="${cor}">${cor}</option>`;
    });

    for (let i = 1; i <= qtd; i++) {
        const linha = document.createElement('div');
        linha.className = 'inputs-jogador-linha';
        linha.innerHTML = `
            <span>#${i}</span>
            <input type="text" class="modal-nick" placeholder="Nickname do Jogador" required>
            <select class="modal-cor" required>${opcoesCores}</select>
        `;
        container.appendChild(linha);
    }

    document.getElementById('modal-jogadores').style.display = 'flex';
}

function fecharModalJogadores() {
    document.getElementById('modal-jogadores').style.display = 'none';
}

// Coleta as definições do modal, valida e desenha os Cards
function salvarPerfisModal() {
    const nicks = document.querySelectorAll('.modal-nick');
    const cores = document.querySelectorAll('.modal-cor');
    
    let temporario = [];
    let coresDefinidas = new Set();
    let validacaoOk = true;

    nicks.forEach((input, index) => {
        const nickVal = input.value.trim();
        const corVal = cores[index].value;

        if (!nickVal || !corVal) {
            alert("Por favor, preencha o apelido e a cor de todos os jogadores!");
            validacaoOk = false;
            return;
        }
        
        coresDefinidas.add(corVal);
        temporario.push({ nickname: nickVal, cor: corVal });
    });

    if (!validacaoOk) return;

    if (coresDefinidas.size !== temporario.length) {
        alert("Atenção: Para melhor identificação visual, evite repetir a mesma cor de jogador na mesa!");
    }

    listaJogadoresConfigurados = temporario;
    fecharModalJogadores();
    desenharCardsJogadores();
}

// Renderiza os Cards com cores atribuídas pelas classes de estilo mapeadas
function desenharCardsJogadores() {
    const grid = document.getElementById('grid-jogadores');
    grid.innerHTML = "";

    listaJogadoresConfigurados.forEach(player => {
        const card = document.createElement('div');
        card.className = 'card-jogador';
        card.style.backgroundColor = coresDisponiveis[player.cor] || "#fff";
        
        const nomeJogador = document.createElement('span');
        nomeJogador.innerText = `👤 ${player.nickname}`;
        
        const quebra = document.createElement('br');
        
        const tagTime = document.createElement('small');
        tagTime.innerText = `Time ${player.cor}`;
        
        card.appendChild(nomeJogador);
        card.appendChild(quebra);
        card.appendChild(tagTime);
        grid.appendChild(card);
    });

    document.getElementById('area-jogadores-previa').classList.remove('hidden');
    document.getElementById('form-criar-sala').classList.remove('hidden');
}

function criarMesaRpg(event) {
    event.preventDefault();

    if (listaJogadoresConfigurados.length === 0) {
        alert("Por favor, configure os perfis dos jogadores no botão antes de prosseguir!");
        return;
    }

    const dadosMarcados = [];
    const checkboxes = document.querySelectorAll('input[name="dados-rpg"]:checked');
    checkboxes.forEach(cb => dadosMarcados.push(cb.value));

    const incluirBooleano = document.getElementById('incluir-booleano').checked;
    const incluirSorte = document.getElementById('incluir-sorte').checked;

    const configuracaoSala = {
        jogadores: listaJogadoresConfigurados,
        dadosPermitidos: dadosMarcados,
        dadoBooleano: incluirBooleano,
        dadoSorte: incluirSorte
    };

    localStorage.setItem('configuracaoMesa', JSON.stringify(configuracaoSala));
    window.location.href = "rolagem.html"; 
}

// Vincula as funções ao escopo global da janela para uso seguro no GitHub Pages
window.mostrarConfiguracaoSala = mostrarConfiguracaoSala;
window.voltarParaApresentacao = voltarParaApresentacao;
window.abrirModalJogadores = abrirModalJogadores;
window.fecharModalJogadores = fecharModalJogadores;
window.salvarPerfisModal = salvarPerfisModal;
window.criarMesaRpg = criarMesaRpg;
