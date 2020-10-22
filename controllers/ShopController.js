const ShopService = require('../service/shopService');
const PromoService = require('../service/promoService');
const OrderService = require('../service/orderService');
const EventController = require('./EventController');
const fetch = require('node-fetch');

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
            }, process.env.REACT_APP_SECRET || 'token-secret', {
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
                obj.demora = (obj.demora <= 20) ? 'POCA' : (obj.demora > 20 && obj.demora <= 40) ? 'MEDIA' : 'ALTA'
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
                obj.demora = (obj.demora <= 20) ? 'POCA' : (obj.demora > 20 && obj.demora <= 40) ? 'MEDIA' : 'ALTA'
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
                obj.demora = (obj.demora <= 20) ? 'POCA' : (obj.demora > 20 && obj.demora <= 40) ? 'MEDIA' : 'ALTA'
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
                                                obj.demora = (obj.demora <= 20) ? 'POCA' : (obj.demora > 20 && obj.demora <= 40) ? 'MEDIA' : 'ALTA'
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
                obj.demora = (obj.demora <= 20) ? 'POCA' : (obj.demora > 20 && obj.demora <= 40) ? 'MEDIA' : 'ALTA'
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
                obj.demora = (obj.demora <= 20) ? 'POCA' : (obj.demora > 20 && obj.demora <= 40) ? 'MEDIA' : 'ALTA'
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

exports.calculateDelay = (cuit, delay) => {
    var date = new Date()
    var today = date.getDay();
    var initialHour = date.getHours()
    var endHour = initialHour + 1
    var totalDelay = 0
    if (today === 0) today = 6
    else today--
    ShopService.getDelay(cuit, today, initialHour, endHour, (error, result) => { //2, 00, 23
        if (error) {
            console.log(error)
            return res.status(500).json('Error al calcular demora del local')
        } if (result.length === 0) {
            if (delay !== totalDelay) setShopDelay(cuit, 0)
        } else {
            var cant = 0
            var cantNull = 0
            var areOrders = false
            result.map(obj => {
                if (date.getFullYear() === obj.fecha.getFullYear() && date.getMonth() === obj.fecha.getMonth() && date.getDate() === obj.fecha.getDate())
                    areOrders = true
                if (obj.dif !== null) {
                    totalDelay += obj.dif
                    cant++
                } else cantNull++
            })
            if (cant > 0) {
                totalDelay = totalDelay / cant
                if (cantNull > 0) {
                    totalDelay += totalDelay * cantNull
                    totalDelay = totalDelay / (cant + cantNull)
                }
            }
            if (!areOrders && cantNull === 0) totalDelay = 0
            else if (areOrders && cantNull > 0 && totalDelay === 0) {
                if (cantNull > 7) totalDelay = 41
                else if (cantNull < 4) totalDelay = 19
                else totalDelay = 30
            }
            if (delay !== totalDelay) setShopDelay(cuit, totalDelay)
        }
    })
}

function setShopDelay(cuit, delay) {
    ShopService.updateDelayShop(cuit, delay, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al actualizar demora del local')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Local no encontrado')
        }
        else {
            console.log('Se actualizó el local cuit=' + cuit + ' a demora=' + delay)
            //return res.json('Demora del local actualizada')
        }
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
                if (minutes <= 10 && minutes >= 0) rta = true
                if (i === result.length) return res.json(rta)
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
        else {
            var newResult = []
            if (result[0].length > 0 && result[1].length > 0) {
                var joinArray = result[0].concat(result[1])
                newResult = joinArray.reduce((unique, o) => {
                    if (!unique.some(obj => obj.nombre === o.nombre)) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                newResult.map(obj => {
                    const found = result[1].find(element => element.nombre === obj.nombre)
                    if (found !== undefined && !obj.promo)
                        obj.cantidad += found.cantidad
                })
                newResult.sort((a, b) => { return b.cantidad - a.cantidad })
                newResult = newResult.slice(0, 10)
            }
            else if (result[0].length > 0) newResult = result[0]
            else newResult = result[1]
            return res.json(newResult)
        }
    })
}

exports.getTopRequestedHoursByShop = (req, res) => {
    var hoursResult = [{ hora: 00, cantidad: 0 }, { hora: 01, cantidad: 0 }, { hora: 02, cantidad: 0 }, { hora: 03, cantidad: 0 }, { hora: 04, cantidad: 0 },
    { hora: 05, cantidad: 0 }, { hora: 06, cantidad: 0 }, { hora: 07, cantidad: 0 }, { hora: 08, cantidad: 0 }, { hora: 09, cantidad: 0 }, { hora: 10, cantidad: 0 },
    { hora: 11, cantidad: 0 }, { hora: 12, cantidad: 0 }, { hora: 13, cantidad: 0 }, { hora: 14, cantidad: 0 }, { hora: 15, cantidad: 0 }, { hora: 16, cantidad: 0 },
    { hora: 17, cantidad: 0 }, { hora: 18, cantidad: 0 }, { hora: 19, cantidad: 0 }, { hora: 20, cantidad: 0 }, { hora: 21, cantidad: 0 }, { hora: 22, cantidad: 0 },
    { hora: 23, cantidad: 0 }]
    var hoursDay = [{ id: 0, dia: 'Lunes' }, { id: 1, dia: 'Martes' }, { id: 2, dia: 'Miércoles' }, { id: 3, dia: 'Jueves' }, { id: 4, dia: 'Viernes' },
    { id: 5, dia: 'Sábado' }, { id: 6, dia: 'Domingo' }]
    var i = 0
    hoursDay.map(obj => {
        OrderService.getOrdersTopHours(req.body, obj.id, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Error al buscar horarios con más pedidos del local')
            } else {
                obj.horas = []
                var aux = JSON.parse(JSON.stringify(hoursResult))
                result.map(obj => {
                    aux[obj.hora].cantidad = obj.cantidad
                })
                obj.horas.push(aux)
                i++
                if (i === 7) return res.json(hoursDay)
            }
        })
    })
}

exports.getLast6MonthOrdersByShop = (req, res) => {
    OrderService.getLast6MonthOrdersAmount(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar pedidos de los últimos 6 meses del local')
        } else {
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
            return res.status(200).json(result[1][0].abierto)
        }
    })
}

exports.insertDeviceId = (req, res) => {
    ShopService.createDeviceId(req.body, (error, result) => {
        /*if (error.code == 'ER_DUP_ENTRY') return res.status(401).json('ID dispositivo ya existe')
        else */if (error) {
            console.log(error)
            return res.status(500).json('Error al registrar ID dispositivo')
        }
        else return res.status(200).json('ID dispositivo guardado')
    })
}

exports.sendShopNotification = async (cuit, title, body) => {
    ShopService.getDeviceId(cuit, async (error, result) => {
        if (error) console.log(error)
        else if(result.length > 0){
            result.map(async (obj) => {
                const message = {
                    to: obj.deviceKey,
                    sound: 'default',
                    title: title,
                    body: body,
                };

                await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                });
            })
        }
    })
}