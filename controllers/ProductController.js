const ProductService = require('../service/productService')
const IngredientService = require('../service/ingredientService')

exports.insertProductWithIngredients = (req, res) => {
    ProductService.validateNameAndCodeOfProduct(req.body.producto[0].nombre, req.body.producto[0].codigo, req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al validar nombre y código del producto')
        }
        else if (result.length > 0)
            return res.status(401).send('Nombre o código del producto repetidos')
        else {
            var names = []
            var codes = []
            if (req.body.producto[0].ingredientes != null) {
                req.body.producto[0].ingredientes.map(obj => {
                    names.push(obj.nombre)
                    codes.push(obj.codigo)
                })
                IngredientService.validateNameAndCodeOfIngredient(names, codes, req.body.cuit, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).send('Error al validar nombre y codigo de los ingredientes')
                    }
                    else if (result.length > 0)
                        return res.status(401).send('Nombre o código de ingredientes repetidos')
                    else {
                        ProductService.createProduct(req.body.producto[0], req.body.cuit, (error, result) => {
                            if (error) {
                                console.log(error)
                                return res.status(500).send('Error al guardar producto')
                            }
                            else {
                                var idProducto = result.insertId
                                var i = 0
                                req.body.producto[0].ingredientes.map(obj => {
                                    if (obj.id != null) {
                                        IngredientService.asociateIngredientAndProduct(obj, idProducto, obj.id, (error, result) => {
                                            if (error) {
                                                console.log(error)
                                                return res.status(500).send('Error al guardar ingrediente')
                                            }
                                            else {
                                                i++
                                                if (i == req.body.producto[0].ingredientes.length)
                                                    return res.send('Producto con ingredientes guardado')
                                            }
                                        })
                                    }
                                    else {
                                        IngredientService.createIngredient(obj, idProducto, req.body.cuit, (error, result) => {
                                            if (error) {
                                                console.log(error)
                                                return res.status(500).send('Error al guardar ingrediente')
                                            }
                                            else {
                                                i++
                                                if (i == req.body.producto[0].ingredientes.length)
                                                    return res.send('Producto con ingredientes guardado')
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                ProductService.createProduct(req.body.producto[0], req.body.cuit, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).send('Error al guardar producto')
                    }
                    return res.send('Producto guardado')
                })
            }
        }
    })
}

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

function asyncIngredientsMenu(id, res, callback) {
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