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
            if(result[0].abierto === 0){
                IngredientService.deleteIngredient(req.body, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al eliminar ingrediente. Inténtelo nuevamente')
                    }
                    else{
                        var prod = JSON.parse(JSON.stringify(result[0]))
                        var iProd = 0
                        prod.map(obj => {
                            iProd++
                            if(obj.cantIngr === 1 && obj.selectivo === 1){
                                ProductService.deleteProduct(req.body, (error, result) => {
                                    if (error) {
                                        console.log(error)
                                        return res.status(500).json('Error al eliminar ingrediente. Inténtelo nuevamente')
                                    }
                                })
                            }
                            if(iProd === prod.length) return res.json('Ingrediente eliminado')
                        })
                    }
                })
            } else return res.status(401).json('Para realizar esta acción el local debe estar cerrado')
        }
    })
}