const ClientService = require('../service/clientService');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

exports.insertClient = (req, res) => {
    ClientService.createClient(req.body, (error, result) => {
        //console.log(result.length)
        if (error) {
            console.log(error)
            return res.status(500).json('Error al guardar cliente')
        }
        else if (result.length > 1)
            return res.status(401).json('Mail existente')
        else {
            let token = jwt.sign({
                id: result.insertId
            }, process.env.SECRET || 'token-secret', {
                expiresIn: 86400 // expires in 24 hours
            });
            let sendJson = {
                token: token,
                mail: req.body.mail,
            }
            return res.status(200).json(sendJson)
        }
    })
}

exports.loginUser = (req, res) => {
    ClientService.validateUser(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al loguear usuario')
        }
        else if (result.length == 0) {
            return res.status(404).json('Usuario no encontrado o no habilitado')
        }
        else {
            let passwordIsValid = bcrypt.compareSync(req.body.contraseña.toString(), result[0].contraseña)
            if (passwordIsValid) {
                let token = jwt.sign({
                    id: result[0].id
                }, process.env.SECRET || 'token-secret', {
                    expiresIn: 86400 // expires in 24 hours
                });
                let sendJson = { //AGREGAR PARA LOCAL
                    token: token,
                    mail: result[0].mail,
                    nombre: result[0].nombre,
                    apellido: result[0].apellido,
                    nuevo: result[0].nuevo,
                }
                return res.json(sendJson)
            }
            else
                return res.status(401).json('Contraseña inválida')
        }
    })
}

exports.setClient = (req, res) => {
    ClientService.updateClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al actualizar cliente')
        }
        else if (result.affectedRows == 0) {
            return res.status(404).json('Cliente no encontrado')
        }
        else
            return res.json('Cliente actualizado')
    })
}