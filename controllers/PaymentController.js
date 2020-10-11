const PaymentService = require('../service/paymentService')
const OrderService = require('../service/orderService')
const ShopController = require('../controllers/ShopController')
const ClientController = require('../controllers/ClientController')
var mercadopago = require('mercadopago');
const cons = require('consolidate');

exports.insertPayment = (req, res) => {
    var idPago = req.query.collection_id
    const { number, mail, total, cuit } = req.params;
    PaymentService.createPayment(number, mail, total, cuit, idPago, (error, result) => {
        if (error) {
            console.log(error)
        }
        else {
            OrderService.updateOrderPayed(number, (error, result) => {
                if (error) {
                    console.log(error)
                }
                else {
                    ShopController.calculateDelay(cuit)
                    ShopController.sendShopNotification(cuit, 'Atención','¡Ha llegado un nuevo pedido!')
                    return res.render('success_screen')
                }
            })
        }
    })
}

const getFullUrl = (req) => {
    const url = req.protocol + '://' + req.get('host');
    //console.log(url)
    return url;
}

exports.makePayment = async (req, res) => {
    mercadopago.configure({
        sandbox: true,
        access_token: process.env.MP_ACCESS_TOKEN || "TEST-2746523765714151-090119-0f853f59b4dfeccdbffa8ef9e5eb26d6-637291628"
    });
    const { number, mail, total, cuit } = req.params;
    const purchaseOrder = {
        items: [
            item = {
                id: number,
                title: 'Compra por Flamma',
                description: 'Compra por Flamma',
                quantity: 1,
                currency_id: 'ARS',
                unit_price: parseFloat(total)
            }
        ],
        payer: {
            email: 'a@mail.com' //mail
        },
        auto_return: "all",
        external_reference: number,
        back_urls: {
            success: getFullUrl(req) + `/payments/success/${number}/${mail}/${total}/${cuit}`,
            pending: getFullUrl(req) + "/payments/pending",
            failure: getFullUrl(req) + "/payments/failure",
        }
    }
    try {
        const preference = await mercadopago.preferences.create(purchaseOrder);
        return res.redirect(`${preference.body.init_point}`);
    } catch (err) {
        console.log(err)
        return res.json(err.message);
    }
}

exports.makeRefund = async (req, res) => {
    const { numero, mailCliente } = req.params;
    PaymentService.getPaymentId(numero, async (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al cancelar pedido. Inténtalo nuevamente')
        }
        else {
            var idPago = result[0].idPago
            mercadopago.configure({
                sandbox: true,
                access_token: process.env.MP_ACCESS_TOKEN || "TEST-2746523765714151-090119-0f853f59b4dfeccdbffa8ef9e5eb26d6-637291628"
            });
            try {
                const refund = await mercadopago.payment.refund(idPago)
                OrderService.deletOrderByClient(numero, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al cancelar pedido. Inténtalo nuevamente')
                    }
                    else{
                        ClientController.sendClientNotification(mailCliente, 'Malas noticias', 'El local ha rechazado tu pedido')
                        return res.json('Pedido cancelado exitosamente')
                    } 
                })
            } catch (err) {
                console.log(err)
                return res.json(err.message)
            }
        }
    })
}