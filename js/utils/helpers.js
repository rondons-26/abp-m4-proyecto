/**
 * CALCULA EL TIEMPO RESTANTE FECHA LÍMITE
 * @param {string} deadlineISO - Fecha límite formato ISO
 * @returns {string} Tiempo restante o mensaje
 */
export function calculateCountdown(deadlineISO) {
    const deadline = new Date(deadlineISO).getTime();
    const now = new Date().getTime();
    const distance = deadline - now;

    if (distance < 0) {
        return "¡Tiempo expirado!";
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/**
 * MUESTRA UNA NOTIFICACIÓN Y LA CIERRA DESPUES DE 2 SEGUNDOS
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Clase de Bootstrap
 */
export function showNotification(message, type = 'success') {
    const toastEl = document.getElementById('app-toast');
    const toastMessage = document.getElementById('toast-message');

    // ESTILO DINÁMICO
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastMessage.textContent = message;

    // SE MUESTRA EL TOAST MEDIANTE API DE BOOTSTRAP
    const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
    toast.show();
}

/**
 * PAUSA ASÍNCRONICA USANDO PROMESAS
 * @param {number} ms - Milisegundos de espera
 * @returns {Promise}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));