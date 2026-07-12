const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

const dbPath = path.join(__dirname, "db", "db.json");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Helper function to read notes
function readNotes(callback) {
    fs.readFile(dbPath, "utf8", function (error, data) {
        if (error) {
            return callback(error);
        }

        try {
            const notes = JSON.parse(data);
            callback(null, notes);
        } catch (parseError) {
            callback(parseError);
        }
    });
}

// Helper function to save notes
function saveNotes(notes, callback) {
    fs.writeFile(
        dbPath,
        JSON.stringify(notes, null, 2),
        "utf8",
        callback
    );
}

// routes

app.get("/api/notes", function (req, res) {
    readNotes(function (error, notes) {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Failed to read notes"
            });
        }

        res.json(notes);
    });
});

app.get("/api/notes/:id", function (req, res) {
    const noteId = req.params.id;

    readNotes(function (error, notes) {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Failed to read notes"
            });
        }

        const note = notes.find(function (note) {
            return note.id === noteId;
        });

        if (!note) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        res.json(note);
    });
});

// Add a new note
app.post("/api/notes", function (req, res) {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (!title || !content) {
        return res.status(400).json({
            error: "Title and content are required"
        });
    }

    const newNote = {
        id: uuidv4(),
        title: title,
        content: content
    };

    readNotes(function (error, notes) {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Failed to read notes"
            });
        }

        notes.push(newNote);

        saveNotes(notes, function (writeError) {
            if (writeError) {
                console.error(writeError);

                return res.status(500).json({
                    error: "Failed to save note"
                });
            }

            res.status(201).json(newNote);
        });
    });
});

// Update a note
app.put("/api/notes/:id", function (req, res) {
    const noteId = req.params.id;
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (!title || !content) {
        return res.status(400).json({
            error: "Title and content are required"
        });
    }

    readNotes(function (error, notes) {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Failed to read notes"
            });
        }

        const noteIndex = notes.findIndex(function (note) {
            return note.id === noteId;
        });

        if (noteIndex === -1) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        const updatedNote = {
            id: noteId,
            title: title,
            content: content
        };

        notes[noteIndex] = updatedNote;

        saveNotes(notes, function (writeError) {
            if (writeError) {
                console.error(writeError);

                return res.status(500).json({
                    error: "Failed to update note"
                });
            }

            res.json(updatedNote);
        });
    });
});

// Delete a note
app.delete("/api/notes/:id", function (req, res) {
    const noteId = req.params.id;

    readNotes(function (error, notes) {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Failed to read notes"
            });
        }

        const noteExists = notes.some(function (note) {
            return note.id === noteId;
        });

        if (!noteExists) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        const updatedNotes = notes.filter(function (note) {
            return note.id !== noteId;
        });

        saveNotes(updatedNotes, function (writeError) {
            if (writeError) {
                console.error(writeError);

                return res.status(500).json({
                    error: "Failed to delete note"
                });
            }

            res.json({
                message: "Note deleted successfully"
            });
        });
    });
});

// 404 response
app.use(function (req, res) {
    res.status(404).json({
        error: "Page not found"
    });
});

// Start server
app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
});