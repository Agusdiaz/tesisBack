const ClientService = require('../service/clientService');
var bcrypt = require('bcrypt'); 
var jwt = require('jsonwebtoken');

exports.insertClient = (req, res) => {
    ClientService.createClient(req.body, (error, result) => {
        console.log(result)
        if (error) {
            console.log(error)
            return res.status(500).send('Error al guardar cliente')
        }
        else{
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
        let passwordIsValid = bcrypt.compareSync(toString(req.body.contraseña), result[0].contraseña)
        if (error) {
            console.log(error)
            return res.status(500).send('Error al loguear usuario')
        }
        else if (result.length == 0) {
            return res.status(404).send('Usuario no encontrado')
        }
        else if (passwordIsValid) {
            let token = jwt.sign({
                id: result[0].id
            }, process.env.SECRET || 'token-secret', {
                expiresIn: 86400 // expires in 24 hours
            });
            let sendJson = {
                token: token,
                mail: result[0].mail,
            }
            return res.json(sendJson)
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