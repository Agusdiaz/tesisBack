const OrderService = require('../service/orderService');
const ClientService = require('../service/clientService')

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
                else{
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
            asyncProducts1(result, finalResult).then(() => {
                //console.log("3  ", result)
                return res.json(result)
            })


            /*
            var finalResult = {};
            const getResult = result.map((obj, index) => {
                        ClientService.getProductOrders(obj.numero, (error, result) => {
                            obj['productos'] = []
                            if (error) {
                                console.log(error)
                                return res.status(500).send('Error al buscar productos en pedido')
                            }
                            else if (result.length > 0) {
                                //obj['productos'] = []
                                var prod = JSON.parse(JSON.stringify(result))
                                prod.forEach(it => {
                                    obj['productos'].push(it)
                                })
                            }
                            //finalResult[index] = obj
                            console.log(obj)
                            
                        })
                        return obj;
                    })
                    //return Promise.resolve()
                
            
            Promise.all(getResult).then(() => { return res.json(result) })
            */


            /*var finalResult = {};
            var wait = new Promise((resolve, reject) => {
                result.map((obj, index) => {
                ClientService.getProductOrders(obj.numero, (error, result) => {
                    obj['productos'] = []
                    if (error) {
                        console.log(error)
                        return res.status(500).send('Error al buscar productos en pedido')
                    }
                    else if (result.length > 0) {
                        obj['productos'] = []
                        var prod = JSON.parse(JSON.stringify(result))
                        prod.forEach(it => {
                            obj['productos'].push(it)
                        })
                    }
                    finalResult[index] = obj
                    console.log(finalResult[index])
                    
                })}
            )
            resolve();
        })
            wait.then(() => { return res.json(finalResult) })*/
        }
    })
}

async function asyncProducts1(result, finalResult) {
    let promise = new Promise((resolve, reject) => {
        result.map((obj) => {
            asyncProducts2(obj).then((r) => {
                result.push(r)
                console.log("1  ", finalResult)
                resolve()
            })
        })
    })
    await promise
    console.log("2  ", finalResult)
    return
}

async function asyncProducts2(obj) {
    obj.productos = []
    let promise = new Promise((resolve, reject) => {
        OrderService.getProductOrders(obj.numero, (error, result) => {
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
                resolve(resProd)
            }
            else
                resolve()
        })
    })
    let result = await promise
    obj.productos = result
    console.log('prod   ', obj)
    return obj
}
