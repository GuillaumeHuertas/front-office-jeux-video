const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');                  //  permet de poster des images
const jwt = require('jsonwebtoken');

const app = express();
const upload = multer();

const PORT = 3000;
let listMovies = [];

app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('header', 'Access-Control-Allow-Origin: *');

let jeuxVideos = require('./routes/jeuxVideo');

app.use('/jeuxVideos', jeuxVideos);             // Donne le path à jeuxVideo.js jeuxVidéos

app.get('/movies', (req, res) => {

    const titleApp = 'Meilleurs Films : ';

    listMovies = [
        { title: 'Terminator', year: 1987 },
        { title: 'Star Wars', year: 1979 },
        { title: 'Indiana Jones', year: 1984 },
        { title: 'Matrix', year: 1999 }
    ];

    res.render('movies', { movies: listMovies, title: titleApp });
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
        const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
        listMovies = [...listMovies, newMovie];
        res.sendStatus(201);
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
