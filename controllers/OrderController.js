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
        /*   /* else if (result.affectedRows == 0) {
              return res.status(404).json('Pedido no encontrado')
          } */
        else {
            if (result.affectedRows !== 0) {
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
        }
    })
}

exports.setOrderReadyByShop = (req, res) => {
    OrderService.deleteOrderPendingByShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al eliminar local de pedido pendiente')
        }
        /*  else if (result.affectedRows == 0) {
             return res.status(404).json('Pedido no encontrado')
         } */
        else {
            if (result.affectedRows !== 0) {
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
            return res.status(500).json('Error al buscar pedidos entregados')
        }
        else if (result.length == 0) {
            return res.status(204).json('Local sin pedidos entregados')
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

exports.getShopPendingOrdersByProducts = (req, res) => {
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
            }
            else if (result[0].length > 0)
                newResult = result[0]
            else
                newResult = result[1]
            var finalResult = []
            var long = newResult.length
            var iProd = 0
            var iProm = 0
            newResult.map(obj => {
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
            return res.status(405).json('Local cerrado')
        else {
            if (req.body.promociones.length > 0) {
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
                            return res.status(401).json({ promociones: unavailablePromos[0], productos: rProd, ingredientes: rIngr })
                        }
                        else if (rProd != null && rIngr != null && unavailablePromos.length == 0) {
                            return res.status(401).json({ productos: rProd, ingredientes: rIngr })
                        }
                        else if (rProd != null && rIngr == null && unavailablePromos.length > 0) {
                            return res.status(401).json({ promociones: unavailablePromos[0], productos: rProd })
                        }
                        else if (rProd == null && rIngr != null && unavailablePromos.length > 0) {
                            return res.status(401).json({ promociones: unavailablePromos[0], ingredientes: rIngr })
                        }
                        else if (rProd == null && rIngr == null && unavailablePromos.length > 0) {
                            return res.status(401).json({ promociones: unavailablePromos[0] })
                        }
                        else if (rProd != null && rIngr == null && unavailablePromos.length == 0) {
                            return res.status(401).json({ productos: rProd })
                        }
                        else if (rProd == null && rIngr != null && unavailablePromos.length == 0) {
                            return res.status(401).json({ ingredientes: rIngr })
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
                                    if (req.body.productos.length > 0) {
                                        var longProd = req.body.productos.length
                                        var iProd = 0
                                        req.body.productos.forEach(obj => {
                                            ProductService.createProductForOrder(obj, orderNumber, (error, result) => {
                                                if (error) {
                                                    console.log(error)
                                                    return res.status(500).json('Error al guardar producto en pedido')
                                                }
                                                else {
                                                    if (obj.ingredientes.length > 0) {
                                                        var idPedidoProducto = result.insertId
                                                        var idProducto = obj.idProducto
                                                        obj.ingredientes.forEach(obj => {
                                                            IngredientService.createIngredientForOrder(obj, idPedidoProducto, idProducto, (error, result) => {
                                                                if (error) {
                                                                    console.log(error)
                                                                    return res.status(500).json('Error al guardar ingrediente en pedido')
                                                                }
                                                            })
                                                        })
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
            else if (req.body.productos.length > 0) {
                validateProductsAndIngredients(req.body.productos, unavailableProducts, unavailableIngredients, (error, rProd, rIngr) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al validar productos e ingredientes en pedido')
                    }
                    else if (rProd != null && rIngr != null) {
                        return res.status(401).json({ productos: rProd, ingredientes: rIngr })
                    }
                    else if (rProd != null && rIngr == null) {
                        return res.status(401).json({ productos: rProd })
                    }
                    else if (rProd == null && rIngr != null) {
                        return res.status(401).json({ ingredientes: rIngr })
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
                                    ProductService.createProductForOrder(obj, orderNumber, (error, result) => {
                                        if (error) {
                                            console.log(error)
                                            return res.status(500).json('Error al guardar producto en pedido')
                                        }
                                        else {
                                            if (obj.ingredientes.length > 0) {
                                                var idPedidoProducto = result.insertId
                                                var idProducto = obj.idProducto
                                                obj.ingredientes.forEach(obj => {
                                                    IngredientService.createIngredientForOrder(obj, idPedidoProducto, idProducto, (error, result) => {
                                                        if (error) {
                                                            console.log(error)
                                                            return res.status(500).json('Error al guardar ingrediente en pedido')
                                                        }
                                                    })
                                                })
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
                asyncProductsPromo(it.id, it.idPP, res, (r) => {
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

function asyncProductsPromo(num, idPP, res, callback) {
    PromoService.getOrderProductsPromo(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos en pedido promoción')
        }
        else if (result.length > 0) {
            var i = 0
            var prod = JSON.parse(JSON.stringify(result))
            var resProd = []
            resProd = prod.map(it => {
                it.ingredientes = []
                asyncIngredientsOrderProductPromo(it.id, idPP, res, (r) => {
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

function asyncIngredientsOrderProductPromo(num, idPP, res, callback) {
    IngredientService.getIngredientsByProductPromoInGetOrder(num, idPP, (error, result) => {
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
                callback(null, null, rI)
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
        promos.push(obj)
    })
    PromoService.validatePromos(promos, (error, result) => {
        if (error) {
            console.log(error)
            callback(error)
        }
        else if (result.length > 0) {
            result.map(obj => {
                unavailablePromos.push(obj.id)
                promos = promos.filter(p => p.idPromo !== obj.id)
            })
        }
        if (promos.length > 0) {
            promos.forEach(promo => {
                promo.productos.forEach(prod => {
                    promoProducts.push(prod.idProducto)
                    prod.ingredientes.forEach(ing => {
                        promoIngredients.push(ing.idIngrediente)
                    })
                })
            })
            callback(null, unavailablePromos, promoProducts, promoIngredients)
        }
        else
            callback(null, unavailablePromos, promoProducts, promoIngredients)
    })
}