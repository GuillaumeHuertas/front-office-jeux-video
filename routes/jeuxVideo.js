const express = require('express');
const Client = require('node-rest-client').Client;
const bodyParser = require('body-parser');
const multer = require('multer');

let router = express.Router();
let client = new Client();

let urlencodedParser = bodyParser.urlencoded({ extended: false });
const upload = multer();

let titleApp = "Liste Jeux Vidéos :";

router.get('/', (req, res) => {
   client.registerMethod("jsonMethod", "http://localhost:8080/jeuxVideos", "GET");

   client.methods.jsonMethod(function (data, response) {

      // console.log(data.content);

      const jeuxvideos = data.content;

      res.render('jeuxVideos', { title: titleApp, jeuxvideos: jeuxvideos});
   });
});

router.get('/new', (req, res) => {
   res.render('new-jeux-video', { title: titleApp });
});



router.post('/new', urlencodedParser, (req, res) => {

   let body = req.body;

   console.log("titre : " + body.titre);
   console.log("dev : " + body.developpeur);

   let args = {
      data: {
         "titre": body.titre,
         "developpeur": body.developpeur,
         "editeur": body.editeur,
         "statut": true,
         "note": 20,
         "description": "Meilleur remake de jeux de plateforme"
      },
      headers: { "Content-Type": "application/json" }
   };
   client.registerMethod("postMethod", "http://localhost:8080/consoles/1051/jeuxVideos", "POST");

   client.methods.postMethod(args, function (data, response) {

      console.log("POST sur le back-end");

      return res.status(201).send(body);

   });
});

router.get('/search', (req, res) => {
   res.render('jeuxVideos-search', { title: titleApp });
});

module.exports = router;
