const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');//  permet de poster des images

const jwt = require('jsonwebtoken');

// Permet de générer des nom, années etc au hasard
const faker=  require('faker');

const mongoose = require('mongoose');


const app = express();
const upload = multer();


// Nécessaire pour faire fonctionner mongoose !
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Informations de connection à la base de données
mongoose.connect('mongodb+srv://samuser:samuser@expressmovie-zcc1l.mongodb.net/test?retryWrites=true&w=majority', options);
const db = mongoose.connection;
// Affiche une erreur ou le succès à la connection à la DB au lancement de l'app
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'));
db.once('open', () => {
    console.log('connected to the DB :)');
});

// Schema utiliser par la mongoose pour le mapping
const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number
});

// Modèle fait à partir du Schema, le premier paramètre est le nom de la collection au singulier
const Movie = mongoose.model('Movie', movieSchema);

// // Créer un phrase de troismots au hasard
// const title = faker.lorem.sentence(3);
// const year = Math.floor(Math.random() * 80) + 1950;
//
// const myMovie = new Movie({ movietitle: title, movieyear: year});
// // Sauvegarde l'objet en base à l'aide de la méthode save
// myMovie.save((err, savedMovie) => {
//     if(err) {
//         console.error(err);
//     } else {
//         console.log('savedMovie', savedMovie);
//     }
// });

const PORT = 3000;
let listMovies = [];

// Déclaration des fihciers statics
app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));

// Déclaration du fichier de views
app.set('views', './views');
// Déclaration de ejs pour ne pas avoir à préciser les .ejs
app.set('view engine', 'ejs');
// Permet le cross origin
app.set('header', 'Access-Control-Allow-Origin: *');

// Déclare la route jeuxVidéos
let jeuxVideos = require('./routes/jeuxVideo');

// Utilise la route jeuxVidéo et précise en premier param le path de base
app.use('/jeuxVideos', jeuxVideos);             // Donne le path à jeuxVideo.js jeuxVidéos

app.get('/movies', (req, res) => {

    const titleApp = 'Meilleurs Films : ';

    listMovies = [];

    Movie.find((err, movies) => {
        if(err) {
            console.log('could not retrieve movies from DB');
            res.sendStatus(500);
        } else {
            console.log(movies);
            console.log('OK');
            listMovies = movies;
            res.render('movies', { movies: listMovies, title: titleApp });
        }
    });
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });      // Récupère le body d'un requête

// app.post('/movies', urlencodedParser, (req, res) => {
//     console.log(`Titre du film : ${req.body.movietitle}`);
//     console.log(`Année de sortie : ${req.body.movieyear}`);
//     const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
//     // Ancienne méthode
//     // listMovies.push(newMovie);
//     // Créé un nouveau tableau suivi du nouvel élément
//     listMovies = [...listMovies, newMovie];
//     console.log(listMovies);
//     res.sendStatus(201);
// });

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        console.log('formData: ', formData);

        const title = req.body.movietitle;
        const year = req.body.movieyear;
        const myMovie = new Movie({ movietitle: title, movieyear: year });
        myMovie.save((err, savedMovie) => {
            if (err) {
                console.log(err);
            } else {
                console.log(savedMovie);
                res.sendStatus(201);
            }

        })


        // const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
        // listMovies = [...listMovies, newMovie];
        // res.sendStatus(201);
    }

});

app.get('/movies/:id/:titre', (req, res) => {
    const id = req.params.id;
    const titre = req.params.titre;
    res.render('movie-detail', { movieid: id, titrefilm: titre });
});

app.get('/', (req, res) =>{
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login', {title: 'Connexion'});
});

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq'; // Le mieux c'est de le mettre en variable d'environement

app.post('/login', urlencodedParser, (req, res) => {
    console.log('login post ', req.body);
    if(!req.body) {
        res.sendStatus(500);
    } else {
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jwt.sign({iss: 'http://expressmovie.fr', user: 'Sam', scope: 'admin'}, secret);
            res.json(myToken);

        } else  {
            res.sendStatus(401);
        }
    }
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
