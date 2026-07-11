const addButton = document.getElementById("addButton");
const cancelButton = document.getElementById("cancelButton");
const notePanel = document.getElementById("notePanel");
const noteForm = document.getElementById("noteForm");
const noteList = document.getElementById("noteList");
const emptyState = document.getElementById("emptyState");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

addButton.addEventListener("click", function () {
    notePanel.classList.add("open");
});

cancelButton.addEventListener("click", function () {
    notePanel.classList.remove("open");
    noteForm.reset();
});

noteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (titleInput.value.trim() === "") {
        alert("Please enter a title.");
        return;
}

    if (contentInput.value.trim() === "") {
            alert("Please enter some content.");
            return;
    }
    }

    emptyState.style.display = "none";

    const note = document.createElement("article");
    note.classList.add("note");

    const noteTitle = document.createElement("h3")
    noteTitle.textContent = titleInput.value;
    note.appendChild(noteTitle);
    
    const noteContent = document.createElement("p");
    noteContent.textContent = contentInput.value;
    note.appendChild(noteContent);
    
    const footer = document.createElement("div");
    footer.classList.add("note-footer");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    footer.appendChild(editButton);
    footer.appendChild(deleteButton);

    note.appendChild(footer);
    noteList.appendChild(note);
    noteForm.reset();
    notePanel.classList.remove("open");

});