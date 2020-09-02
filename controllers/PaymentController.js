const PaymentService = require('../service/paymentService')
var mercadopago = require('mercadopago');

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

const getFullUrl = (req) => {
    const url = req.protocol + '://' + req.get('host');
    console.log(url)
    return url;
}

exports.checkout = async (req, res) => {
    mercadopago.configure({
        sandbox: true,
        access_token: process.env.MP_ACCESS_TOKEN || "TEST-2746523765714151-090119-0f853f59b4dfeccdbffa8ef9e5eb26d6-637291628"
    });
    const { id, email, amount } = req.params;

    const purchaseOrder = {
        items: [
            item = {
                id: id,
                title: 'Compra por Flamma',
                description: 'Compra por Flamma',
                quantity: 1,
                currency_id: 'ARS',
                unit_price: parseFloat(amount)
            }
        ],
        payer: {
            email: email //'test_user_52338529@testuser.com'
        },
        auto_return: "all",
        external_reference: id,
        back_urls: {
            success: getFullUrl(req) + "/payments/success",
            pending: getFullUrl(req) + "/payments/pending",
            failure: getFullUrl(req) + "/payments/failure",
        }
    }

    try {
        const preference = await mercadopago.preferences.create(purchaseOrder);
        return res.redirect(`${preference.body.init_point}`);
    } catch (err) {
        return res.send(err.message);
    }
}