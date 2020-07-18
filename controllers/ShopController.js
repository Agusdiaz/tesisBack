const ShopService = require('../service/shopService');
const PromoService = require('../service/promoService');
const OrderService = require('../service/orderService')

exports.insertShop = (req, res) => {
    ShopService.createShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al guardar local')
        }
        else
            return res.send('Local guardado')
    })
}

exports.getClientFavourites = (req, res) => {
    ShopService.getFavourites(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar favoritos')
        }
        else if (result.length == 0) {
            return res.status(204).send('Cliente sin favoritos')
        }
        else
            return res.json(result)
    })
}

exports.setShopAsFavourite = (req, res) => {
    ShopService.createShopAsFavourite(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al guardar local como favorito')
        }
        else
            return res.send('Local guardado como favorito')
    })
}

exports.deleteShopAsFavourite = (req, res) => {
    ShopService.deleteShopAsFavourite(req.body, (error, result) => {
        console.log(result)
        if (error) {
            console.log(error)
            return res.status(500).send('Error al eliminar local como favorito')
        }
        else if (result.affectedRows == 0) {
            return res.status(204).send('Cliente no tiene local como favorito')
        }
        else
            return res.send('Local eliminado como favorito')
    })
}

exports.getAllShopsOpenClose = (req, res) => {
    ShopService.getAllShopsOpenClose((error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar todos los locales')
        }
        else if (result.length == 0) {
            return res.status(204).send('No hay locales')
        }
        else
            return res.json(result)
    })
}

exports.getAllShopsAZ = (req, res) => {
    ShopService.getAllShopsAZ((error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar todos los locales')
        }
        else if (result.length == 0) {
            return res.status(204).send('No hay locales')
        }
        else
            return res.json(result)
    })
}

exports.getShopsByPromos = (req, res) => {
    PromoService.getShopWithPromos((error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar local por promoción')
        }
        else if (result.length == 0) {
            return res.status(204).send('No existen locales con promociones')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0
            result.map(obj => {
                obj.disponible = []
                asyncValidateProductsPromo(obj.id, res, (r) => {
                    obj.disponible.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long) {
                        long = finalResult.length
                        i = 0
                        var finalRta = []
                        finalResult.map(obj => {
                            i++
                            if (obj.disponible[0])
                                finalRta.push(obj)
                            if (i == long) {
                                if (finalRta.length == 0) {
                                    return res.status(204).send('No existen locales con promociones')
                                }
                                else {
                                    var arrLocales = []
                                    finalRta.map(obj => {
                                        if (!arrLocales.includes(obj.local))
                                            arrLocales.push(obj.local)
                                    })
                                    ShopService.getShopsByCUIT(arrLocales, (error, result) => {
                                        if (error) {
                                            console.log(error)
                                            return res.status(500).send('Error al buscar locales por CUIT')
                                        }
                                        else if (result.length == 0) {
                                            return res.status(204).send('No existen locales con esos CUIT')
                                        }
                                        else {
                                            return res.json(result)
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            })
        }
    })
}

exports.getShopByName = (req, res) => {
    ShopService.getShopByName(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar local por nombre')
        }
        else if (result.length == 0) {
            return res.status(204).send('No existen locales con ese nombre')
        }
        else
            return res.json(result)
    })
}

exports.getShopByAddress = (req, res) => {
    ShopService.getShopByAddress(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar local por dirección')
        }
        else if (result.length == 0) {
            return res.status(204).send('No existen locales con esa dirección')
        }
        else
            return res.json(result)
    })
}

exports.setShopFeatures = (req, res) => {
    ShopService.updateShopFeatures(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al actualizar local')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Local no encontrado')
        }
        else
            return res.send('Local actualizado')
    })
}

exports.setShopDelay = (req, res) => {
    ShopService.updateDelayShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al actualizar demora del local')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Local no encontrado')
        }
        else
            return res.send('Demora del local actualizada')
    })
}

exports.getTopRequestedProductsByShop = (req, res) => {
    OrderService.getTopRequestedProducts(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar productos más pedidos del local')
        }
        else if (result.length == 0) {
            return res.status(204).send('No hay pedidos realizados')
        }
        else
            return res.json(result)
    })
}

exports.getTopRequestedHoursByShop = (req, res) => {
    OrderService.getOrdersTopHours(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar horarios con más pedidos del local')
        }
        else if (result.length == 0) {
            return res.status(204).send('No hay pedidos realizados')
        }
        else
            return res.json(result)
    })
}

exports.getLast6MonthOrdersByShop = (req, res) => {
    OrderService.getLast6MonthOrdersAmount(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar pedidos de los últimos 6 meses del local')
        }
        else if (result.length == 0) {
            return res.status(204).send('No hay pedidos realizados')
        }
        else
            return res.json(result)
    })
}

function asyncValidateProductsPromo(id, res, callback) {
    PromoService.getProductsPromo(id, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar productos en promoción')
        }
        else if (result.length > 0) {
            var i = 0
            var prod = JSON.parse(JSON.stringify(result))
            var dispo = true
            prod.map(it => {
                if (it.disponible == 0) {
                    dispo = false
                }
                i++
                if (i == prod.length && dispo)
                    callback(true)
                else if (i == prod.length && !dispo)
                    callback(false)
                return it
            })
        } else
            callback()
    })
}