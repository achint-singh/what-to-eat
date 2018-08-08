const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000
const API_KEY = "bbMQ5abnmtXWaAw4oxCzndXmBVIWV77bxuJObPe1nYlETEdzNkdJncBeqBvSEyTqyUwJDaEcn4DYw9pOUa-Bp681KLt1Q15NY6b54iogbRS7nrb1JvtWGpikOkZqW3Yx";
var fetch = require('node-fetch');
// help to parse JSON sent from slack
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/', (req, res) => {

    var text = req.body.text.split(" ");
    if (text[0]) { // TODO: figure out how to send error message if they only enter a number. ex(/what-eat 20)
      var city = text[0];
    } else {
      res.send("Please specify a proper location");
    }
    if (text[1]) {
      var radius = text[1];
    } else {
      var radius = 15;
    }
    let url = "https://api.yelp.com/v3/businesses/search?location="+city+"&radius="+radius;

    // yelp get requests
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization:"Bearer " + API_KEY,
      },
    })
    .then(function(response) {
      response.json().then(function(data) { // need to convert to json for parsing
        if (data['total'] > 0) {
          var list_businesses = data['businesses'];
          var three_random = [];
          while (three_random.length < 3) {
            let random_business = list_businesses[Math.floor(Math.random()*list_businesses.length)];
            if (!three_random.includes(random_business)) {
              three_random.push(random_business);
            } 
          }
          let responseJson = {
            response_type: 'in_channel',
            text: 'Here are three random options of restaurants within your area!',
            attachments: [
              {
                "title": three_random[0].name,
                'image_url': three_random[0].image_url,
              },
              {
                "title": three_random[1].name,
                'image_url': three_random[1].image_url,

              },
              {
                "title": three_random[2].name,
                'image_url': three_random[2].image_url,
              }
            ]
          };
          res.status(200).send(res.json(responseJson));
        }
      }).catch(function(err) {
        console.log(err)
      });
    })
    .catch(function(err) {
      console.log(err)
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
