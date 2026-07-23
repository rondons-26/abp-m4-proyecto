/**
 * CLASE PARA REPRESENTAR UNA TAREA
 */
export class Task {
    /**
     * 
     * @param {string} description - DESCRIPCIÓN DE LA ACTIVIDAD
     * @param {string|null} deadline - FECHA LIMITE OPCIONAL
     * @param {'baja'|'media'|'alta'} priority - NIVEL DE PRIORIDAD
     * @param {'personal'|'trabajo'} category - CATEGORIA/CLASIFICACIÓN
     */
    constructor(description, deadline = null, priority = 'baja', category = 'personal') {
        // ID ÚNICO UTILIZANDO LA API MODERNA DE CRYPTO
        this.id = crypto.randomUUID();
        this.description = description;
        this.completed = false; //ESTADO INICIAL
        this.createdAt = new Date().toISOString(); //FECHA CREACIÓN
        this.deadline = deadline ? new Date(deadline).toISOString() : null;
        this.priority = priority;
        this.category = category;

        // PROPIEDADES PERIODO DE GRACIA
        this.completedAt = null;
        this.lockStatus = false;
    }

    /**
     * REHIDRATACIÓN OBJETO PLANO JSON A INSTANCIA REAL
     * @param {Object}
     * @returns {Task}
     */
    static fromJSON(obj) {
        const task = new Task(obj.description, obj.deadline, obj.priority, obj.category);
        task.id = obj.id || task.id;
        task.completed = obj.completed ?? false;
        task.createdAt = obj.createdAt || task.createdAt;
        task.completedAt = obj.completedAt || null;
        task.lockStatus = obj.lockStatus ?? false;
        return task;
    }

    /**
     * CAMBIA ESTADO DE LA TAREA Y TIEMPO
     * @returns {void}
     */
    toggleStatus() {
        if (this.lockStatus) {
            console.warn(`La tarea [ID: ${this.id}] está bloqueada y no puede ser modificada.`);
            return;
        }

        this.completed = !this.completed;
        this.completedAt = this.completed ? new Date().toISOString() : null;
    }

    /**
     * EDICIÓN DESCRIPCIÓN DE LA TAREA
     * @param {string}
     */
    updateDescription(newDescription) {
        if (this.lockStatus) {
            throw new Error("La tarea está bloqueada y no se puede editar.");
        }

        this.description = newDescription;
    }
}