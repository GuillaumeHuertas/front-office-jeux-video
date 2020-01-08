let express = require('express');

let router = express.Router();

let titleApp = "Liste Jeux Vidéos";

router.get('/', (req, res) => {
   res.render('jeuxVideos', { title: titleApp });
});

module.exports = router;