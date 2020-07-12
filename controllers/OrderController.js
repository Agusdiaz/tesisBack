const OrderService = require('../service/orderService');
const ClientService = require('../service/clientService')
const ProductService = require('../service/productService')

exports.setOrderDeliveredByClient = (req, res) => {
    OrderService.deleteOrderPendingByClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al eliminar pedido pendiente')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Pedido no encontrado')
        }
        else {
            OrderService.updateOrderDelivered(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).send('Error al actualizar etapa pedido')
                }
                else if (result.affectedRows == 0) {
                    return res.status(404).send('Pedido no encontrado')
                }
                else
                    return res.send('Etapa pedido actualizada')
            })
        }
    })
}

exports.setOrderReadyByShop = (req, res) => {
    OrderService.deleteOrderPendingByShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al eliminar local de pedido pendiente')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Pedido no encontrado')
        }
        else {
            OrderService.updateOrderReady(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).send('Error al actualizar etapa pedido')
                }
                else if (result.affectedRows == 0) {
                    return res.status(404).send('Pedido no encontrado')
                }
                else
                    return res.send('Etapa pedido actualizada')
            })
        }
    })
}

exports.shareOrder = (req, res) => {
    ClientService.validateClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al validar cliente')
        }
        else if (result.length == 0) {
            return res.status(404).send('Cliente no encontrado')
        }
        else {
            OrderService.validateOrderClient(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).send('Error al validar cliente y pedido')
                }
                else if (result.length > 0) {
                    return res.json('Cliente y pedido ya existentes')
                }
                else {
                    OrderService.shareOrder(req.body, (error, result) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).send('Error al compartir pedido')
                        }
                        else
                            return res.json('Pedido compartido')
                    })
                }
            })
        }
    })
}

exports.getClientPendingOrders = (req, res) => {
    OrderService.getClientPendingOrders(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar pedidos pendientes')
        }
        else if (result.length == 0) {
            return res.status(204).send('Cliente sin pedidos pendientes')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.productos = []
                asyncProducts(obj.numero, res, (r) => {
                    obj.productos.push(r)
                    //console.log('2 - ', obj)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult) //console.log(finalResult[i].productos[0])
                })

            })
        }
    })
}

function asyncProducts(num, res, callback) {
    ProductService.getProductOrders(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar productos en pedido')
        }
        else if (result.length > 0) {
            var prod = JSON.parse(JSON.stringify(result))
            var resProd = []
            resProd = prod.map(it => {
                return it
            })
            //console.log('1 - ', resProd)
            callback(resProd)
        }
        else
            callback()
    })
}