const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const bodyParser = require('body-parser')
const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: 'ACCESS_TOKEN'});
const payment = new Payment(client);

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

app.post('/process_payment', async (req, res) => {
  const formData = 'formData' in req.body ? req.body.formData : req.body;

  if (formData) {
    if (formData.payment_method_id === 'pse') {
      formData.description = 'white t-shirt'
      formData.additional_info = {
        // ip_address randomly generated
        ip_address: '177.59.165.145'
      }
      formData.callback_url = 'https://google.com'
    }

    try {
      const paymentResponse = await payment.create({ body: formData })
      res.status(201).json(paymentResponse)
    } catch(err) {
      res.status(err.status).json({err})
    }

    return;
  }

  res.status(400).send('Invalid formData at body', req.body)
})

app.listen(PORT, () => {
  console.log(`Bricks PROD listening on http://localhost:${PORT}`)
})