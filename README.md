# Juego de Memoria (Vanilla JS) - Proyecto TI3V31

Aquí presento mi proyecto domiciliario de Programación Front End. La app está hecha 100% en JavaScript Vanilla, respetando la regla principal: el "estado" de la aplicación es la única fuente de verdad.

## 1. Dónde me ayudó la IA y dónde tuve que corregirla
Usé la IA para armar rápido la maqueta inicial de HTML y la grilla con CSS, además de pedirle que me explicara de forma sencilla cómo funcionaba la delegación de eventos. 

Sin embargo, donde me entregó código malo fue en la lógica del turno. La IA me dio una versión que no manejaba el asincronismo. Si yo hacía clics rápidos en tres cartas seguidas antes de que terminara el `setTimeout`, el arreglo temporal se sobreescribía y el juego se rompía. Tuve que arreglar eso a mano metiendo una variable `bloqueado` dentro de mi objeto de estado para ignorar cualquier clic mientras el código evalúa la pareja.

## 2. Decisiones de Diseño
* **Un solo evento para todo el tablero (Delegación):** En vez de meter la mala práctica de hacer un bucle y ponerle un `addEventListener` a cada una de las cartas, le puse un solo listener al contenedor padre llamado `#tablero`. Como mi función `render` destruye y vuelve a crear los elementos a cada rato para actualizar la vista, si le ponía eventos individuales se me iba a llenar la memoria de listeners huérfanos.
* **`textContent` por encima de `innerHTML`:** Para el mensaje final donde felicito al jugador, usé `textContent` de forma estricta para prevenir ataques de inyección de código (XSS).

## 3. Funcionalidades Extra e Implementaciones Adicionales
Decidí no quedarme solo con los requisitos básicos e implementé las siguientes mejoras:
* **Sistema de Ranking con LocalStorage:** Agregué un histórico de puntajes que guarda las victorias. Al ganar, se guarda un objeto con los datos, se transforma a texto con JSON y se almacena en el navegador.
* **Temporizador Dinámico Opcional:** Implementé un temporizador ajustable usando `setInterval`, manejando correctamente el ciclo de vida del asincronismo usando `clearInterval` para evitar bugs y temporizadores corriendo en paralelo.