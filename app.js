const express = require('express');
const app = express();

const PORT = 3000;

app.use('/public', express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {

    const titleApp = 'Meilleurs Films : ';

    const listMovies = [
        { title: 'Terminator', year: 1987 },
        { title: 'Star Wars', year: 1979 },
        { title: 'Indiana Jones', year: 1984 },
        { title: 'Matrix', year: 1999 }
    ];

   res.render('movies', { movies: listMovies, title: titleApp });
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