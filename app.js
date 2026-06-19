const state = {
    cartas: [], totalPares: 8, indicesVolteados: [], movimientos: 0, paresEncontrados: 0
};
const TODOS_LOS_EMOJIS = ['⚽', '🏆', '🧤', '👟', '🏟️', '🥅', '⏱️', '📣'];
const DOM = {
    tablero: document.getElementById('tablero'), selectDificultad: document.getElementById('dificultad'), btnIniciar: document.getElementById('btn-iniciar')
};

function iniciarJuego() {
    state.totalPares = parseInt(DOM.selectDificultad.value);
    let mazo = [...TODOS_LOS_EMOJIS.slice(0, state.totalPares), ...TODOS_LOS_EMOJIS.slice(0, state.totalPares)].sort(() => Math.random() - 0.5);
    state.cartas = mazo.map(emoji => ({ emoji, volteada: false, encontrada: false }));
    state.indicesVolteados = []; state.movimientos = 0; state.paresEncontrados = 0;
    render();
}

function render() {
    DOM.tablero.innerHTML = ''; 
    state.cartas.forEach((carta, index) => {
        const div = document.createElement('div');
        div.className = 'carta'; div.dataset.indice = index;
        if (carta.volteada || carta.encontrada) {
            div.textContent = carta.emoji;
            if (carta.volteada) div.classList.add('volteada');
            if (carta.encontrada) div.classList.add('encontrada');
        } else { div.textContent = '?'; }
        DOM.tablero.appendChild(div);
    });
}

function manejarVolteo(indice) {
    if (state.cartas[indice].encontrada || state.indicesVolteados.includes(indice)) return;
    state.cartas[indice].volteada = true;
    state.indicesVolteados.push(indice);
    render();
}

DOM.tablero.addEventListener('click', (e) => {
    const carta = e.target.closest('.carta');
    if (carta) manejarVolteo(Number(carta.dataset.indice));
});
DOM.btnIniciar.addEventListener('click', iniciarJuego);
iniciarJuego();