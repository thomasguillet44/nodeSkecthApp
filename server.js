import express, { json } from "express";
import 'dotenv/config';
import { engine } from "express-handlebars";
import bodyParser from 'body-parser';

//app express
const app = express();

//import de la db
import db from './public/js/db.js';

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


//écouter le dossier public 
app.use(express.static('public'));

//définir un utilisateur connecté fictif
app.use((req, res, next) => {
    // pour l'instant on connecte directement au user par défaut 
    const userId = 1;
    db.get(`SELECT * FROM User WHERE user_id = ?`, [userId], (err, user) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err.message);
            return next();
        }
        res.locals.user = user; // Rendre l'utilisateur accessible dans les vues
        next();
    });
});

//analyser le corps des requêtes JSON
app.use(bodyParser.json());

//equivalent controller getMapping 
app.get('/', async (request, response) => {
    response.render('mainpanel');
})

//démarrer server sur le port défini dans env
if (process.env.NODE_ENV == "developpement") {
    app.listen(process.env.PORT);
    console.log("application démarrée sur http://localhost" + process.env.PORT);
}

// Route pour enregistrer l'image
app.post('/save-canvas', (req, res) => {
    const { image } = req.body; // Récupère l'image en base64

    // Assurez-vous d'avoir une table 'sketches' dans votre base de données
    const stmt = db.prepare('INSERT INTO Sketch (user_id, title, image) VALUES (?, ?, ?)');

    // id user par defaut admin pour l'instant 
    stmt.run(1, "titreTest", image, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image.' });
        }
        res.status(200).json({ message: 'Image enregistrée avec succès!', id: this.lastID });
    });

    stmt.finalize();
});

// Route pour afficher les sketches d'un utilisateur
app.get('/user/:id/sketches', (req, res) => {
    const userId = req.params.id;

    // Requête pour récupérer les sketches de l'utilisateur
    db.all('SELECT * FROM sketches WHERE user_id = ?', [userId], (err, sketches) => {
        if (err) {
            console.error('Erreur lors de la récupération des sketches:', err.message);
            return res.status(500).send('Erreur lors de la récupération des sketches');
        }
        console.log(sketches);
        // Rendre la vue Handlebars en passant les sketches à la vue
        res.locals.sketches = sketches;
    });
});


