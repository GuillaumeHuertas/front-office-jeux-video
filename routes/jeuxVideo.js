let express = require('express');

let router = express.Router();

let titleApp = "Liste Jeux Vidéos :";

router.get('/', (req, res) => {
   res.render('jeuxVideos', { title: titleApp });
});

router.get('/new', (req, res) => {
   res.render('new-jeux-video', { title: titleApp });
});

router.get('/search', (req, res) => {
   res.render('jeuxVideos-search', { title: titleApp });
});

module.exports = router;
