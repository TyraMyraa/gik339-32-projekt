const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./gik339-project.db');

app.use(express.json());

//skapa tabellen automatiskt när servern startar
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);
});

app.get('/api/resources', (req, res) => {
    db.all('SELECT * FROM resources', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/api/resources', (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO resources (name) VALUES (?)', [name], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.put('/api/resources', (req, res) => {
    const { id, name } = req.body;
    db.run('UPDATE resources SET name = ? WHERE id = ?', [name, id], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ updatedID: this.changes });
    });
});

app.delete('/api/resources/:id', (req, res) => {
    db.run('DELETE FROM resources WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ deletedID: this.changes });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
