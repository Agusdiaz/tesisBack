const IngredientService = require('../service/ingredientService');
const ProductService = require('../service/productService');
const ShopService = require('../service/shopService');

exports.setIngredientStatus = (req, res) => {
    IngredientService.updateIngredientStatus(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al actualizar ingrediente')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Ingrediente no encontrado')
        }
        else
            return res.json('Ingrediente actualizado')
    })
}

exports.getAllIngredientsByShop = (req, res) => {
    IngredientService.getIngredientsByShop(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar ingredientes del local')
        }
        else if (result.length == 0) {
            return res.status(204).json('Local sin ingredientes')
        }
        else
            return res.json(result)
    })
}

exports.validateIngredientName = (req, res) => {
    IngredientService.validateNameOfIngredient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar nombre del ingrediente')
        }
        else if (result.length == 0) {
            return res.json('Nombre de ingrediente valido')
        }
        else
            return res.status(401).json('Ya existe un ingrediente con ese nombre')
    })
}

exports.deleteIngredient = (req, res) => {
    ShopService.validateOpenShop(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar cierre del local')
        } else {
            //if (result[0].abierto === 0 || req.body.inicial) {
                IngredientService.deleteIngredient(req.body, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al eliminar ingrediente. Inténtelo nuevamente')
                    }
                    else if (result[1].length > 0) {
                        var prodIds = JSON.parse(JSON.stringify(result[1]))
                        var prodIngr = JSON.parse(JSON.stringify(result[0]))
                        prodIds.map(obj => {
                            obj.ingredientes = prodIngr.filter(el => (el.producto === obj.id && el.ingrediente !== req.body.id))
                        })
                        var iProd = 0
                        prodIds.map(obj => {
                            iProd++
                            if (obj.ingredientes.length === 0 || obj.ingredientes.find(el => el.opcion === 1) === undefined) {
                                ProductService.deleteProduct(obj.id, (error, result) => {
                                    if (error) {
                                        console.log(error)
                                        return res.status(500).json('Error al eliminar ingrediente. Inténtelo nuevamente')
                                    }
                                })
                            }
                            if (iProd === prodIds.length) return res.json('Ingrediente eliminado')
                        })
                    } else return res.json('Ingrediente eliminado')
                })
            //} else return res.status(401).json('Para realizar esta acción el local debe estar cerrado')
        }
    })
}

exports.modifyIngredient = (req, res) => {
    ShopService.validateOpenShop(req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar cierre del local')
        } else {
            if (result[0].abierto === 1 || req.body.inicial) {
                IngredientService.validateNameOfExistentIngredient(req.body.ingrediente, req.body.cuit, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al validar nombre del ingrediente')
                    }
                    else if (result.length > 0) {
                        return res.status(401).json('Ya existe un ingrediente con ese nombre')
                    }
                    else {
                        IngredientService.updateIngredient(req.body.ingrediente, (error, result) => {
                            if (error) {
                                console.log(error)
                                return res.status(500).json('Error al modificar ingrediente')
                            }
                            else {
                                return res.json('Ingrediente modificado')
                            }
                        })
                    }

                })
            } else return res.status(401).json({ close: 'Para realizar esta acción el local debe estar cerrado' })
        }
    })
}