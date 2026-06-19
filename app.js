const state = {
    cartas: [], indicesVolteados: [], movimientos: 0, paresEncontrados: 0, bloqueado: false, nombre: '', totalPares: 8,
    timerActivo: false, tiempoRestante: 0, intervaloTimer: null, juegoTerminado: false,
    historial: JSON.parse(localStorage.getItem('rankingMemoria')) || []
};
const TODOS_LOS_EMOJIS = ['⚽', '🏆', '🧤', '👟', '🏟️', '🥅', '⏱️', '📣'];
const DOM = {
    tablero: document.getElementById('tablero'), btnIniciar: document.getElementById('btn-iniciar'), inputNombre: document.getElementById('nombre-jugador'),
    selectDificultad: document.getElementById('dificultad'), movimientosText: document.getElementById('contador-movimientos'),
    mensajeVictoria: document.getElementById('mensaje-victoria'), checkTimer: document.getElementById('usar-timer'),
    inputSegundos: document.getElementById('segundos-timer'), textoTiempo: document.getElementById('tiempo-restante'),
    listaRanking: document.getElementById('lista-ranking'), audioVictoria: document.getElementById('sonido-victoria')
};

DOM.checkTimer.addEventListener('change', (e) => { DOM.inputSegundos.disabled = !e.target.checked; });

function iniciarJuego() {
    if (state.intervaloTimer) clearInterval(state.intervaloTimer);
    state.nombre = DOM.inputNombre.value.trim() || 'Jugador Anónimo'; state.totalPares = parseInt(DOM.selectDificultad.value); state.juegoTerminado = false;
    state.timerActivo = DOM.checkTimer.checked; state.tiempoRestante = parseInt(DOM.inputSegundos.value) || 60;
    if (state.timerActivo) {
        DOM.textoTiempo.classList.remove('oculto'); DOM.textoTiempo.textContent = `Tiempo: ${state.tiempoRestante}s`;
        state.intervaloTimer = setInterval(actualizarTimer, 1000);
    } else { DOM.textoTiempo.classList.add('oculto'); }
    
    let mazo = [...TODOS_LOS_EMOJIS.slice(0, state.totalPares), ...TODOS_LOS_EMOJIS.slice(0, state.totalPares)].sort(() => Math.random() - 0.5);
    state.cartas = mazo.map(emoji => ({ emoji, volteada: false, encontrada: false }));
    state.indicesVolteados = []; state.movimientos = 0; state.paresEncontrados = 0; state.bloqueado = false;
    DOM.mensajeVictoria.textContent = ''; render(); renderRanking();
}

function actualizarTimer() {
    if (state.juegoTerminado) return;
    state.tiempoRestante--; DOM.textoTiempo.textContent = `Tiempo: ${state.tiempoRestante}s`;
    if (state.tiempoRestante <= 0) {
        clearInterval(state.intervaloTimer); state.bloqueado = true; state.juegoTerminado = true;
        DOM.mensajeVictoria.textContent = `¡Se acabó el tiempo, ${state.nombre}! 😢`;
    }
}

function render() {
    DOM.tablero.innerHTML = ''; 
    state.cartas.forEach((carta, index) => {
        const div = document.createElement('div'); div.className = 'carta'; div.dataset.indice = index;
        if (carta.volteada || carta.encontrada) { div.textContent = carta.emoji; if (carta.volteada) div.classList.add('volteada'); if (carta.encontrada) div.classList.add('encontrada'); } else { div.textContent = '?'; }
        DOM.tablero.appendChild(div);
    });
    DOM.movimientosText.textContent = `Movimientos: ${state.movimientos}`;
}

function renderRanking() {
    DOM.listaRanking.innerHTML = '';
    if (state.historial.length === 0) { DOM.listaRanking.innerHTML = '<li>Aún no hay registros.</li>'; return; }
    state.historial.sort((a, b) => a.movimientos - b.movimientos).slice(0, 5).forEach((registro, i) => {
        const li = document.createElement('li');
        li.textContent = `#${i + 1} - ${registro.nombre}: ${registro.movimientos} movs. (${registro.pares} pares)`;
        DOM.listaRanking.appendChild(li);
    });
}

function manejarVolteo(indice) {
    if (state.bloqueado || state.juegoTerminado || state.cartas[indice].encontrada || state.indicesVolteados.includes(indice)) return;
    state.cartas[indice].volteada = true; state.indicesVolteados.push(indice); render(); 
    if (state.indicesVolteados.length === 2) {
        state.movimientos++; state.bloqueado = true; const [idx1, idx2] = state.indicesVolteados;
        if (state.cartas[idx1].emoji === state.cartas[idx2].emoji) {
            state.cartas[idx1].encontrada = true; state.cartas[idx2].encontrada = true; state.paresEncontrados++;
            state.indicesVolteados = []; state.bloqueado = false; render();
            if (state.paresEncontrados === state.totalPares) {
                state.juegoTerminado = true; if (state.intervaloTimer) clearInterval(state.intervaloTimer);
                DOM.audioVictoria.currentTime = 0; DOM.audioVictoria.play().catch(e=>e);
                DOM.mensajeVictoria.textContent = `¡Victoria, ${state.nombre}! 🎉`;
                state.historial.push({ nombre: state.nombre, movimientos: state.movimientos, pares: state.totalPares });
                localStorage.setItem('rankingMemoria', JSON.stringify(state.historial)); renderRanking();
            }
        } else { setTimeout(() => { state.cartas[idx1].volteada = false; state.cartas[idx2].volteada = false; state.indicesVolteados = []; state.bloqueado = false; render(); }, 1000); }
    }
}

DOM.tablero.addEventListener('click', (e) => { const carta = e.target.closest('.carta'); if (carta) manejarVolteo(Number(carta.dataset.indice)); });
DOM.btnIniciar.addEventListener('click', iniciarJuego); DOM.selectDificultad.addEventListener('change', iniciarJuego);
window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'r') iniciarJuego(); });
iniciarJuego();