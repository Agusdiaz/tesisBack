const OrderService = require('../service/orderService');
const ClientService = require('../service/clientService')
const ProductService = require('../service/productService')
const IngredientService = require('../service/ingredientService')

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
                asyncProductsForClient(obj.numero, res, (r) => {
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

exports.getClientAllOrders = (req, res) => {
    OrderService.getClientAllOrders(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar historial pedidos')
        }
        else if (result.length == 0) {
            return res.status(204).send('Cliente sin pedidos')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.productos = []
                asyncProductsForClient(obj.numero, res, (r) => {
                    obj.productos.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
    })
}

exports.getShopPendingOrdersByArrival = (req, res) => {
    OrderService.getShopPendingOrdersByArrival(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar pedidos pendientes')
        }
        else if (result.length == 0) {
            return res.status(204).send('Local sin pedidos pendientes')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.productos = []
                asyncProductsForShop(obj.numero, res, (r) => {
                    obj.productos.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
    })
}

exports.getShopPendingOrdersByProducts = (req, res) => {
    OrderService.getShopPendingOrdersByProducts(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar pedidos pendientes')
        }
        else if (result.length == 0) {
            return res.status(204).send('Local sin pedidos pendientes')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.productos = []
                asyncProductsForShop(obj.numero, res, (r) => {
                    obj.productos.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
    })
}

exports.insertClientOrder = (req, res) => {
    validateProductsAndIngredients(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al validar productos e ingredientes en pedido')
        }
        else if (result != null) {
            if (result[0].length > 0 && result[1].length > 0) {
                return res.status(401).send('Productos con id=' + result[0][0].id + ' e Ingredientes con id=' + result[1][0].id + ' no disponibles')
            }
            else if (result[0].length > 0) {
                return res.status(401).send('Productos con id=' + result[0][0].id + ' no disponibles')
            }
            else {
                return res.status(401).send('Ingredientes con id=' + result[1][0].id + ' no disponibles')
            }
        }
        else {
            OrderService.createClientOrder(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).send('Error al crear pedido')
                }
                else {
                    var orderNumber = result.insertId
                    var longProd = req.body.productos.length
                    var iProd = 0
                    req.body.productos.forEach(obj => {
                        var iIngr = 0
                        var longIngr = obj.ingredientes.length
                        ProductService.createProductForOrder(obj, orderNumber, (error, result) => {
                            if (error) {
                                console.log(error)
                                return res.status(500).send('Error al guardar producto en pedido')
                            }
                            else {
                                if (longIngr > 0) {
                                    var idPedidoProducto = result.insertId
                                    var idProducto = obj.idProducto
                                    obj.ingredientes.forEach(obj => {
                                        IngredientService.createIngredientForOrder(obj, idPedidoProducto, idProducto, (error, result) => {
                                            if (error) {
                                                console.log(error)
                                                return res.status(500).send('Error al guardar ingrediente en pedido')
                                            }
                                            else {
                                                iIngr++
                                                iProd++
                                                if (iIngr == longIngr && iProd == longProd) {
                                                    OrderService.createPendingOrder(req.body.mail, req.body.cuit, orderNumber, (error, result) => {
                                                        if (error) {
                                                            console.log(error)
                                                            return res.status(500).send('Error al crear pedido pendiente')
                                                        }
                                                        else {
                                                            return res.send('Pedido creado')
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                                else {
                                    iProd++
                                    if (iProd == longProd) {
                                        OrderService.createPendingOrder(req.body.mail, req.body.cuit, orderNumber, (error, result) => {
                                            if (error) {
                                                console.log(error)
                                                return res.status(500).send('Error al crear pedido pendiente')
                                            }
                                            else {
                                                return res.send('Pedido creado')
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    })
                }
            })
        }
    })
}

function asyncProductsForClient(num, res, callback) {
    ProductService.getProductsOrder(num, (error, result) => {
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
            callback(resProd)
        }
        else
            callback()
    })
}

function asyncProductsForShop(num, res, callback) {
    ProductService.getProductsOrder(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar productos en pedido')
        }
        else if (result.length > 0) {
            var i = 0
            var prod = JSON.parse(JSON.stringify(result))
            var resProd = []
            resProd = prod.map(it => {
                it.ingredientes = []
                asyncIngredients(it.id, res, (r) => {
                    it.ingredientes.push(r)
                    i++
                    if (i == prod.length)
                        callback(resProd)
                })
                return it
            })
        }
        else
            callback()
    })
}

function asyncIngredients(num, res, callback) {
    IngredientService.getIngredientsOrder(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar ingredientes en pedido')
        }
        else if (result.length > 0) {
            var ingr = JSON.parse(JSON.stringify(result))
            var resIngr = []
            resIngr = ingr.map(it => {
                return it
            })
            callback(resIngr)
        }
        else
            callback()
    })
}

function validateProductsAndIngredients(list, callback) {
    var products = []
    var ingredients = []
    list.productos.forEach(obj => {
        products.push(obj.idProducto)
        obj.ingredientes.forEach(obj => {
            ingredients.push(obj.idIngrediente)
        })
    })
    ProductService.validateProductsAndIngredients(products, ingredients, (error, result) => {
        if (error) {
            callback(error)
        }
        else if (result[0].length == 0 && result[1].length == 0) { //TODO ESTA DISPONIBLE
            callback(null, null)
        }
        else {
            callback(null, result)
        }
    })
}