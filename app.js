const express = require('express');
const app = express();

const PORT = 3000;

app.use('/public', express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {
   res.render('movies');
});

app.get('/movie-detail', (req, res) => {
    res.render('movie-detail');
});

app.get('/', (req, res) =>{
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});