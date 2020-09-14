const PromoService = require('../service/promoService');
const IngredientService = require('../service/ingredientService');
const EventController = require('./EventController');
const ShopService = require('../service/shopService');

exports.insertPromoWithProducts = (req, res) => {
    if (req.body.productos == null)
        return res.status(401).json('La promoción debe tener productos')
    else {
        PromoService.createPromo(req.body, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Error al guardar promoción')
            }
            else {
                var idPromocion = result.insertId
                var i = 0
                req.body.productos.map(obj => {
                    PromoService.createProductPromo(obj, idPromocion, (error, result) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).json('Error al guardar producto en promocion')
                        }
                        else {
                            i++
                            if (i == req.body.productos.length)
                                return res.json('Promoción con productos guardada')
                        }
                    })
                })
            }
        })
    }
}

exports.insertPromoHours = (req, res) => {
    var i = 0
    req.body.map(obj => {
        PromoService.createPromoHours(obj, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Error al crear horarios de la promoción')
            }
            else if (result.affectedRows == 0) {
                return res.status(404).json('Promoción no encontrada')
            }
            else {
                i++
                if (i == req.body.length)
                    return res.json('Horarios de la promoción creados')
            }
        })
    })
}

exports.deletePromoHours = (req, res) => {
    var i = 0
    req.body.map(obj => {
        PromoService.deletePromoHours(obj.idPromo, obj.diaSemana, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Error al eliminar horarios de la promoción')
            }
            else if (result.affectedRows == 0) {
                return res.status(404).json('Promoción no encontrada')
            }
            else {
                i++
                if (i == req.body.length)
                    return res.json('Horarios de la promoción eliminados')
            }
        })
    })
}

exports.setPromoHours = (req, res) => {
    PromoService.deletePromoHours(req.body.idPromo, req.body.diaSemana, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al eliminar horarios de la promoción')
        }
    })
    var i = 0
    var long = req.body.horas.length
    if (long > 0) {
        req.body.horas.map(obj => {
            PromoService.createPromoHours(req.body.idPromo, req.body.diaSemana, obj, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json('Error al actualizar horarios de la promoción')
                }
                else {
                    i++
                    if (i === long){
                        EventController.checkAllPromosHours()
                        return res.json('Horarios de la promoción actualizados')
                    }
                }
            })
        })
    } else{
        EventController.checkAllPromosHours()
        return res.json('Horarios de la promoción actualizados')
    } 
}

exports.getShopPromos = (req, res) => {
    PromoService.getShopPromos(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar promociones del local')
        }
        else if (result.length == 0) {
            return res.status(204).json('Local sin promociones')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0
            result.map(obj => {
                obj.horarios = []
                obj.productos = []
                asyncValidateProductsPromo(obj.id, res, (r) => {
                    obj.productos.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long) {
                        long = finalResult.length
                        i = 0
                        var finalRta = []
                        finalResult.map(obj => {
                            i++
                            if (obj.productos[0] != null)
                                finalRta.push(obj)
                            if (i == long) {
                                if (finalRta.length == 0) {
                                    return res.status(204).json('Local sin promociones')
                                }
                                else {
                                    finalResult = []
                                    long = finalRta.length;
                                    i = 0;
                                    finalRta.map(obj => {
                                        asyncPromoHours(obj.id, res, (r) => {
                                            obj.horarios.push(r)
                                            finalResult.push(obj)
                                            i++
                                            if (i == long) {
                                                return res.json(finalResult)
                                            }
                                        })
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
            var resProd = []
            resProd = prod.map(it => {
                if (it.disponible == 0) {
                    dispo = false
                }
                it.ingredientes = []
                asyncIngredientsPromo(it.id, res, (r) => {
                    if (it.selectivo === 1 && r.length === 0)
                        dispo = false
                    else it.ingredientes.push(r)
                    i++
                    if (i == prod.length && dispo)
                        callback(resProd)

                    else if (i == prod.length && !dispo)
                        callback(null)

                })
                return it
            })
        } else
            callback()
    })
}

function asyncIngredientsPromo(num, res, callback) {
    IngredientService.getIngredientsByProduct(num, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar ingredientes en producto')
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
            callback([])
    })
}

function asyncPromoHours(idPromo, res, callback) {
    var days = [{ id: 1, dia: 'Domingo', horas: '' }, { id: 2, dia: 'Lunes', horas: '' }, { id: 3, dia: 'Martes', horas: '' },
    { id: 4, dia: 'Miércoles', horas: '' }, { id: 5, dia: 'Jueves', horas: '' }, { id: 6, dia: 'Viernes', horas: '' },
    { id: 7, dia: 'Sábado', horas: '' }]
    PromoService.getPromoHours(idPromo, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar horarios de la promoción')
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

exports.setPromoPrice = (req, res) => {
    ShopService.validateOpenShop(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar cierre del local')
        } else {
            if(result[0].abierto === 0){
                PromoService.updatePromoPrice(req.body, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al actualizar precio. Inténtelo nuevamente')
                    }
                    else if (result.affectedRows == 0)
                        return res.status(404).json('Promoción no encontrada')
                    else
                        return res.json('Precio actualizado')
                })
            } else return res.status(401).json('Para realizar esta acción el local debe estar cerrado')
        }
    })
}

exports.deletePromo = (req, res) => {
    ShopService.validateOpenShop(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar cierre del local')
        } else {
            if(result[0].abierto === 0){
                PromoService.deletePromo(req.body, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al eliminar promoción. Inténtelo nuevamente')
                    }
                    else if (result.affectedRows == 0)
                        return res.status(404).json('Promoción no encontrada')
                    else
                        return res.json('Promoción eliminada')
                })
            } else return res.status(401).json('Para realizar esta acción el local debe estar cerrado')
        }
    })
}