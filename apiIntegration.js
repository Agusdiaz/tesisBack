const mercadopago = require('mercadopago')
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

mercadopago.configure({
    sandbox: true,
    access_token: "TEST-6311716851175989-072418-8098f6f602b9650727025f94110d85c7-614870969"
});


app.get('/', async (req, res) => {
    const payments = await mercadopago.payment.search()
    res.send(payments)
})

app.post('/createPayment', async (req, res) => {
    const payments = await mercadopago.payment.create({
        description: 'Buying a PS4',
        transaction_amount: 10500,
        payment_method_id: 'rapipago',
        notification_url:"https://backend-flamma.herokuapp.com", //simular llamado al webhook --> CAMBIAR EN MERCADOPAGO
        payer: {
          email: 'agustina@palabra.io',
          identification: {
            type: 'DNI',
            number: '34123123'
          }
        }
      })
    res.send(payments)
})

app.use('/', async (req, res) => {
    res.send()

   // const data = await mercadopago.payment.get(req.body.data.id)

    console.log(req.headers, req.body)
})

app.listen (port, () => console.log('App working'))



