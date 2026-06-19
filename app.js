const state = {
    cartas: [],
    totalPares: 8
};

const TODOS_LOS_EMOJIS = ['⚽', '🏆', '🧤', '👟', '🏟️', '🥅', '⏱️', '📣'];
const DOM = {
    tablero: document.getElementById('tablero'),
    selectDificultad: document.getElementById('dificultad'),
    btnIniciar: document.getElementById('btn-iniciar')
};

function iniciarJuego() {
    state.totalPares = parseInt(DOM.selectDificultad.value);
    const emojisActivos = TODOS_LOS_EMOJIS.slice(0, state.totalPares);
    let mazo = [...emojisActivos, ...emojisActivos];
    mazo.sort(() => Math.random() - 0.5);

    state.cartas = mazo.map(emoji => ({ emoji: emoji, volteada: false, encontrada: false }));
    render();
}

function render() {
    DOM.tablero.innerHTML = ''; 
    state.cartas.forEach((carta, index) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.dataset.indice = index;
        div.textContent = '?';
        DOM.tablero.appendChild(div);
    });
}

DOM.btnIniciar.addEventListener('click', iniciarJuego);
iniciarJuego();