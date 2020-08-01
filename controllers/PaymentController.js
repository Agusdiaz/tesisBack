const PaymentService = require('../service/paymentService')

exports.insertPayment = (req, res) => {
    PaymentService.createPayment(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al crear pago')
        }
        else
            return res.json('Pago creado')
    })
}