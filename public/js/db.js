const sqlite3 = require('sqlite3').verbose();

// Créer et ouvrir la base de données
const db = new sqlite3.Database('./drawingApp.db', (err) => {
    if (err) {
        console.error('Erreur lors de l’ouverture de la base de données :', err.message);
    } else {
        console.log('Base de données SQLite connectée.');
    }
});

// Fonction pour supprimer toutes les tables
function dropAllTables() {
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS users', (err) => {
            if (err) {
              console.error('Erreur lors de la suppression de la table:', err.message);
            } else {
              console.log('Table users supprimée');
            }
          });
      db.run('DROP TABLE IF EXISTS Sketch', (err) => {
        if (err) {
          console.error('Erreur lors de la suppression de la table:', err.message);
        } else {
          console.log('Table Sketch supprimée');
        }
      });
    });
}

// Créer les tables
function createTables() {  
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL
      );
    `;

    const createSketchesTable = `
      CREATE TABLE IF NOT EXISTS Sketch (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        image TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    db.serialize(() => {
        db.run(createUsersTable);
        db.run(createSketchesTable);
    });
}

dropAllTables();
createTables();

const defaultUser = {
    username: 'admin',
    password: 'admin123'
};

db.get(
    `SELECT * FROM User`,
    (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l’utilisateur par défaut :', err.message);
        } else if (!row) {
            // user est vide donc on ajoute l'utilisateur par defaut
            db.run(
                `INSERT INTO User (username, password) VALUES (?, ?)`,
                [defaultUser.username, defaultUser.password],
                function (err) {
                    if (err) {
                        console.error('Erreur lors de l’insertion de l’utilisateur par défaut :', err.message);
                    } else {
                        console.log('Utilisateur par défaut ajouté avec succès.');
                    }
                }
            );
        } else {
            console.log('Utilisateur par défaut déjà présent.');
        }
    }
);

module.exports = db;