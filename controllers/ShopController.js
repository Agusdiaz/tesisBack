const ShopService = require('../service/shopService');
const PromoService = require('../service/promoService');
const OrderService = require('../service/orderService');
const EventController = require('./EventController');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const cons = require('consolidate');

exports.insertShop = (req, res) => {
    ShopService.createShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al guardar local')
        }
        else if (result.length > 1)
            return res.status(401).json('Mail existente')
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
            return res.status(500).json('Error al buscar favoritos')
        }
        else if (result.length == 0) {
            return res.status(204).json('Cliente sin favoritos')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.horarios = []
                obj.favorito = true
                this.asyncSchedule(obj.cuit, res, (r) => {
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
            return res.status(500).json('Error al guardar local como favorito')
        }
        else if (result.affectedRows == 0)
            return res.status(401).json('El local ya es favorito')
        else
            return res.json('Local guardado como favorito')
    })
}

exports.deleteShopAsFavourite = (req, res) => {
    ShopService.deleteShopAsFavourite(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al eliminar local como favorito')
        }
        else if (result.affectedRows == 0) {
            return res.status(204).json('Cliente no tiene local como favorito')
        }
        else
            return res.json('Local eliminado como favorito')
    })
}

exports.getAllShopsOpenClose = (req, res) => {
    ShopService.getAllShopsOpenClose((error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar todos los locales')
        }
        else if (result.length == 0) {
            return res.status(204).json('No hay locales')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                asyncIsFavourite(req.body.mail, obj.cuit, res, (r) => {
                    obj.favorito = r
                })
                obj.horarios = []
                this.asyncSchedule(obj.cuit, res, (r) => {
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
            return res.status(500).json('Error al buscar todos los locales')
        }
        else if (result.length == 0) {
            return res.status(204).json('No hay locales')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                asyncIsFavourite(req.body.mail, obj.cuit, res, (r) => {
                    obj.favorito = r
                })
                obj.horarios = []
                this.asyncSchedule(obj.cuit, res, (r) => {
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

exports.getAllOpenShops = (req, res) => {
    ShopService.getOnlyOpenShops((error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar todos los locales abiertos')
        }
        else if (result.length == 0) {
            return res.status(204).json('No hay locales abiertos')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                asyncIsFavourite(req.body.mail, obj.cuit, res, (r) => {
                    obj.favorito = r
                })
                obj.horarios = []
                this.asyncSchedule(obj.cuit, res, (r) => {
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
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar local por promoción')
        }
        else if (result.length == 0) {
            return res.status(204).json('No existen locales con promociones')
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
                                    return res.status(204).json('No existen locales con promociones')
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
                                            return res.status(500).json('Error al buscar locales por CUIT')
                                        }
                                        else if (result.length == 0) {
                                            return res.status(204).json('No existen locales con esos CUIT')
                                        }
                                        else {
                                            var finalResult = []
                                            var long = result.length;
                                            var i = 0;
                                            result.map(obj => {
                                                asyncIsFavourite(req.body.mail, obj.cuit, res, (r) => {
                                                    obj.favorito = r
                                                })
                                                obj.horarios = []
                                                this.asyncSchedule(obj.cuit, res, (r) => {
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
            return res.status(500).json('Error al buscar local por nombre')
        }
        else if (result.length == 0) {
            return res.status(204).json('No existen locales con ese nombre')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                asyncIsFavourite(req.body.mail, obj.cuit, res, (r) => {
                    obj.favorito = r
                })
                obj.horarios = []
                this.asyncSchedule(obj.cuit, res, (r) => {
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
            return res.status(500).json('Error al buscar local por dirección')
        }
        else if (result.length == 0) {
            return res.status(204).json('No existen locales con esa dirección')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                asyncIsFavourite(req.body.mail, obj.cuit, res, (r) => {
                    obj.favorito = r
                })
                obj.horarios = []
                this.asyncSchedule(obj.cuit, res, (r) => {
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
            return res.status(500).json('Error al actualizar características')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Local no encontrado')
        }
        else
            return res.json('Características actualizadas')
    })
}

exports.setShopDelay = (req, res) => {
    ShopService.updateDelayShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al actualizar demora del local')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Local no encontrado')
        }
        else
            return res.json('Demora del local actualizada')
    })
}

exports.insertShopSchedule = (req, res) => {
    var i = 0
    req.body.map(obj => {
        ShopService.createShopShedule(obj, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Error al crear horarios del local')
            }
            else if (result.affectedRows == 0) {
                return res.status(404).json('Local no encontrado')
            }
            else {
                i++
                if (i == req.body.length)
                    return res.json('Horarios del local creados')
            }
        })
    })
}

exports.deleteShopSchedule = (req, res) => {
    ShopService.deleteShopSchedule(req.body.cuit, req.body.diaSemana, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al eliminar horarios del local')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Local no encontrado')
        }
        else {
            return res.json('Horarios del local eliminados')
        }
    })
}

exports.setShopSchedule = (req, res) => {
    ShopService.deleteShopSchedule(req.body.cuit, req.body.diaSemana, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al eliminar horarios del local')
        }
    })
    var i = 0
    var long = req.body.horas.length
    if (long > 0) {
        req.body.horas.map(obj => {
            ShopService.createShopShedule(req.body.cuit, req.body.diaSemana, obj, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json('Error al actualizar horarios del local')
                }
                else {
                    i++
                    if (i === long) {
                        EventController.checkAllShopsSchedules()
                        return res.json('Horarios del local actualizados')
                    }
                }
            })
        })
    } else {
        EventController.checkAllShopsSchedules()
        return res.json('Horarios del local actualizados')
    }
}

exports.validateSoonClosingShop = (req, res) => {
    ShopService.validate10MinShopSchedule(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar cierre del local')
        } else {
            var i = 0
            var rta = false
            var today = new Date();
            var actualDay = new Date().getDay() + 1
            result.map(obj => {
                    i++
                    var date = (obj.diaSemana === actualDay && obj.horaExtendida === 0) ? new Date() : (obj.diaSemana === actualDay) ? 
                    new Date(new Date().setDate(new Date().getDate() + 1)) : new Date(new Date().setDate(new Date().getDate() - 1))
                    date.setHours(obj.horaCierra.substring(0, 2))
                    date.setMinutes(obj.horaCierra.substring(3, 5))
                    date.setSeconds('00')
                    var diff = date - today
                    var minutes = Math.floor((diff / 1000) / 60);
                    if(minutes <= 10 && minutes >= 0) rta = true
                    if(i === result.length) return res.json(rta)
            })
        }
    })
}

exports.getTop10RequestedProductsByShop = (req, res) => {
    OrderService.getTopRequestedProducts(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos más pedidos del local')
        }
        else if (result.length == 0) {
            return res.status(204).json('No hay pedidos realizados')
        }
        else
            return res.json(result)
    })
}

exports.getTopRequestedHoursByShop = (req, res) => {
    OrderService.getOrdersTopHours(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar horarios con más pedidos del local')
        }
        else if (result.length == 0) {
            return res.status(204).json('No hay pedidos realizados')
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
            var cant = []
            hoursResult.map(it => cant.push(it.cantidad))
            return res.json(cant)
        }
    })
}

exports.getLast6MonthOrdersByShop = (req, res) => {
    OrderService.getLast6MonthOrdersAmount(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar pedidos de los últimos 6 meses del local')
        }
        else if (result.length == 0) {
            return res.status(204).json('No hay pedidos realizados')
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
            var cant = []
            monthsResult.map(it => cant.push(it.cantidad))
            return res.json(cant)
        }
    })
}

function asyncValidateProductsPromo(id, res, callback) {
    PromoService.getProductsPromo(id, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos en promoción')
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

exports.asyncSchedule = (cuit, res, callback) => {
    var days = [{ id: 1, dia: 'Domingo', horas: '' }, { id: 2, dia: 'Lunes', horas: '' }, { id: 3, dia: 'Martes', horas: '' },
    { id: 4, dia: 'Miércoles', horas: '' }, { id: 5, dia: 'Jueves', horas: '' }, { id: 6, dia: 'Viernes', horas: '' },
    { id: 7, dia: 'Sábado', horas: '' }]
    ShopService.getShopShedule(cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar horarios del local')
        }
        else if (result.length > 0) {
            var times = JSON.parse(JSON.stringify(result))
            var resTimes = days.filter(item => {
                return times.map(item2 => {
                    if (item.id === item2.diaSemana) {
                        item.horas += item2.horaAbre.substring(0, 5) + ' - ' + item2.horaCierra.substring(0, 5) + '\n'
                    }
                    return item
                })
            });
            callback(resTimes)
        } else
            callback(days)
    })
}

function asyncIsFavourite(cliente, shop, res, callback) {
    ShopService.checkIfShopIsFavourite(cliente, shop, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al chequear si local es favorito')
        }
        else if (result.length > 0)
            callback(true)
        else
            callback(false)
    })
}

exports.updateNewField = (req, res) => {
    ShopService.updateNewShop(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al actualizar campo nuevo')
        } else {
            return res.status(200).json('Campo nuevo actualizado')
        }
    })
}

/*exports.isOpenShop = (req, res) => {
    ShopService.validateOpenShop(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar cierre del local')
        } else {
            return res.json((result[0].abierto === 0) ? false : true)
        }
    })
}*/