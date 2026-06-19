const state = {
    cartas: [], totalPares: 8, indicesVolteados: [], movimientos: 0, paresEncontrados: 0, bloqueado: false
};
const TODOS_LOS_EMOJIS = ['⚽', '🏆', '🧤', '👟', '🏟️', '🥅', '⏱️', '📣'];
const DOM = {
    tablero: document.getElementById('tablero'), selectDificultad: document.getElementById('dificultad'), 
    btnIniciar: document.getElementById('btn-iniciar'), movimientosText: document.getElementById('contador-movimientos')
};

function iniciarJuego() {
    state.totalPares = parseInt(DOM.selectDificultad.value);
    let mazo = [...TODOS_LOS_EMOJIS.slice(0, state.totalPares), ...TODOS_LOS_EMOJIS.slice(0, state.totalPares)].sort(() => Math.random() - 0.5);
    state.cartas = mazo.map(emoji => ({ emoji, volteada: false, encontrada: false }));
    state.indicesVolteados = []; state.movimientos = 0; state.paresEncontrados = 0; state.bloqueado = false;
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
    DOM.movimientosText.textContent = `Movimientos: ${state.movimientos}`;
}

function manejarVolteo(indice) {
    // Aquí está el bloqueo central
    if (state.bloqueado || state.cartas[indice].encontrada || state.indicesVolteados.includes(indice)) return;
    
    state.cartas[indice].volteada = true;
    state.indicesVolteados.push(indice);
    render(); 

    if (state.indicesVolteados.length === 2) {
        state.movimientos++; 
        state.bloqueado = true; // Bloqueamos antes de evaluar
        
        const [idx1, idx2] = state.indicesVolteados;
        if (state.cartas[idx1].emoji === state.cartas[idx2].emoji) {
            state.cartas[idx1].encontrada = true; state.cartas[idx2].encontrada = true; state.paresEncontrados++;
            state.indicesVolteados = []; state.bloqueado = false; render();
        } else {
            setTimeout(() => { 
                state.cartas[idx1].volteada = false; state.cartas[idx2].volteada = false; 
                state.indicesVolteados = []; state.bloqueado = false; render(); 
            }, 1000);
        }
    }
}

DOM.tablero.addEventListener('click', (e) => { const carta = e.target.closest('.carta'); if (carta) manejarVolteo(Number(carta.dataset.indice)); });
DOM.btnIniciar.addEventListener('click', iniciarJuego);
iniciarJuego();