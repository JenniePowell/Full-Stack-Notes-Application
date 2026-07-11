const toggleButton = document.getElementById("toggleButton");
const taskPanel = document.getElementById("taskPanel");

toggleButton.addEventListener("click", function () {
    taskPanel.classList.toggle("open");
});

const saveTaskButton = document.getElementById("saveTaskButton");

saveTaskButton.addEventListener("click", function () {

    const taskInput = document.getElementById("taskName");
    const taskDescription = document.getElementById("taskDescription");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") {
        alert("Please enter a task name.");
        return;
    }

    const newTask = document.createElement("li");

    const completeButton = document.createElement("button");
    completeButton.classList.add("delete-button");

    const title = document.createElement("strong");
    title.textContent = taskInput.value;

    const description = document.createElement("p");
    description.textContent = taskDescription.value;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("task-button");

    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.textContent = "Delete";
    deleteTaskButton.classList.add("task-button");

    completeButton.addEventListener("click", function () {
        newTask.classList.toggle("completed");
        completeButton.classList.toggle("completed");
    });

    editButton.addEventListener("click", function () {

        const newTitle = prompt(
            "Edit title:",
            title.textContent
        );

        const newDescription = prompt(
            "Edit description:",
            description.textContent
        );

        if (newTitle !== null && newTitle.trim() !== "") {
            title.textContent = newTitle;
        }

        if (newDescription !== null) {
            description.textContent = newDescription;
        }
    });

    deleteTaskButton.addEventListener("click", function () {
 if (confirm("Delete this task?")) {
        newTask.remove();
        }
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteTaskButton);

    newTask.appendChild(completeButton);
    newTask.appendChild(title);
    newTask.appendChild(description);
    newTask.appendChild(buttonContainer);

    taskList.appendChild(newTask);

    taskInput.value = "";
    taskDescription.value = "";
});