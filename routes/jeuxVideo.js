let express = require('express');
let Client = require('node-rest-client').Client;

let router = express.Router();
let client = new Client();

let titleApp = "Liste Jeux Vidéos :";

router.get('/', (req, res) => {
   client.registerMethod("jsonMethod", "http://localhost:8080/jeuxVideos", "GET");

   client.methods.jsonMethod(function (data, response) {

      console.log(data.content);

      const jeuxvideos = data.content;

      res.render('jeuxVideos', { title: titleApp, jeuxvideos: jeuxvideos});
   });
});

router.get('/new', (req, res) => {
   res.render('new-jeux-video', { title: titleApp });
});



router.post('/new', (req, res) => {

   var args = {
      data: {
         "titre": "Spyro",
         "developpeur": "Insomniac Games",
         "editeur": "Activision",
         "statut": true,
         "note": 20,
         "description": "Meilleur remake de jeux de plateforme"
      },
      headers: { "Content-Type": "application/json" }
   };
   client.registerMethod("postMethod", "http://localhost:8080/consoles/1051/jeuxVideos", "POST");

   client.methods.postMethod(args, function (data, response) {

      // parsed response body as js object
      // console.log(data);
      console.log("passe ici");
      // raw response
      // console.log(response);
   });

});

router.get('/search', (req, res) => {
   res.render('jeuxVideos-search', { title: titleApp });
});

module.exports = router;
