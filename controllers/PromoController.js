const PromoService = require('../service/promoService');
const IngredientService = require('../service/ingredientService');

exports.insertPromoWithProducts = (req, res) => {
    console.log(req.body.productos)
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
                                return res.json('Promoción id=' + idPromocion + ' con productos guardada')
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
    var i = 0
    req.body.map(obj => {
        PromoService.deletePromoHours(obj.idPromo, obj.diaSemana, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Error al eliminar horarios de la promoción')
            }
        })
    })
    req.body.map(obj => {
        PromoService.createPromoHours(obj, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json('Error al actualizar horarios de la promoción')
            }
            else {
                i++
                if (i == req.body.length)
                    return res.json('Horarios de la promoción actualizados')
            }
        })
    })
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
                                    result.map(obj => {
                                        asyncPromoHours(obj.id, res, (r) => {
                                            obj.horarios.push(r)
                                            finalResult.push(obj)
                                            i++
                                            if (i == long){
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
                    it.ingredientes.push(r)
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
            callback()
    })
}

function asyncPromoHours(idPromo, res, callback) {
    PromoService.getPromoHours(idPromo, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar horarios de la promoción')
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