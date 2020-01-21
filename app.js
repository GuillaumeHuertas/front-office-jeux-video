const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');//  permet de poster des images
const methodOverride = require('method-override');

const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };
// Le mieux c'est de le mettre en variable d'environement
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

// Permet de générer des nom, années etc au hasard
const faker=  require('faker');

// import du fichier de config
const config = require('./config');

const mongoose = require('mongoose');

const app = express();
// Middleware permetant de récupérer le body et ses params
const upload = multer();
// Middleware permetant de récupérer le body et ses params
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// Nécessaire pour faire fonctionner mongoose !
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Informations de connection à la base de données
mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@expressmovie-zcc1l.mongodb.net/test?retryWrites=true&w=majority`, options);
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

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Déclaration des fihciers statics
app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(expressJwt({ secret: secret }).unless({ path: ['/', '/movies', '/movies-search', '/login', new RegExp('/movies.*/', 'i')] }));

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

// upload.fields pour récupérer le body upload.fields([]) à la place de urlencodedParser
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

app.get('/movie-details/:id', (req, res) => {
    const id = req.params.id;
    Movie.findById(id, (err, movie) => {
        console.log(movie);
        res.render('movie-details', { movie: movie });
    });
});

app.put('/movie-details/:id', urlencodedParser, (req, res) => {
    console.log("super coucou");
    if (!req.body) {
        return res.sendStatus(500);
    }
    console.log(req.body);
    console.log('movietitle: ', req.body.movietitle, 'movieyear : ', req.body.movieyear);
    const id = req.params.id;
    // { new: true } permet de récupérer l'objet modifié
    Movie.findByIdAndUpdate(id, {$set: {movietitle: req.body.movietitle,  movieyear: req.body.movieyear}}, { new: true },(err, movie) => {
        if (err) {
            console.log(err);
            return res.send('le film n\'a pas pu être mis à jour');
        }
        return res.redirect('/movies');
    });
});

app.delete('/movie-details/:id', (req, res) => {
    const id = req.params.id;
    Movie.findByIdAndRemove(id, (err, movie) => {
        res.sendStatus(202);
    });
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
