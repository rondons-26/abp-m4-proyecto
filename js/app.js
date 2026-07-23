import { TaskManager } from './services/TaskManager.js';
import { fetchExternalTasks, saveTaskToAPI } from './services/api.js';
import { calculateCountdown, showNotification, delay } from './utils/helpers.js';


// 1. SE INICIA EL GESTOR DE TAREAS
const manager = new TaskManager();

// 2. SELECTORES DEL DOM
const taskForm = document.getElementById('task-form');
const taskDescInput = document.getElementById('task-desc');
const taskDeadlineInput = document.getElementById('task-deadline');
const tasksContainer = document.getElementById('tasks-container');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const btnSubmit = document.getElementById('btn-submit');
const formSpinner = document.getElementById('form-spinner');
const btnText = document.getElementById('btn-text');
const taskPriorityInput = document.getElementById('task-priority');
const taskCategoryInput = document.getElementById('task-category');
const statsTotal = document.getElementById('stats-total');
const statsCompleted = document.getElementById('stats-completed');
const statsPending = document.getElementById('stats-pending');
const statsPercentage = document.getElementById('stats-percentage');
const statsProgressBar = document.getElementById('stats-progress-bar');

// GUARDA LA REFERENCIA
let countdownIntervalId = null;

/**
 * SE INICIA LA APLICACIÓN
 */
async function init() {
    setupEventListeners();

    if (manager.tasks.length === 0) {
        await loadAPITasks();
    }
    
    manager.checkAndLockTasks();
    renderTasks();
    startGlobalCountdown();
}

/**
 * CARGA TAREAS DE LA API EXTERNA AL INICIAR (PRIMERA VEZ)
 */
async function loadAPITasks() {
    try {
        showNotification('Conectando con la API externa...', 'info');

        const externalTasks = await fetchExternalTasks(3);

        externalTasks.forEach(task =>  {
            manager.addTask(
                task.title || task.description || 'Tarea Externa',
                null,
                'baja',
                'personal'
            );
        });

        showNotification('Tareas iniciales sincronizadas con éxito.', 'success');
    } catch (error) {
        showNotification('No se pudieron recuperar las tareas de la API.', 'danger');
    }
}

/**
 * REGISTRO DE EVENT LISTENERS DEL DOM
 */
function setupEventListeners() {
    // EVENTO SUBMIT PARA AGREGAR TAREA
    taskForm.addEventListener('submit', handleAddTask);

    // EVENTO CLICK EN EL CONTENEDOR DE TAREAS
    tasksContainer.addEventListener('click', handleTaskAction);

    // EVENTO KEYUP PARA BUSCAR Y FILTRAR
    searchInput.addEventListener('keyup', handleSearch);
}

/**
 * EVENTO AGREGAR NUEVA TAREA
 */
async function handleAddTask(e) {
    e.preventDefault();

    const desc = taskDescInput.value.trim();
    const deadline = taskDeadlineInput.value || null;
    const priority = taskPriorityInput.value;
    const category = taskCategoryInput.value;

    // VALIDACIÓN NATIVA DE BOOTSTRAP
    if (!desc) {
        taskForm.classList.add('was-validated');
        return;
    }

    // DESACTIVACIÓN BOTON Y SE MUESTRA EL SPINNER DE CARGA
    btnSubmit.disabled = true;
    formSpinner.classList.remove('d-none');
    btnText.textContent = 'Guardando...';

    //SIMULACIÓN DE RETRASO
    await delay(1000);

    try {
        // SE AGREGA LA TAREA 
        const newTask = manager.addTask(desc, deadline, priority, category);

        // SIMULACIÓN ENVIO A LA API EXTERNA
        await saveTaskToAPI(newTask);

        // LIMIPIEZA Y RESTAURACIÓN FORMULARIO
        taskForm.reset();
        taskForm.classList.remove('was-validated');

        // NOTIFICACIÓN DE ÉXITO
        setTimeout(() => {
            showNotification('¡Tarea agregada y sincronizada correctamente!');
        }, 2000);

        renderTasks();

    } catch (error) {
        showNotification('Tarea creada localmente, pero falló la sincronización externa.', 'warning');
        renderTasks();
    } finally {
        // RESTAURACIÓN BOTÓN SUBMIT
        btnSubmit.disabled = false;
        formSpinner.classList.add('d-none');
        btnText.textContent = 'Agregar Tarea';
    }
}

/**
 * ACCIONES DE COMPLETAR Y ELIMINAR MEDIANTE DELEGACIÓN DE EVENTOS
 */
function handleTaskAction(e) {
    const target = e.target;

    // BOTÓN P ICONO PRESIONADO
    const toggleBtn = target.closest('.btn-toggle-status');
    const editBtn = target.closest('.btn-edit');
    const saveBtn = target.closest('.btn-save-edit');
    const cancelBtn = target.closest('.btn-cancel-edit');
    const deleteBtn = target.closest('.btn-delete');

    if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        manager.toggleTaskStatus(id);
        renderTasks();
        showNotification('Estado de la tarea actualizado.', 'info');
    }

    if (editBtn) {
        const id = editBtn.dataset.id;
        const cardBody = editBtn.closest('.card-body');
        const descElement = cardBody.querySelector('.task-desc');
        const actionArea = cardBody.querySelector('.d-flex.justify-content-between.align-items-center .d-flex')

        if (descElement && actionArea) {
            const currentText = descElement.textContent;

            descElement.outerHTML = `
                <textarea class="form-control bg-dark border-primary text-light edit-task-textarea mb-4" 
                    rows="2" style="resize: none;">${currentText}
                </textarea>
            `;

            // BOTONES DE ACCIÓN EDICIÓN ACTIVA
            actionArea.innerHTML = `
                <button class="btn btn-sm btn-outline-success btn-save-edit px-2 py-2 me-2" 
                    data-id="${id}" title="Guardar Cambios">
                    <i class="bi bi-floppy-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary btn-cancel-edit px-2 py-2" 
                    data-id="${id}" title="Cancelar">
                    <i class="bi bi-x-lg"></i>
                </button>
            `;

           cardBody.querySelector('.edit-task-textarea').focus();
        }
    }

    // GUARDAR EDICIÓN REALIZADA
    if (saveBtn) {
        const id = saveBtn.dataset.id;
        const cardBody = saveBtn.closest('.card-body');
        const textarea = cardBody.querySelector('.edit-task-textarea');
        const newDesc = textarea.value.trim();

        if (newDesc !== "") {
            manager.updateTaskDescription(id, newDesc);
            renderTasks();
            showNotification('Tarea editada correctamente.', 'success');
        } else {
            showNotification('La descripción no puede estar vacía.', 'warning');
            textarea.classList.add('is-invalid');
        }
    }

    // CANCELAR LA EDICIÓN
    if (cancelBtn) {
        renderTasks();
    }

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        manager.deleteTask(id);
        renderTasks();
        showNotification('Tarea eliminada correctamente.', 'danger');
    }
}

/**
 * FILTRO TAREAS INTERACTIVA
 */
function handleSearch() {
    const query = searchInput.value;
    const filtered = manager.filterTasks(query);
    renderTasks(filtered);
}

/**
 * RENDERIZACIÓN LISTA TAREAS EN EL DOM
 * @param {Array} tasksToRender - ARRAY OPCIONAL
 */
function renderTasks(tasksToRender = manager.tasks) {
    tasksContainer.innerHTML = '';

    if (tasksToRender.length === 0) {
        emptyState.classList.remove('d-none');
        tasksContainer.appendChild(emptyState);
        return;
    }

    emptyState.classList.add('d-none');

    // SE GENERAN TARJETAS DINÁMICAMENTE
    tasksToRender.forEach(task => {
        const { 
            id, 
            description = '', 
            priority = 'baja', 
            category = 'personal', 
            deadline = null, 
            completed: isCompleted = false, 
            lockStatus: isLocked = false, 
            createdAt = new Date().toISOString(), 
            completedAt = null 
        } = task;
       
        const cardCol = document.createElement('div');
        cardCol.className = `col task-animate-in`;

        // EVENTOS MOUSEOVER
        cardCol.addEventListener('mouseover', () => {
            cardCol.querySelector('.card').classList.add('border-primary');
        });
        cardCol.addEventListener('mouseout', () => {
            if (!isCompleted) {
                cardCol.querySelector('.card').classList.remove('border-primary');
            }
        });

        // CONFIGURACIÓN VISUAL PRIORIDAD
        let priorityBadgeClass = 'bg-secondary';
        if (task.priority === 'alta') priorityBadgeClass = 'bg-danger-subtle text-danger border-danger-subtle';
        else if (task.priority === 'media') priorityBadgeClass = 'bg-warning-subtle text-warning border-warning-subtle';
        else if (task.priority === 'baja') priorityBadgeClass = 'bg-info-subtle text-info border-info-subtle';

        // CONFIGURACIÓN VISUAL ETIQUETA
        const categoryIcon = task.category === 'trabajo' ? 'bi-briefcase' : 'bi-house-heart';
        const categoryTextClass = task.category === 'trabajo' ? 'text-primary' : 'text-success';

        // LÓGICA TEMPORIZADORES
        let deadlineBadgeHTML = '';
        if (isCompleted) {
            if (isLocked) {
                deadlineBadgeHTML = `
                    <span class="badge bg-secondary-subtle border border-secondary text-secondary countdown-badge">
                        <i class="bi bi-lock-fill"></i> Completada
                    </span>
                `;
            } else {
                deadlineBadgeHTML = `
                    <span class="badge bg-warning-subtle text-warning border border-warning-subtle countdown-badge grace-period-badge" 
                          data-completed-at="${completedAt}" data-id="${id}">
                        Reactivación: Calculando...
                    </span>
                `;
            }
        } else if (task.deadline) {
            deadlineBadgeHTML = `
                <span class="badge bg-danger-subtle text-danger border border-danger-subtle countdown-badge" 
                      data-deadline="${deadline}" id="count-${id}">
                    Calculando...
                </span>
            `;
        } else {
            deadlineBadgeHTML = `
                <span class="badge bg-info-subtle text-info border border-info-subtle countdown-badge">
                    <i class="bi bi-clock-history"></i> Pendiente
                </span>
            `;
        }

        // ESTRUCTURA TARJETA DE TAREA
        cardCol.innerHTML = `
            <div class="card h-100 bg-dark border-secondary ${isCompleted ? 'border-success opacity-75' : ''} task-card" style="border-radius: 10px;">
                <div class="card-body d-flex flex-column justify-content-between p-3">
                    
                    <div class="${isCompleted ? 'task-completed text-muted' : ''}">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge ${priorityBadgeClass} border px-2 py-1" style="font-size: 0.7rem; font-weight: 600;">
                                <i class="bi bi-flag-fill me-1"></i> ${priority.toUpperCase()}
                            </span>
                            ${deadlineBadgeHTML}
                        </div>
                        
                        <p class="card-text fs-5 mb-4 task-desc text-light fw-normal">${description}</p>
                    </div>
                    
                    <div class="border-top border-secondary-subtle pt-3">
                        <!-- Unificación en una sola línea mediante Flexbox -->
                        <div class="d-flex justify-content-between align-items-center">
                            
                            <!-- Izquierda: Bloque de Información (Fecha y Categoría alineadas) -->
                            <div class="text-secondary" style="font-size: 0.75rem; line-height: 1.3;">
                                <div class="mb-1">
                                    <strong>Fecha:</strong> ${new Date(createdAt).toLocaleDateString()}
                                </div>
                                <div class="fw-bold ${categoryTextClass}">
                                    <i class="bi ${categoryIcon}"></i> ${category.toUpperCase()}
                                </div>
                            </div>
                            
                            <!-- Derecha: Botones de Acción -->
                            <div class="d-flex">
                                <button class="btn btn-sm ${isCompleted ? 'btn-outline-warning' : 'btn-outline-success'} btn-toggle-status px-2 py-2 me-2" 
                                        data-id="${id}" 
                                        ${isLocked ? 'disabled' : ''} 
                                        title="${isLocked ? 'Acción bloqueada tras 1 hora' : isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}">
                                    <i class="bi ${isLocked ? 'bi-lock-fill' : isCompleted ? 'bi-arrow-counterclockwise' : 'bi-check-lg'}"></i>
                                </button>

                                <button class="btn btn-sm btn-outline-info btn-edit px-2 py-2 me-2" 
                                        data-id="${id}" 
                                        ${isLocked ? 'disabled' : ''} 
                                        title="${isLocked ? 'No editable (bloqueada)' : 'Editar Tarea'}">
                                    <i class="bi bi-pencil-fill"></i>
                                </button>
                                
                                <button class="btn btn-sm btn-outline-danger btn-delete px-2 py-2" 
                                        data-id="${id}" 
                                        title="Eliminar Tarea">
                                    <i class="bi bi-trash3-fill"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `;

        tasksContainer.appendChild(cardCol);
    });

    // ACTUALIZACIÓN INMEDIATA DEL TEMPORIZADOR
    updateAllCountdowns();
    updateStatistics();
}

/**
 * ACTUALIZACIÓN ELEMENTOS CUENTA REGRESIVA EN EL DOM
 */
function updateAllCountdowns() {
    const now = new Date().getTime();
    let statusChanged = false;

    // 1. ACTUALIZA CONTADORES DE TAREAS PENDIENTES
    const badges = document.querySelectorAll('.countdown-badge[data-deadline]');
    badges.forEach(badge => {
        const deadline = badge.dataset.deadline;
        if (deadline) {
            badge.textContent = calculateCountdown(deadline);
        }
    });

    // 2. ACTUALIZA TEMPORIZADOR TAREAS COMPLETADAS (GRACIA DE 1 HORA)
    const graceBadges = document.querySelectorAll('.grace-period-badge[data-completed-at]');
    graceBadges.forEach(badge => {
        let rawCompletedAt = badge.dataset.completedAt;
        const taskId = badge.dataset.id;

        const task = manager.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (!rawCompletedAt || rawCompletedAt === 'null' || rawCompletedAt === 'undefined') {
            const currentISO = new Date().toISOString();
            task.completedAt = currentISO;
            badge.dataset.completedAt = currentISO;
            rawCompletedAt = currentISO;
            statusChanged = true;
        }

        const completedTime = new Date(rawCompletedAt).getTime();

        if (isNaN(completedTime)) {
            if (!task.lockStatus) {
                task.lockStatus = true;
                statusChanged = true;
            }
            return;
        }

        const oneHourInMs = 60 * 60 * 1000;
        const timePassed = now - completedTime;
        const timeLeft = oneHourInMs - timePassed;

        if (timeLeft <= 0) {
            // EXPIRA EL TIEMPO SE MARCA COMO BLOQUEADA
            if (!task.lockStatus) {
                task.lockStatus = true;
                statusChanged = true;
            }
        } else {
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            badge.innerHTML = `<i class="bi bi-hourglass-split"></i> Bloqueo en: ${minutes}m ${seconds}s`;
        }
    });

   if (statusChanged) {
        manager.saveToLocalStorage();
        renderTasks();
        showNotification('Periodo de reactivación expirado para algunas tareas.', 'info');
    }
}

/**
 * INTERVALO GLOBAL QUE ACTUALIZA LOS TEMPORIZADORES
 */
function startGlobalCountdown() {
    if (countdownIntervalId) clearInterval(countdownIntervalId);
    countdownIntervalId = setInterval(updateAllCountdowns, 1000);
}

/**
 * PANEL DE RENDIMIENTO
 */
function updateStatistics() {
    const total = manager.tasks.length;
    const completed = manager.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    // CÁLCULO DE PORCENTAJE
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // ACTUALIZACIÓN TEXTOS EN EL DOM
    statsTotal.textContent = total;
    statsCompleted.textContent = completed;
    statsPending.textContent = pending;
    statsPercentage.textContent = `${percentage}%`;

    // ACTUALIZACIÓN BARRA DE PROGRESO
    statsProgressBar.style.width = `${percentage}%`;
    statsProgressBar.setAttribute('aria-valuenow', percentage);
}

// INICIA LA APP AL CARGAR EL ARCHIVO
init();