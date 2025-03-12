document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const todoFooter = document.getElementById('todoFooter');
    const taskCount = document.getElementById('taskCount');
    const clearAllButton = document.getElementById('clearAll');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    renderTodos();

    addButton.addEventListener('click', addTodo);
    taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTodo());
    clearAllButton.addEventListener('click', clearAllTodos);

    function addTodo() {
        const text = taskInput.value.trim();
        if (text) {
            todos.push({ id: Date.now().toString(), text, completed: false });
            saveTodos();
            renderTodos();
        }
        taskInput.value = '';
        taskInput.focus();
    }

    function toggleTodo(id) {
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        saveTodos();
        renderTodos();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    function clearAllTodos() {
        todos = [];
        saveTodos();
        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = todos.length ? 
            todos.map(todo => `
                <div class="todo-item">
                    <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" data-id="${todo.id}"></div>
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    <button class="delete-btn" data-id="${todo.id}">&times;</button>
                </div>
            `).join('') : '<p class="empty-message">No tasks yet. Add one above!</p>';
        
        todoFooter.style.display = todos.length ? 'flex' : 'none';
        taskCount.textContent = `${todos.filter(todo => !todo.completed).length} task${todos.filter(todo => !todo.completed).length !== 1 ? 's' : ''} remaining`;
        
        // Attach event listeners to checkboxes and delete buttons
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', () => toggleTodo(checkbox.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => deleteTodo(button.dataset.id));
        });
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});
