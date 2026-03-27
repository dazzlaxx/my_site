const STORAGE_KEY = 'todo_app_list_bauman';

let tasks = [];

const taskNameInput = document.getElementById('taskNameInput');
const taskDescInput = document.getElementById('taskDescInput');
const addBtn = document.getElementById('addTaskBtn');
const todoRoot = document.getElementById('todoListRoot');
const totalSpan = document.getElementById('totalCount');
const completedSpan = document.getElementById('completedCount');
const activeSpan = document.getElementById('activeCount');

function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch(e) {
        console.warn('Ошибка локального сохранения', e);
    }
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                tasks = parsed;
                tasks = tasks.filter(t => t && typeof t === 'object' && typeof t.name === 'string' && t.name.trim() !== '');
                tasks = tasks.map(t => ({
                    id: t.id || Date.now() + Math.random() + '',
                    name: t.name?.trim() || 'Без названия',
                    description: t.description !== undefined ? t.description : '',
                    completed: t.completed === true
                }));
            }
        } catch(e) {
            tasks = [];
        }
    }
    
    if (!tasks.length) {
        tasks = [
            {
                id: 'demo1',
                name: 'Сделать домашнее задание',
                description: 'ToDo List',
                completed: false
            },
            {
                id: 'demo2',
                name: 'Изучить локальное хранение',
                description: 'Понять, как хранить задачи после перезагрузки',
                completed: true
            },
            {
                id: 'demo3',
                name: 'Добавить новую задачу',
                description: 'Попробовать создать свою задачу с описанием',
                completed: false
            }
        ];
        saveToLocalStorage();
    }
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t=>t.completed).length;
    const active = total - completed
    totalSpan.textContent = total;
    completedSpan.textContent = completed;
    activeSpan.textContent = active
}

function renderTodoList() {
    if (!todoRoot) return;

    updateStats();

    if (tasks.length===0) {
        todoRoot.innerHTML = '<div class="empty-message">Список дел пуст. Добавьте новую задачу.</div>';
        return
    }

    const fragment = document.createDocumentFragment();

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = `todo-item ${task.completed ? 'completed-task' : ''}`;
        taskDiv.dataset.id = task.id;
        
        const checkDiv = document.createElement('div');
        checkDiv.className = 'todo-check';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleComplete(task.id, checkbox.checked);
        });
        checkDiv.appendChild(checkbox);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';
        const nameSpan = document.createElement('div');
        nameSpan.className = 'todo-name';
        nameSpan.textContent = task.name;
        const descSpan = document.createElement('div');
        descSpan.className = 'todo-desc';
        descSpan.textContent = task.description || '';
        contentDiv.appendChild(nameSpan);
        contentDiv.appendChild(descSpan);
        
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '×';
        delBtn.title = 'Удалить задачу';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTaskById(task.id);
        });
        
        taskDiv.appendChild(checkDiv);
        taskDiv.appendChild(contentDiv);
        taskDiv.appendChild(delBtn);
        fragment.appendChild(taskDiv);
    });
    
    todoRoot.innerHTML = '';
    todoRoot.appendChild(fragment);
}

function toggleComplete(id, isCompleted) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = isCompleted;
        saveToLocalStorage();
        renderTodoList();
    }
}

function deleteTaskById(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTodoList();
}

function addNewTask() {
    let rawName = taskNameInput.value;
    let rawDesc = taskDescInput.value;
    
    if (!rawName || rawName.trim() === '') {
        alert('Ошибка: название задачи не может быть пустым');
        taskNameInput.style.borderColor = '#d97a6e';
        taskNameInput.focus();
        setTimeout(() => {
            taskNameInput.style.borderColor = '#ddd2f0';
        }, 1500);
        return;
    }
    
    const nameTrimmed = rawName.trim();
    const descriptionTrimmed = rawDesc !== undefined ? rawDesc : '';
    
    const newId = Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    
    const newTask = {
        id: newId,
        name: nameTrimmed,
        description: descriptionTrimmed,
        completed: false
    };
    
    tasks.unshift(newTask);
    saveToLocalStorage();
    
    taskNameInput.value = '';
    taskDescInput.value = '';
    renderTodoList();
    taskNameInput.focus();
}

function initEventHandlers() {
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addNewTask();
        });
    }
    
    if (taskNameInput) {
        taskNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addNewTask();
            }
        });
    }
}

function init() {
    loadFromLocalStorage();
    renderTodoList();
    initEventHandlers();
}

init();