const ShopService = require('../service/shopService');
const PromoService = require('../service/promoService');
const OrderService = require('../service/orderService');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

exports.insertShop = (req, res) => {
    ShopService.createShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al guardar local')
        }
        else if (result.length > 1)
            return res.status(401).send('Mail existente')
        else {
            /*let token = jwt.sign({
                id: result.insertId
            }, process.env.SECRET || 'token-secret', {
                expiresIn: 86400 // expires in 24 hours
            });
            let sendJson = {
                token: token,
                mail: req.body.mail,
            }*/
            return res.json('Local guardado')
        }
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
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.horarios = []
                asyncSchedule(obj.cuit, res, (r) => {
                    obj.horarios.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
    })
}

exports.setShopAsFavourite = (req, res) => {
    ShopService.createShopAsFavourite(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al guardar local como favorito')
        }
        else if (result.affectedRows == 0)
            return res.status(401).send('El local ya es favorito')
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
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.horarios = []
                asyncSchedule(obj.cuit, res, (r) => {
                    obj.horarios.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
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
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.horarios = []
                asyncSchedule(obj.cuit, res, (r) => {
                    obj.horarios.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
    })
}

exports.getShopsByPromos = (req, res) => {
    PromoService.getShopWithPromos((error, result) => {
        console.log(result)
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
                                            var finalResult = []
                                            var long = result.length;
                                            var i = 0;
                                            result.map(obj => {
                                                obj.horarios = []
                                                asyncSchedule(obj.cuit, res, (r) => {
                                                    obj.horarios.push(r)
                                                    finalResult.push(obj)
                                                    i++
                                                    if (i == long)
                                                        return res.json(finalResult)
                                                })
                                            })
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
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.horarios = []
                asyncSchedule(obj.cuit, res, (r) => {
                    obj.horarios.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
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
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.horarios = []
                asyncSchedule(obj.cuit, res, (r) => {
                    obj.horarios.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
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

exports.insertShopSchedule = (req, res) => {
    var i = 0
    req.body.map(obj => {
        ShopService.createShopShedule(obj, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).send('Error al crear horarios del local')
            }
            else if (result.affectedRows == 0) {
                return res.status(404).send('Local no encontrado')
            }
            else {
                i++
                if (i == req.body.length)
                    return res.send('Horarios del local creados')
            }
        })
    })
}

exports.setShopSchedule = (req, res) => {
    var i = 0
    req.body.map(obj => {
        ShopService.deleteShopSchedule(obj.cuit, obj.diaSemana, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).send('Error al eliminar horarios del local')
            }
        })
    })
    req.body.map(obj => {
        ShopService.createShopShedule(obj, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).send('Error al actualizar horarios del local')
            }
            else {
                i++
                if (i == req.body.length)
                    return res.send('Horarios del local actualizados')
            }
        })
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
        else {
            var hoursResult = [{ hora: 00, cantidad: 0 }, { hora: 01, cantidad: 0 }, { hora: 02, cantidad: 0 }, { hora: 03, cantidad: 0 }, { hora: 04, cantidad: 0 },
            { hora: 05, cantidad: 0 }, { hora: 06, cantidad: 0 }, { hora: 07, cantidad: 0 }, { hora: 08, cantidad: 0 }, { hora: 09, cantidad: 0 }, { hora: 10, cantidad: 0 },
            { hora: 11, cantidad: 0 }, { hora: 12, cantidad: 0 }, { hora: 13, cantidad: 0 }, { hora: 14, cantidad: 0 }, { hora: 15, cantidad: 0 }, { hora: 16, cantidad: 0 },
            { hora: 17, cantidad: 0 }, { hora: 18, cantidad: 0 }, { hora: 19, cantidad: 0 }, { hora: 20, cantidad: 0 }, { hora: 21, cantidad: 0 }, { hora: 22, cantidad: 0 },
            { hora: 23, cantidad: 0 }]
            result.map(obj => {
                hoursResult[obj.hora].cantidad = obj.cantidad
            })
            return res.json(hoursResult)
        }
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
        else {
            var months = [{ mes: 'Enero', nroMes: 1, cantidad: 0 }, { mes: 'Febrero', nroMes: 2, cantidad: 0 }, { mes: 'Marzo', nroMes: 3, cantidad: 0 },
            { mes: 'Abril', nroMes: 4, cantidad: 0 }, { mes: 'Mayo', nroMes: 5, cantidad: 0 }, { mes: 'Junio', nroMes: 6, cantidad: 0 },
            { mes: 'Julio', nroMes: 7, cantidad: 0 }, { mes: 'Agosto', nroMes: 8, cantidad: 0 }, { mes: 'Septiembre', nroMes: 9, cantidad: 0 },
            { mes: 'Octubre', nroMes: 10, cantidad: 0 }, { mes: 'Noviembre', nroMes: 11, cantidad: 0 }, { mes: 'Diciembre', nroMes: 12, cantidad: 0 }]
            var actualMonth = new Date().getMonth() + 1
            var monthsResult = []
            if (actualMonth < 6) { //INTERVALO DE 6 MESES 
                var rest = -(actualMonth - 6)
                var m = 12 - rest;
                for (i = 0; i < rest; i++) {
                    monthsResult.push(months[m])
                    m++
                }
                for (i = 0; i < 6 - rest; i++) {
                    monthsResult.push(months[i])
                }
            }
            else {
                for (i = actualMonth - 6; i < actualMonth; i++) {
                    monthsResult.push(months[i])
                }
            }
            result.map(obj => {
                for (i = 0; i < 6; i++) {
                    if (monthsResult[i].nroMes == obj.mes)
                        monthsResult[i].cantidad = obj.cantidad
                }
            })
            return res.json(monthsResult)
        }
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

function asyncSchedule(cuit, res, callback) {
    ShopService.getShopShedule(cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar horarios del local')
        }
        else if (result.length > 0) {
            var times = JSON.parse(JSON.stringify(result))
            var resTimes = []
            resTimes = times.map(it => {
                return it
            })
            callback(resTimes)
        } else
            callback()
    })
}