console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addButton");
    const cancelButton = document.getElementById("cancelButton");
    const notePanel = document.getElementById("notePanel");
    const noteForm = document.getElementById("noteForm");
    const noteList = document.getElementById("noteList");
    const emptyState = document.getElementById("emptyState");

    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");

    let editingNoteId = null;

    // Open the form to add a new note
    addButton.addEventListener("click", function () {
        editingNoteId = null;
        noteForm.reset();
        notePanel.classList.add("open");
        titleInput.focus();
    });

    // Close and reset the form
    cancelButton.addEventListener("click", function () {
        closeNotePanel();
    });

    // Create or update a note
    noteForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) {
            alert("Please fill in all fields.");
            return;
        }

        const url = editingNoteId
            ? `/api/notes/${editingNoteId}`
            : "/api/notes";

        const method = editingNoteId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });

            if (!response.ok) {
                throw new Error(`Could not save note: ${response.status}`);
            }

            closeNotePanel();
            await loadNotes();
        } catch (error) {
            console.error(error);
            alert("The note could not be saved. Please check the server is running.");
        }
    });

    function closeNotePanel() {
        notePanel.classList.remove("open");
        noteForm.reset();
        editingNoteId = null;
    }

    function displayNote(noteData) {
        const note = document.createElement("article");
        note.classList.add("note");

        const noteTitle = document.createElement("strong");
        noteTitle.textContent = noteData.title;

        const noteContent = document.createElement("p");
        noteContent.textContent = noteData.content;

        const footer = document.createElement("div");
        footer.classList.add("button-container");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.classList.add("note-button");

        editButton.addEventListener("click", function () {
            editingNoteId = noteData.id;
            titleInput.value = noteData.title;
            contentInput.value = noteData.content;
            notePanel.classList.add("open");
            titleInput.focus();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("note-button", "secondary-button");

        deleteButton.addEventListener("click", async function () {
            const shouldDelete = confirm(
                `Delete "${noteData.title}"?`
            );

            if (!shouldDelete) {
                return;
            }

            try {
                const response = await fetch(
                    `/api/notes/${noteData.id}`,
                    {
                        method: "DELETE"
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Could not delete note: ${response.status}`
                    );
                }

                await loadNotes();
            } catch (error) {
                console.error(error);
                alert("The note could not be deleted.");
            }
        });

        footer.append(editButton, deleteButton);
        note.append(noteTitle, noteContent, footer);
        noteList.appendChild(note);
    }

    async function loadNotes() {
        try {
            const response = await fetch("/api/notes");

            if (!response.ok) {
                throw new Error(
                    `Could not load notes: ${response.status}`
                );
            }

            const notes = await response.json();

            noteList.innerHTML = "";

            if (!Array.isArray(notes) || notes.length === 0) {
                emptyState.style.display = "block";
                return;
            }

            emptyState.style.display = "none";

            notes.forEach(function (note) {
                displayNote(note);
            });
        } catch (error) {
            console.error(error);
            emptyState.style.display = "block";
            emptyState.textContent =
                "Notes could not be loaded. Check that the server is running.";
        }
    }

    loadNotes();
});