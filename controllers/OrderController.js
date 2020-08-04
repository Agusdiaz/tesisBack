const OrderService = require('../service/orderService');
const ClientService = require('../service/clientService');
const ShopService = require('../service/shopService');
const ProductService = require('../service/productService');
const IngredientService = require('../service/ingredientService');
const PromoService = require('../service/promoService');

exports.setOrderDeliveredByClient = (req, res) => {
    OrderService.deleteOrderPendingByClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al actualizar pedido') //Error al eliminar pedido pendiente
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Pedido no encontrado')
        }
        else {
            OrderService.updateOrderDelivered(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json('Error al actualizar pedido')
                }
                else if (result.affectedRows == 0) {
                    return res.status(404).json('Pedido no encontrado')
                }
                else
                    return res.json('Pedido actualizado')
            })
        }
    })
}

exports.setOrderReadyByShop = (req, res) => {
    OrderService.deleteOrderPendingByShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al eliminar local de pedido pendiente')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Pedido no encontrado')
        }
        else {
            OrderService.updateOrderReady(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json('Error al actualizar etapa y fecha del pedido')
                }
                else if (result.affectedRows == 0) {
                    return res.status(404).json('Pedido no encontrado')
                }
                else
                    return res.json('Etapa y fecha del pedido actualizada')
            })
        }
    })
}

exports.shareOrder = (req, res) => {
    ClientService.validateClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar cliente')
        }
        else if (result.length == 0) {
            return res.status(404).json('Usuario no encontrado')
        }
        else {
            OrderService.validateOrderClient(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json('Error al validar cliente y pedido')
                }
                else if (result.length > 0) {
                    return res.json('Ya le compartiste el pedido a ese usuario')
                }
                else {
                    OrderService.shareOrder(req.body, (error, result) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).json('Error al compartir pedido')
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
            return res.status(500).json('Error al buscar pedidos pendientes')
        }
        else if (result.length == 0) {
            return res.status(204).json('Cliente sin pedidos pendientes')
        }
        else {
            var finalResult = []
            var long = result.length
            var iProd = 0
            var iProm = 0
            result.map(obj => {
                obj.promociones = []
                obj.productos = []
                asyncPromosOrderByShop(obj.numero, 'pendiente', res, (r) => {
                    obj.promociones.push(r)
                    iProm++
                    asyncProductsForShop(obj.numero, res, (r) => {
                        obj.productos.push(r)
                        finalResult.push(obj)
                        iProd++
                        if (iProd == long)
                            return res.json(finalResult)
                    })
                })
            })
        }
    })
}

exports.getClientAllOrders = (req, res) => {
    OrderService.getClientAllOrders(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar historial pedidos')
        }
        else if (result.length == 0) {
            return res.status(204).json('Cliente sin pedidos')
        }
        else {
            var finalResult = []
            var long = result.length
            var iProd = 0
            var iProm = 0
            result.map(obj => {
                obj.promociones = []
                obj.productos = []
                asyncPromosOrderByShop(obj.numero, 'entregado', res, (r) => {
                    obj.promociones.push(r)
                    iProm++
                    asyncProductsForShop(obj.numero, res, (r) => {
                        obj.productos.push(r)
                        finalResult.push(obj)
                        iProd++
                        if (iProd == long)
                            return res.json(finalResult)
                    })
                })
            })
        }
    })
}

exports.getShopDeliveredOrdersByArrival = (req, res) => {
    OrderService.getShopDeliveredOrdersByArrival(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar pedidos pendientes')
        }
        else if (result.length == 0) {
            return res.status(204).json('Local sin pedidos pendientes')
        }
        else {
            var finalResult = []
            var long = result.length
            var iProd = 0
            var iProm = 0
            result.map(obj => {
                obj.promociones = []
                obj.productos = []
                asyncPromosOrderByShop(obj.numero, 'entregado', res, (r) => {
                    obj.promociones.push(r)
                    iProm++
                    asyncProductsForShop(obj.numero, res, (r) => {
                        obj.productos.push(r)
                        finalResult.push(obj)
                        iProd++
                        if (iProd == long)
                            return res.json(finalResult)
                    })
                })
            })
        }
    })
}

exports.getShopPendingOrdersByArrival = (req, res) => {
    OrderService.getShopPendingOrdersByArrival(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar pedidos pendientes')
        }
        else if (result.length == 0) {
            return res.status(204).json('Local sin pedidos pendientes')
        }
        else {
            var finalResult = []
            var long = result.length
            var iProd = 0
            var iProm = 0
            result.map(obj => {
                obj.promociones = []
                obj.productos = []
                asyncPromosOrderByShop(obj.numero, 'pendiente', res, (r) => {
                    obj.promociones.push(r)
                    iProm++
                    asyncProductsForShop(obj.numero, res, (r) => {
                        obj.productos.push(r)
                        finalResult.push(obj)
                        iProd++
                        if (iProd == long)
                            return res.json(finalResult)
                    })
                })
            })
        }
    })
}

exports.getShopPendingOrdersByProducts = (req, res) => { //NO ESTA ORDENADO POR CANT DE PRODUCTOS
    OrderService.getShopPendingOrdersByProducts(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar pedidos pendientes')
        }
        else if (result[0].length == 0 && result[1].length == 0) {
            return res.status(204).json('Local sin pedidos pendientes')
        }
        else {
            var newResult = []
            if (result[0].length > 0 && result[1].length > 0) {
                var joinArray = result[0].concat(result[1])
                newResult = joinArray.reduce((unique, o) => {
                    if (!unique.some(obj => obj.numero === o.numero)) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                newResult = newResult.map(obj0 => {
                    return result[1].map((obj1) => {
                        if (obj0.numero === obj1.numero && (result[0].filter(it => (it.numero === obj1.numero)).length > 0)) {
                            obj0.cantProductos = obj0.cantProductos + obj1.cantProductos
                        }
                        return obj0
                    })
                });
                /*newResult.sort(function(a, b){
                    return a.cantProductos - b.cantProductos
                })
                console.log('---------------------------------- ', newResult)*/
            }
            else if (result[0].length > 0)
                newResult = result[0]
            else
                newResult = result[1]
            var finalResult = []
            var long = newResult.length
            var iProd = 0
            var iProm = 0
            newResult.map(obj0 => {
                obj0.map(obj => {
                    obj.promociones = []
                    obj.productos = []
                    asyncPromosOrderByShop(obj.numero, 'pendiente', res, (r) => {
                        obj.promociones.push(r)
                        iProm++
                        asyncProductsForShop(obj.numero, res, (r) => {
                            obj.productos.push(r)
                            finalResult.push(obj)
                            iProd++
                            if (iProd == long)
                                return res.json(finalResult)
                        })
                    })
                })
            })
        }
    })
}

exports.insertClientOrder = (req, res) => {
    var unavailablePromos = []
    var unavailableProducts = []
    var unavailableIngredients = []
    ShopService.validateOpenShop(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar si el local esta abierto')
        }
        else if (result.length == 0)
            return res.status(401).json('Local cerrado')
        else {
            if (req.body.promociones != undefined) {
                validatePromoWithProductsAndIngredients(req.body.promociones, (error, rPromo, rProd, rIngr) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al validar promociones con productos e ingredientes en pedido')
                    }
                    if (rPromo.length > 0) {
                        unavailablePromos.push(rPromo)
                    }
                    if (rProd != null) {
                        rProd.map(obj => {
                            unavailableProducts.push(obj)
                        })
                    }
                    if (rIngr != null) {
                        rIngr.map(obj => {
                            unavailableIngredients.push(obj)
                        })
                    }
                    validateProductsAndIngredients(req.body.productos, unavailableProducts, unavailableIngredients, (error, rProd, rIngr) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).json('Error al validar productos e ingredientes en pedido')
                        }
                        else if (rProd != null && rIngr != null && unavailablePromos.length > 0) {
                            return res.status(401).json('Promociones con id=' + unavailablePromos + ' no disponibles\nProductos con id=' + rProd + ' no disponibles\nIngredientes con id=' + rIngr + ' no disponibles')
                        }
                        else if (rProd != null && rIngr != null && unavailablePromos.length == 0) {
                            return res.status(401).json('Productos con id=' + rProd + ' no disponibles\nIngredientes con id=' + rIngr + ' no disponibles')
                        }
                        else if (rProd != null && rIngr == null && unavailablePromos.length > 0) {
                            return res.status(401).json('Promociones con id=' + unavailablePromos + ' no disponibles\nProductos con id=' + rProd + ' no disponibles')
                        }
                        else if (rProd == null && rIngr != null && unavailablePromos.length > 0) {
                            return res.status(401).json('Promociones con id=' + unavailablePromos + ' no disponibles\nIngredientes con id=' + rIngr + ' no disponibles')
                        }
                        else if (rProd == null && rIngr == null && unavailablePromos.length > 0) {
                            return res.status(401).json('Promociones con id=' + unavailablePromos + ' no disponibles')
                        }
                        else if (rProd != null && rIngr == null && unavailablePromos.length == 0) {
                            return res.status(401).json('Productos con id=' + rProd + ' no disponibles')
                        }
                        else if (rProd == null && rIngr != null && unavailablePromos.length == 0) {
                            return res.status(401).json('Ingredientes con id=' + rIngr + ' no disponibles')
                        }
                        else {
                            OrderService.createClientOrder(req.body, (error, result) => {
                                if (error) {
                                    console.log(error)
                                    return res.status(500).json('Error al crear pedido')
                                }
                                else {
                                    var orderNumber = result.insertId
                                    var longPromo = req.body.promociones.length
                                    var iPromo = 0
                                    req.body.promociones.forEach(obj => {
                                        PromoService.createPromoForOrder(obj, orderNumber, (error, result) => {
                                            if (error) {
                                                console.log(error)
                                                return res.status(500).json('Error al guardar promociones en pedido')
                                            }
                                            else {
                                                var idPedPromo = result.insertId
                                                iPromo++
                                                obj.productos.map(obj => {
                                                    var idProd = obj.idProducto
                                                    obj.ingredientes.map(obj => {
                                                        IngredientService.createIngredientPromoForOrder(obj, idPedPromo, idProd, (error, result) => {
                                                            if (error) {
                                                                console.log(error)
                                                                return res.status(500).json('Error al guardar ingredientes en pedido promoción ingredientes')
                                                            }
                                                        })
                                                    })
                                                })
                                            }
                                        })
                                    })
                                    if (req.body.productos != undefined) {
                                        var longProd = req.body.productos.length
                                        var iProd = 0
                                        req.body.productos.forEach(obj => {
                                            var iIngr = 0
                                            var longIngr = obj.ingredientes.length
                                            ProductService.createProductForOrder(obj, orderNumber, (error, result) => {
                                                if (error) {
                                                    console.log(error)
                                                    return res.status(500).json('Error al guardar producto en pedido')
                                                }
                                                else {
                                                    if (longIngr > 0) {
                                                        var idPedidoProducto = result.insertId
                                                        var idProducto = obj.idProducto
                                                        obj.ingredientes.forEach(obj => {
                                                            IngredientService.createIngredientForOrder(obj, idPedidoProducto, idProducto, (error, result) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    return res.status(500).json('Error al guardar ingrediente en pedido')
                                                                }
                                                                else {
                                                                    iIngr++
                                                                    iProd++
                                                                    if (iIngr == longIngr && iProd == longProd && iPromo == longPromo) {
                                                                        OrderService.createPendingOrder(req.body.mail, req.body.cuit, orderNumber, (error, result) => {
                                                                            if (error) {
                                                                                console.log(error)
                                                                                return res.status(500).json('Error al crear pedido pendiente')
                                                                            }
                                                                            else {
                                                                                return res.json('Pedido creado')
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    }
                                                    else {
                                                        iProd++
                                                        if (iProd == longProd && iPromo == longPromo) {
                                                            OrderService.createPendingOrder(req.body.mail, req.body.cuit, orderNumber, (error, result) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    return res.status(500).json('Error al crear pedido pendiente')
                                                                }
                                                                else {
                                                                    return res.json('Pedido creado')
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            })
                                        })
                                    }
                                    else {
                                        OrderService.createPendingOrder(req.body.mail, req.body.cuit, orderNumber, (error, result) => {
                                            if (error) {
                                                console.log(error)
                                                return res.status(500).json('Error al crear pedido pendiente')
                                            }
                                            else {
                                                return res.json('Pedido creado')
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                })
            }
            else if (req.body.productos != null) {
                validateProductsAndIngredients(req.body.productos, unavailableProducts, unavailableIngredients, (error, rProd, rIngr) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al validar productos e ingredientes en pedido')
                    }
                    else if (rProd != null && rIngr != null) {
                        return res.status(401).json('Productos con id=' + rProd + ' no disponibles\nIngredientes con id=' + rIngr + ' no disponibles')
                    }
                    else if (rProd != null && rIngr == null) {
                        return res.status(401).json('Productos con id=' + rProd + ' no disponibles')
                    }
                    else if (rProd == null && rIngr != null) {
                        return res.status(401).json('Ingredientes con id=' + rIngr + ' no disponibles')
                    }
                    else {
                        OrderService.createClientOrder(req.body, (error, result) => {
                            if (error) {
                                console.log(error)
                                return res.status(500).json('Error al crear pedido')
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
                                            return res.status(500).json('Error al guardar producto en pedido')
                                        }
                                        else {
                                            if (longIngr > 0) {
                                                var idPedidoProducto = result.insertId
                                                var idProducto = obj.idProducto
                                                obj.ingredientes.forEach(obj => {
                                                    IngredientService.createIngredientForOrder(obj, idPedidoProducto, idProducto, (error, result) => {
                                                        if (error) {
                                                            console.log(error)
                                                            return res.status(500).json('Error al guardar ingrediente en pedido')
                                                        }
                                                        else {
                                                            iIngr++
                                                            iProd++
                                                            if (iIngr == longIngr && iProd == longProd) {
                                                                OrderService.createPendingOrder(req.body.mail, req.body.cuit, orderNumber, (error, result) => {
                                                                    if (error) {
                                                                        console.log(error)
                                                                        return res.status(500).json('Error al crear pedido pendiente')
                                                                    }
                                                                    else {
                                                                        return res.json('Pedido creado')
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
                                                            return res.status(500).json('Error al crear pedido pendiente')
                                                        }
                                                        else {
                                                            return res.json('Pedido creado')
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
            else
                return res.status(401).json('El pedido debe tener promociones o productos seleccionados')
        }
    })
}

function asyncProductsForClient(num, res, callback) {
    ProductService.getProductsOrder(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos en pedido')
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

function asyncPromosOrderByShop(num, stage, res, callback) {
    PromoService.getOrderPromos(num, stage, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar promociones en pedido')
        }
        else if (result.length > 0) {
            var i = 0
            var prom = JSON.parse(JSON.stringify(result))
            var resProm = []
            resProm = prom.map(it => {
                it.productos = []
                asyncProductsPromo(it.id, res, (r) => {
                    it.productos.push(r)
                    i++
                    if (i == prom.length)
                        callback(resProm)
                })
                return it
            })
        }
        else
            callback(null)
    })
}

function asyncProductsPromo(num, res, callback) {
    PromoService.getProductsPromo(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos en pedido promocion')
        }
        else if (result.length > 0) {
            var i = 0
            var prod = JSON.parse(JSON.stringify(result))
            var resProd = []
            resProd = prod.map(it => {
                it.ingredientes = []
                asyncIngredientsOrderProductPromo(it.id, res, (r) => {
                    //console.log(r)
                    it.ingredientes.push(r)
                    i++
                    if (i == prod.length)
                        callback(resProd)
                })
                return it
            })
        }
        else
            callback(null)
    })
}

function asyncProductsForShop(num, res, callback) {
    ProductService.getProductsOrder(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos en pedido')
        }
        else if (result.length > 0) {
            var i = 0
            var prod = JSON.parse(JSON.stringify(result))
            var resProd = []
            resProd = prod.map(it => {
                it.ingredientes = []
                asyncIngredientsOrderProduct(it.idPP, res, (r) => {
                    it.ingredientes.push(r)
                    i++
                    if (i == prod.length)
                        callback(resProd)
                })
                return it
            })
        }
        else
            callback(null)
    })
}

function asyncIngredientsOrderProduct(num, res, callback) {
    IngredientService.getIngredientsOrder(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar ingredientes en pedido')
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
            callback(null)
    })
}

function asyncIngredientsOrderProductPromo(num, res, callback) {
    IngredientService.getIngredientsByProductPromoInGetOrder(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar ingredientes en pedido')
        }
        else if (result.length > 0) {
            console.log(result)
            var ingr = JSON.parse(JSON.stringify(result))
            var resIngr = []
            resIngr = ingr.map(it => {
                return it
            })
            callback(resIngr)
        } else
            callback(null)
    })
}

function validateProductsAndIngredients(list, unavailableProducts, unavailableIngredients, callback) {
    var products = unavailableProducts
    var ingredients = unavailableIngredients
    if (list != undefined) {
        list.forEach(obj => {
            products.push(obj.idProducto)
            obj.ingredientes.forEach(obj => {
                ingredients.push(obj.idIngrediente)
            })
        })
    }
    if (products.length > 0) {
        ProductService.validateProductsAndIngredients(products, ingredients, (error, result) => {
            if (error) {
                callback(error)
            }
            else if (result.length == 0) {
                callback(null, null, null)
            }
            else if (result.length > 0 && result[1] == undefined) {
                var rP = []
                result.map(obj => {
                    rP.push(obj.id)
                })
                callback(null, rP, null)
            }
            else if (result[0].length == 0 && result[1].length == 0) {
                callback(null, null, null)
            }
            else if (result[0].length == 0 && result[1].length > 0) {
                var rI = []
                result[1].map(obj => {
                    rI.push(obj.id)
                })
                callback(null, null, result[1])
            }
            else if (result[0].length > 0 && result[1].length == 0) {
                var rP = []
                result[0].map(obj => {
                    rP.push(obj.id)
                })
                callback(null, rP, null)
            }
            else {
                var rP = []
                result[0].map(obj => {
                    rP.push(obj.id)
                })
                var rI = []
                result[1].map(obj => {
                    rI.push(obj.id)
                })
                callback(null, rP, rI)
            }
        })
    } else
        callback(null, null, null)
}

function validatePromoWithProductsAndIngredients(list, callback) {
    var promos = []
    var unavailablePromos = []
    var promoProducts = []
    var promoIngredients = []
    list.forEach(obj => {
        promos.push(obj.idPromo)
    })
    PromoService.validatePromos(promos, (error, result) => {
        if (error) {
            console.log(error)
            callback(error)
        }
        else if (result.length > 0) {
            result.map(obj => {
                unavailablePromos.push(obj.id)
                const index = promos.indexOf(obj.id);
                promos.splice(index, 1)
            })
        }
        if (promos.length > 0) { //TODO ESTA DISPONIBLE
            PromoService.getProductsPromos(promos, (error, result) => {
                if (error) {
                    console.log(error)
                    callback(error)
                }
                else if (result.length > 0) {
                    result.map(obj => {
                        promoProducts.push(obj.id)
                    })
                    var i = 0
                    var long = promoProducts.length
                    promoProducts.map(obj => {
                        IngredientService.getIngredientsByProductPromoInMakeOrder(obj, (error, result) => {
                            i++
                            if (error) {
                                console.log(error)
                                callback(error)
                            }
                            else if (result.length > 0) {
                                result.map(obj => {
                                    promoIngredients.push(obj.id)
                                })
                            }
                            if (i == long) {
                                callback(null, unavailablePromos, promoProducts, promoIngredients)
                            }
                        })
                    })
                }
            })
        }
        else
            callback(null, unavailablePromos, promoProducts, promoIngredients)
    })
}