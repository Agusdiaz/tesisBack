const ProductService = require('../service/productService')
const IngredientService = require('../service/ingredientService')

exports.insertProductWithIngredients = (req, res) => {
    ProductService.validateNameAndCodeOfProduct(req.body.producto.nombre, req.body.producto.codigo, req.body.cuit, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al validar nombre y código del producto')
        }
        else if (result.length > 0)
            return res.status(401).json('Nombre o código del producto repetidos')
        else {
            if (req.body.producto.ingredientes != null) {
                ProductService.createProduct(req.body.producto, req.body.cuit, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al guardar producto')
                    }
                    else {
                        var idProducto = result.insertId
                        var i = 0
                        req.body.producto.ingredientes.map(obj => {
                            if (obj.id != null) {
                                IngredientService.asociateIngredientAndProduct(obj, idProducto, obj.id, (error, result) => {
                                    if (error) {
                                        console.log(error)
                                        return res.status(500).json('Error al guardar ingrediente')
                                    }
                                    else {
                                        i++
                                        if (i == req.body.producto.ingredientes.length)
                                            return res.json('Producto con ingredientes guardado')
                                    }
                                })
                            }
                            else {
                                IngredientService.createIngredient(obj, idProducto, req.body.cuit, (error, result) => {
                                    if (error) {
                                        console.log(error)
                                        return res.status(500).json('Error al guardar ingrediente')
                                    }
                                    else {
                                        i++
                                        if (i == req.body.producto.ingredientes.length)
                                            return res.json('Producto con ingredientes guardado')
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                ProductService.createProduct(req.body.producto, req.body.cuit, (error, result) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json('Error al guardar producto')
                    }
                    return res.json('Producto guardado')
                })
            }
        }
    })
}

exports.getAllDisabledByShop = (req, res) => {
    var finalResult = {}
    finalResult.productos = []
    finalResult.ingredientes = []
    ProductService.getShopDisabledProducts(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos deshabilitados')
        }
        else {
            if (result.length > 0) {
                result.map(obj => {
                    obj.ingredientes = []
                    asyncIngredientsMenu(obj.id, res, (r) => {
                        obj.ingredientes.push(r)
                        finalResult.productos.push(obj)
                    })
                })
            }
            IngredientService.getShopDisabledIngredients(req.body, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json('Error al buscar ingredientes deshabilitados')
                }
                else {
                    if (result.length > 0) {
                        result.map(obj => {
                            finalResult.ingredientes.push(obj)
                        })
                    }
                    if (finalResult.productos.length === 0 && finalResult.ingredientes.length === 0)
                        return res.status(204).json('Local sin productos y/o ingredientes deshabilitados')
                    else return res.json(finalResult)
                }
            })
        }
    })
}

exports.setProductStatus = (req, res) => {
    ProductService.updateProductStatus(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al actualizar Producto')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Producto no encontrado')
        }
        else
            return res.json('Producto actualizado')
    })
}

exports.getShopMenu = (req, res) => {
    ProductService.getProductsMenu(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar productos del menú')
        }
        else if (result.length == 0) {
            return res.status(204).json('Local sin productos en menú')
        }
        else {
            var finalResult = []
            var long = result.length;
            var i = 0;
            result.map(obj => {
                obj.ingredientes = []
                asyncIngredientsMenu(obj.id, res, (r) => {
                    if (obj.selectivo === 1 && r.length === 0) {

                    } else {
                        obj.ingredientes.push(r)
                        finalResult.push(obj)
                    }
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
            return res.status(500).json('Error al buscar ingredientes del menú')
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