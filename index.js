const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const bodyParser = require('body-parser')
const mercadopago = require('mercadopago');

mercadopago.configurations.setAccessToken("ACCESS_TOKEN");

const PORT = 3001
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', (req, res) => {
  res.send(`bricks prod is on`)
})

app.get('/:fileName', (req, res) => {
  try {
    return res.sendFile(path.join(__dirname, `/public/${req.params.fileName}`))
  }
  catch(e) {
    return res.status(500).json({e})
  }
})

app.post('/process_payment', (req, res) => {
  mercadopago.payment.create(req.body)
    .then(function (data) {
      res.status(201).json(data)
    })
    .catch(function (error) {
      res.status(error.status).json({error})
    });
})

app.listen(PORT, () => {
  console.log(`Bricks PROD listening on http://localhost:${PORT}`)
})