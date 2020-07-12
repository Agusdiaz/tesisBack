const IngredientService = require('../service/ingredientService')

exports.setIngredientStatus = (req, res) => {
    IngredientService.updateIngredientStatus(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al actualizar ingrediente')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Ingrediente no encontrado')
        }
        else
            return res.send('Ingrediente actualizado')
    })
}