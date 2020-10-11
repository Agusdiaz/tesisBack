const ClientService = require('../service/clientService');
const ShopController = require('./ShopController')
const ShopService = require('../service/shopService')
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

exports.insertClient = (req, res) => {
    ClientService.createClient(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al registrar usuario')
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
                nombre: req.body.nombre,
                apellido: req.body.apellido
            }
            return res.status(200).json(sendJson)
        }
    })
}

exports.changePassword = (req, res) => {
    ClientService.validateUser(req.body, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json('Error al buscar usuario')
        }
        else if (result.length == 0) {
            return res.status(404).json('Usuario no encontrado')
        }
        else {
            let password = bcrypt.compareSync(req.body.contraseña.toString(), result[0].contraseña)
            if (!password) {
                if (result[0].apellido) {
                    ClientService.updateClientPassword(req.body, (error, result) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).json('Error al cambiar contraseña. Inténtelo nuevamente')
                        } else
                            return res.status(200).json('La contraseña se cambió exitosamente')
                    })
                } else {
                    ShopService.updateShopPassword(req.body, (error, result) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).json('Error al cambiar contraseña. Inténtelo nuevamente')
                        } else
                            return res.status(200).json('La contraseña se cambió exitosamente')
                    })
                }
            } else return res.status(401).json('Error: La contraseña no puede ser igual a la anterior')
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
                if (result[0].cuit !== undefined) {
                    ShopController.asyncSchedule(result[0].cuit, res, (r) => {
                        var horarios = []
                        horarios.push(r)
                        let sendJson = {
                            token: token,
                            mail: result[0].mail,
                            nombre: result[0].nombre,
                            nuevo: result[0].nuevo,
                            cuit: result[0].cuit,
                            direccion: result[0].direccion,
                            telefono: result[0].telefono,
                            mascotas: result[0].mascotas,
                            bebes: result[0].bebes,
                            juegos: result[0].juegos,
                            aireLibre: result[0].aireLibre,
                            libreHumo: result[0].libreHumo,
                            wifi: result[0].wifi,
                            demora: result[0].demora,
                            abierto: result[0].abierto,
                            horarios: horarios,
                        }
                        return res.json(sendJson)
                    })
                }
                else {
                    let sendJson = {
                        token: token,
                        mail: result[0].mail,
                        nombre: result[0].nombre,
                        apellido: result[0].apellido,
                    }
                    return res.json(sendJson)
                }
            }
            else
                return res.status(401).json('Contraseña incorrecta')
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

exports.insertDeviceId = (req, res) => {
    ClientService.createDeviceId(req.body, (error, result) => {
        if (error.code == 'ER_DUP_ENTRY') return res.status(401).json('ID dispositivo ya existe')
        else if (error) {
            console.log(error)
            return res.status(500).json('Error al registrar ID dispositivo')
        } else return res.status(200).json('ID dispositivo guardado')
    })
}

exports.sendClientNotification = async (mail, title, body) => {
    ClientService.getDeviceId(mail, async (error, result) => {
        if (error) console.log(error)
        else {
            result.map(async (obj) => {
                const message = {
                    to: obj.deviceKey,
                    sound: 'default',
                    title: title,
                    body: body,
                };

                await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                });
            })
        }
    })
}