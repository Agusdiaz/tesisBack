const PaymentService = require('../service/paymentService')
const mercadopago = require('mercadopago')

mercadopago.configure({
    sandbox: true,
    access_token: "TEST-6311716851175989-072418-8098f6f602b9650727025f94110d85c7-614870969"
});

exports.createPayment = (req, res) => {
    var payment = {
        description: 'Compra Flamma',
        transaction_amount: req.body.total,
        payment_method_id: 'rapipago',
        notification_url: "https://backend-flamma.herokuapp.com", //simular llamado al webhook --> CAMBIAR EN MERCADOPAGO
        payer: {
            email: req.body.mail,
            identification: {
                type: req.body.tipo,
                number: req.body.dni.toString()
            }
        }
    }
    mercadopago.payment.create(payment)
        .then(function (mpResponse) {
            res.send(mpResponse);
        })
        .catch(function (mpError) {
            return mercadopago.payment.create(payment, {
                qs: {
                    idempotency: mpError.idempotency
                }
            });
        })
        .then(function (mpResponse) {
            res.send(mpResponse);
        });
}

exports.getPayments = async (req, res) => {
    const payments = await mercadopago.payment.search()
    res.send(payments)
}

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
    console.log(req.protocol, '  *************')
    mercadopago.configure({
        sandbox: process.env.SANDBOX == 'true' ? true : false,
        access_token: process.env.MP_ACCESS_TOKEN || "TEST-6311716851175989-072418-8098f6f602b9650727025f94110d85c7-614870969"
    });
    const { id, email, description, amount } = req.params;

    //Create purchase item object template
    const purchaseOrder = {
        items: [
            item = {
                id: id,
                title: 'Compra Flamma',
                description: 'Compra Flamma',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(amount)
            }
        ],
        payer: {
            email: email
        },
        auto_return: "all",
        external_reference: id,
        back_urls: {
            success: getFullUrl(req) + "/payments/success",
            pending: getFullUrl(req) + "/payments/pending",
            failure: getFullUrl(req) + "/payments/failure",
        }
    }

    //Generate init_point to checkout
    try {
        const preference = await mercadopago.preferences.create(purchaseOrder);
        return res.redirect(`${preference.body.init_point}`);
    } catch (err) {
        return res.send(err.message);
    }
}