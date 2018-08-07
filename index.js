const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/*', (req, res) => {
	res.status(200).send("request received");
	var body = req.body;
	alert(body);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
