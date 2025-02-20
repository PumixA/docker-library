const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// fonction pour se connecter à la base de donnée
const connectWithRetry = () => {
    const db = mysql.createPool({
        host: "db",
        user: "root",
        password: "root",
        database: "testdb",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
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
}

const db = connectWithRetry();

app.get("/", (req, res) => {
    res.send("Bienvenue sur mon API Node.js avec Docker !");
});

// Endpoint pour récupérer les utilisateurs
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des utilisateurs :", err);
            res.status(500).json({ error: "Erreur serveur" });
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});