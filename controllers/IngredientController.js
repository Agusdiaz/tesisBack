const IngredientService = require('../service/ingredientService')

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