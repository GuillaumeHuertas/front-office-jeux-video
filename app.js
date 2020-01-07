const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;
let listMovies = [];

app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));



app.set('views', './views');
app.set('view engine', 'ejs');

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

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/movies', urlencodedParser, (req, res) => {
    console.log(`Titre du film : ${req.body.movietitle}`);
    console.log(`Année de sortie : ${req.body.movieyear}`);
    const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
    // Ancienne méthode
    // listMovies.push(newMovie);
    // Créé un nouveau tableau suivi du nouvel élément
    listMovies = [...listMovies, newMovie];
    console.log(listMovies);
    res.sendStatus(201);
});

app.get('/movies/:id/:titre', (req, res) => {
    const id = req.params.id;
    const titre = req.params.titre;
    res.render('movie-detail', { movieid: id, titrefilm: titre });
});

app.get('/', (req, res) =>{
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});