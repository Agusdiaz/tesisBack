var conMysql = require('../mysqlConnection');

exports.getFavourites = (client, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, libreHumo, ' +
    'wifi, demora FROM favorito INNER JOIN local ON favorito.local = local.cuit WHERE favorito.cliente = ?';
    var values = [client.mail]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getAllShopsOpenClose = (callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
    'libreHumo, wifi, demora FROM local';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getAllShopsAZ = (callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
    'libreHumo, wifi, demora FROM local ORDER BY nombre ASC';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopByName = (shop, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
    'libreHumo, wifi, demora FROM local WHERE nombre LIKE ?';
    var values = ['%'+shop.nombre+'%']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopByAddress = (shop, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
    'libreHumo, wifi, demora FROM local WHERE direccion LIKE ?'
    var values = ['%'+shop.direccion+'%']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateShop = (shop, callback) => {
    const sql = 'UPDATE local SET mascotas= ?, bebes= ?, juegos= ?, aireLibre= ?, libreHumo= ?, wifi= ? WHERE cuit= ?';
    var values = [shop.mascotas, shop.bebes, shop.juegos, shop.aireLibre, shop.libreHumo, shop.wifi, shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

