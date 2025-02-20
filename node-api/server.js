const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;
app.use(express.json());
const connectWithRetry = () => {
    const db = mysql.createPool({
        host: "db",
        user: "root",
        password: "root",
        database: "docker-librairy",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
    });
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Erreur de connexion à MySQL :", err);
            console.log("Nouvelle tentative dans 5 secondes...");
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log("✅ Connecté à MySQL !");
            connection.release();
        }
    });
    return db;
};
const db = connectWithRetry();
app.get("/", (req, res) => {
    res.send("Bienvenue sur mon API Node.js avec Docker !");
});
app.get("/books", (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des livres :", err);
            res.status(500).json({ error: "Erreur serveur" });
        } else {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.json(results);
        }
    });
});
app.post("/books", (req, res) => {
    const { name, genre, price } = req.body;
    if (!name || !genre || !price) {
        return res.status(400).json({ error: "Veuillez fournir un nom, un genre et un prix." });
    }
    const sql = "INSERT INTO books (name, genre, price) VALUES (?, ?, ?)";
    db.query(sql, [name, genre, price], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'ajout du livre :", err);
            res.status(500).json({ error: "Erreur serveur" });
        } else {
            res.status(201).json({ message: "Livre ajouté avec succès", id: result.insertId });
        }
    });
});
app.delete("/books/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM books WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression du livre :", err);
            res.status(500).json({ error: "Erreur serveur" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Livre non trouvé" });
        } else {
            res.json({ message: "Livre supprimé avec succès" });
        }
    });
});
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
