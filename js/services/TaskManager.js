import { Task } from '../models/Task.js';

/**
 * CLASE QUE ADMINISTRA EL LISTADO Y CICLO DE VIDA DE LAS TAREAS
 */
export class TaskManager {
    constructor() {
        //INICIO ARRAY DE TAREAS CARGADO DESDE localStorage (SI EXISTEN)
        this.tasks = this.loadFromLocalStorage();
    }

    /**
     * SE AGREGA UNA NUEVA TAREA A LA LISTA
     */
    addTask(description, deadline, priority, category) {
        const newTask = new Task(description, deadline, priority, category);
        this.tasks.push(newTask);
        this.saveToLocalStorage();
        return newTask;
    }

    /**
     * EDICIÓN DESCRIPCIÓN DE UNA TAREA EXISTENTE
     */
    updateTaskDescription(id, newDescription) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.updateDescription(newDescription);
            this.saveToLocalStorage();
            return task;
        }

        return null;
    }

    /**
     * ELIMINA LA TAREA POR SU ID
     */
    deleteTask(id) {
        //SE UTILIZA filter PARA REMOVER LA TAREA
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
    }

    /**
     * ALTERNA EL ESTADO DE UNA TAREA
     */
    toggleTaskStatus(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleStatus();
            this.saveToLocalStorage();
        }
    }

    /**
     * FILTRAR TAREAS
     */
    filterTasks(query) {
        const cleanQuery = query.toLowerCase().trim();
        return this.tasks.filter(task => 
            task.description.toLowerCase().includes(cleanQuery)
        );
    }

    /**
     * SE GUARDA EL ARRAY TAREA ACTUAL EN localStorage
     */
    saveToLocalStorage() {
        const serializableTasks = this.tasks.map(t => ({ ...t }));
        localStorage.setItem('taskflow_tasks', JSON.stringify(serializableTasks));
    }

    /**
     * RECUPERAR TAREAS ALMACENADAS
     */
    loadFromLocalStorage() {
        const rawData = localStorage.getItem('taskflow_tasks');
        if (!rawData) return [];

        try{
            const parsed = JSON.parse(rawData);
            return parsed.map(obj => Task.fromJSON(obj));
        } catch (error) {
            console.error("Error cargando de LocalStorage:", error);
            return [];
        }
    }

    /**
     * REVISA TODAS LAS TAREAS Y BLOQUEA LAS QUE YA PASARON 1 HORA
     */
    checkAndLockTasks() {
        const oneHourInMs = 60 * 60 * 1000;
        const now = new Date().getTime();
        let changed = false;

        this.tasks.forEach(task => {
            if (task.completed && task.completedAt && !task.lockStatus) {
                const completedTime = new Date(task.completedAt).getTime();
                if (now - completedTime >= oneHourInMs) {
                    task.lockStatus = true;
                    changed = true;
                }
            }
        });

        if (changed) {
            this.saveToLocalStorage();
        }
    }
}