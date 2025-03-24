class Task {
    constructor(name, description, dueDate) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = false;
    }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');

function renderTasks() {
    taskList.innerHTML = '';
    const filter = statusFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    tasks
        .filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        })
        .filter(task => task.name.toLowerCase().includes(searchTerm))
        .forEach((task, index) => {
            const row = taskList.insertRow();
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.description}</td>
                <td>${task.dueDate}</td>
                <td><button class="status-button ${task.completed ? 'completed' : ''}" data-index="${index}">${task.completed ? 'Completed' : 'Pending'}</button></td>
                <td><button class="edit-button" data-index="${index}"><i class="fa-solid fa-pen-to-square"></i> Edit</button></td>
                <td><button class="delete-button" data-index="${index}"><i class="fa-solid fa-trash"></i> Delete</button></td>
            `;
        });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('taskName').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;

    if (!name) {
        alert('Task name is required.');
        return;
    }

    tasks.push(new Task(name, description, dueDate));
    saveTasks();
    renderTasks();
    taskForm.reset();
});

taskList.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains('delete-button')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    } else if (e.target.classList.contains('edit-button')) {
        const task = tasks[index];
        const newName = prompt('Enter new task name:', task.name);
        if (newName !== null) {
            task.name = newName;
            const newDescription = prompt('Enter new description:', task.description);
            if (newDescription !== null) {
                task.description = newDescription;
                const newDueDate = prompt('Enter new Date:', task.dueDate);
                if(newDueDate !== null) {
                    task.dueDate = newDueDate;
                    saveTasks();
                    renderTasks();
                }
            }
        }
    } else if (e.target.classList.contains('status-button')) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }
});

statusFilter.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);

renderTasks();