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

exports.enableProduct = (req, res) => {
    ProductService.updateDisabledProduct(req.body, (error, result) => {
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