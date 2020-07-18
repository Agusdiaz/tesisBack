const ProductService = require('../service/productService')
const IngredientService = require('../service/ingredientService')

exports.getAllDisabledByShop = (req, res) => {
    var finalResult = []
    ProductService.getShopDisabledProducts(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar productos deshabilitados')
        }
        else {
            if (result.length > 0)
                finalResult.push(result)
            IngredientService.getShopDisabledIngredients(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).send('Error al buscar ingredientes deshabilitados')
                }
                else if (result.length == 0) {
                    return res.status(204).send('No hay productos/ingredientes deshabilitados')
                    //return res.json(finalResult)
                }
                else {
                    finalResult.push(result)
                    return res.json(finalResult)
                }
            })
        }
    })
}

exports.setProductStatus = (req, res) => {
    ProductService.updateProductStatus(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al actualizar Producto')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Producto no encontrado')
        }
        else
            return res.send('Producto actualizado')
    })
}

exports.getShopMenu = (req, res) => {
    ProductService.getProductsMenu(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar productos del menú')
        }
        else if (result.length == 0) {
            return res.status(204).send('Local sin productos en menú')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.ingredientes = []
                asyncIngredientsMenu(obj.id, res, (r) => {
                    obj.ingredientes.push(r)
                    finalResult.push(obj)
                    i++
                    if (i == long)
                        return res.json(finalResult)
                })
            })
        }
    })
}

function asyncIngredientsMenu(id, res, callback){
    IngredientService.getIngredientsByProduct(id, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al buscar ingredientes del menú')
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