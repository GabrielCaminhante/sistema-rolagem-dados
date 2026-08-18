/**
 * ==========================================
 * LOGICA DA TELA INICIAL (INDEX.HTML)
 * ==========================================
 */

// Mostra a tela de configuração e esconde a apresentação inicial
function mostrarConfiguracaoSala() {
    document.getElementById('container-apresentacao').classList.add('hidden');
    document.getElementById('container-config-sala').classList.remove('hidden');
}

// Faz o caminho inverso, voltando para a tela de apresentação
function voltarParaApresentacao() {
    document.getElementById('container-config-sala').classList.add('hidden');
    document.getElementById('container-apresentacao').classList.remove('hidden');
}

// Coleta as configurações do formulário e cria a sessão de jogo
function criarMesaRpg(event) {
    event.preventDefault(); // Impede a página de recarregar o formulário

    const qtdJogadores = document.getElementById('qtd-jogadores').value;
    
    // Captura apenas os dados padrões que o criador marcou
    const dadosMarcados = [];
    const checkboxes = document.querySelectorAll('input[name="dados-rpg"]:checked');
    checkboxes.forEach(cb => dadosMarcados.push(cb.value));

    // Verifica se o criador incluiu o dado Booleano (Verdadeiro / Falso)
    const incluirBooleano = document.getElementById('incluir-booleano').checked;

    // Monta o objeto de configuração da sala
    const configuracaoSala = {
        jogadoresMax: parseInt(qtdJogadores),
        dadosPermitidos: dadosMarcados,
        dadoBooleano: incluirBooleano
    };

    // Guarda temporariamente na memória local do navegador
    localStorage.setItem('configuracaoMesa', JSON.stringify(configuracaoSala));

    // Redireciona o usuário para a tela da mesa de RPG
    window.location.href = "rolagem.html"; 
}
