const ClientService = require('../service/clientService');

exports.insertClient = (req, res) => {
    ClientService.createClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al guardar cliente')
        }
        else
            return res.send('Cliente guardado')
    })
}

exports.loginUser = (req, res) => {
    ClientService.validateUser(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al loguear usuario')
        }
        else if (result.length == 0) {
            return res.status(404).send('Usuario no encontrado')
        }
        else if (result[0].contraseña == req.body.contraseña) {
            return res.json(result)
        }
        else
            return res.status(401).send('Contraseña inválida')
    })
}

exports.setClient = (req, res) => {
    ClientService.updateClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send('Error al actualizar cliente')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).send('Cliente no encontrado')
        }
        else
            return res.send('Cliente actualizado')
    })
}