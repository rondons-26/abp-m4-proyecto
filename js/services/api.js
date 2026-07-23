const API_URL = 'https://jsonplaceholder.typicode.com/todos';

/**
 * TRY/CATCH PARA UN MANEJO DE ERRORES
 * @param {number} limit - catidad de tareas
 * @returns {Promise<Array>} Array con tareas formateadas
 */
export async function fetchExternalTasks(limit = 3) {
    try {
        // SE REALIZA LA PETICIÓN HTTP GET
        const response = await fetch(`${API_URL}?_limit=${limit}`);

        // VALIDA SI LA RESPUESTA DEL SERVIDOR ES CORRECTA
        if (!response.ok) {
            throw new Error(`Error de red al conectar la API (Código: ${response.status})`);
        }

        // PARSEA LOS DATOS JSON RECIBIDOS
        const data = await response.json();

        // RETORNA LOS DATOS FORMATEADOS
        return data.map(item => ({
            id: crypto.randomUUID(), // GENERA ID LOCAL ÚNICO
            description: item.title,
            completed: item.completed,
            createdAt: new Date().toISOString(),
            deadline: null
        }));

    } catch (error) {
        // SE CAPTURA EL ERROR
        console.error('Error en fetchExternalTasks:', error.message);
        throw error;
    }
}

/**
 * SIMULA EL GUARDADO DE UNA TAREA MEDIANTE PETICIÓN POST A LA API
 * @param {Object} taskData - Datos de la tarea
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function saveTaskToAPI(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: taskData.description,
                completed: taskData.completed,
                userId: 1
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al sincronizar con la API (Código: ${response.status})`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error en saveTaskToAPI:', error.message);
        throw error;
    }
}