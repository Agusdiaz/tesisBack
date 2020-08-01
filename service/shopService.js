var conMysql = require('../mysqlConnection');
var bcrypt = require('bcrypt');
const ClientService = require('./clientService')

exports.createShop = (shop, callback) => {
    ClientService.validateMail(shop, (error, result) => {
        if (error)
            callback(error);
        else {
            if (result[0].length > 0 || result[1].length > 0) {
                callback(null, result)
            }
            else {
                let hashedPassword = bcrypt.hashSync(shop.contraseña.toString(), process.env.BCRYPT_ROUNDS || 10)
                const sql = 'INSERT INTO local (cuit, nombre, direccion, telefono, razonSocial, mail, contraseña) VALUES ?';
                var values = [[shop.cuit, shop.nombre, shop.direccion, shop.telefono, shop.razonSocial, shop.mail, hashedPassword]]
                conMysql.query(sql, [values], (err, result) => {
                    if (err)
                        callback(err);
                    else
                        callback(null, result);
                });
            }
        }
    })
}

exports.getFavourites = (client, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, libreHumo, ' +
        'wifi, demora, abierto FROM favorito INNER JOIN local ON favorito.local = local.cuit WHERE favorito.cliente = ? AND habilitado = 1 AND nuevo = 0';
    var values = [client.mail]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.checkIfShopIsFavourite = (client, shop, callback) => {
    const sql = 'SELECT * FROM favorito WHERE cliente = ? AND local = ?';
    var values = [client, shop]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.createShopAsFavourite = (body, callback) => {
    const sql = 'INSERT INTO favorito (cliente, local) SELECT ? , ? FROM favorito WHERE NOT EXISTS (SELECT * FROM favorito WHERE cliente = ? AND local = ?) LIMIT 1';
    var values = [body.mail, body.cuit, body.mail, body.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deleteShopAsFavourite = (body, callback) => {
    const sql = 'DELETE FROM favorito WHERE cliente = ? AND local = ?';
    var values = [body.mail, body.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getAllShopsOpenClose = (callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
        'libreHumo, wifi, demora, abierto FROM local WHERE nuevo = 0 AND habilitado = 1 ORDER BY abierto DESC';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getOnlyOpenShops = (callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
        'libreHumo, wifi, demora, abierto FROM local WHERE nuevo = 0 AND habilitado = 1 and abierto = 1';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopsByCUIT = (cuits, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
        'libreHumo, wifi, demora, abierto FROM local WHERE cuit IN ? AND nuevo = 0 AND habilitado = 1';
    var values = [cuits]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getAllShopsAZ = (callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
        'libreHumo, wifi, demora, abierto FROM local WHERE nuevo = 0 AND habilitado = 1 ORDER BY nombre ASC';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopByName = (shop, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
        'libreHumo, wifi, demora, abierto FROM local WHERE nombre LIKE ? AND nuevo = 0 AND habilitado = 1 ORDER BY abierto DESC';
    var values = ['%' + shop.nombre + '%']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopByAddress = (shop, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
        'libreHumo, wifi, demora, abierto FROM local WHERE direccion LIKE ? AND nuevo = 0 AND habilitado = 1 ORDER BY abierto DESC'
    var values = ['%' + shop.direccion + '%']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopWithPromos = (shop, callback) => {
    const sql = 'SELECT id AS idPromo, cuit, local.nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
        'libreHumo, wifi, demora, abierto FROM promocion INNER JOIN local ON local = cuit WHERE nuevo = 0 AND habilitado = 1 ORDER BY abierto DESC';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateShopFeatures = (shop, callback) => {
    const sql = 'UPDATE local SET mascotas= ?, bebes= ?, juegos= ?, aireLibre= ?, libreHumo= ?, wifi= ? WHERE cuit= ?';
    var values = [shop.mascotas, shop.bebes, shop.juegos, shop.aireLibre, shop.libreHumo, shop.wifi, shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateDelayShop = (shop, callback) => {
    const sql = 'UPDATE local SET demora = ? WHERE cuit = ?';
    var values = [shop.demora, shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateOpenCloseShop = (abierto, cuit, callback) => {
    const sql = 'UPDATE local SET abierto = ? WHERE cuit = ?';
    var values = [abierto, cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateNewShop = (shop, callback) => {
    const sql = 'UPDATE local SET nuevo = 0 WHERE cuit = ?';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(this);
    });
}

exports.createShopShedule = (shop, callback) => {
    const sql = 'INSERT INTO horariolocal (local, diaSemana, horaAbre, horaCierra, horaExtendida) VALUES ?';
    var values = [
        [shop.cuit, shop.diaSemana, shop.horaAbre, shop.horaCierra, (shop.horaExtendida != null) ? shop.horaExtendida : 0]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deleteShopSchedule = (cuit, diaSemana, callback) => {
    const sql = 'DELETE FROM horariolocal WHERE local = ? AND diaSemana = ?';
    var values = [cuit, diaSemana]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopShedule = (cuit, callback) => {
    const sql = 'SELECT diaSemana, horaAbre, horaCierra, horaExtendida FROM horariolocal WHERE local = ? ORDER BY diaSemana, horaAbre ASC';
    conMysql.query(sql, [cuit], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateOpenShop = (CUIT, callback) => {
    const sql = 'SELECT * FROM local WHERE cuit = ? AND abierto = 1';
    var values = [CUIT]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.checkSchedules = (CUIT, callback) => {
    var actualDay = new Date().getDay() + 1
    var prevDay = (actualDay == 1) ? 7 : actualDay - 1
    const sql = 'SELECT * FROM horariolocal WHERE local = ? AND ( (diaSemana = ? AND horaAbre <= current_time() AND horaCierra >= ' +
        'current_time()) OR (diaSemana = ? AND horaExtendida = 1 AND horaCierra >= current_time()) OR (diaSemana = ? AND horaExtendida = 1 ' +
        'AND horaCierra <= current_time()))'
    conMysql.query(sql, [CUIT, actualDay, prevDay, actualDay], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}