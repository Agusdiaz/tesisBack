var conMysql = require('../mysqlConnection');

exports.createShop = (shop, callback) => {
    const sql = 'INSERT INTO local (cuit, nombre, direccion, telefono, razonSocial, mail, contraseña) VALUES ?';
    var values = [[shop.cuit, shop.nombre, shop.direccion, shop.telefono, shop.razonSocial, shop.mail, shop.contraseña]]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getFavourites = (client, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, libreHumo, ' +
    'wifi, demora FROM favorito INNER JOIN local ON favorito.local = local.cuit WHERE favorito.cliente = ? AND habilitado = 1 AND nuevo = 0';
    var values = [client.mail]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.createShopAsFavourite = (body, callback) => {
    const sql = 'INSERT INTO favorito (cliente, local) VALUES ?';
    var values = [[body.mail, body.cuit]]
    conMysql.query(sql, [values], (err, result) => {
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
    'libreHumo, wifi, demora FROM local WHERE nuevo = 0 AND habilitado = 1';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopsByCUIT = (cuits, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
    'libreHumo, wifi, demora FROM local WHERE cuit IN ? AND nuevo = 0 AND habilitado = 1';
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
    'libreHumo, wifi, demora FROM local WHERE nuevo = 0 AND habilitado = 1 ORDER BY nombre ASC';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopByName = (shop, callback) => {
    const sql = 'SELECT cuit, nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
    'libreHumo, wifi, demora FROM local WHERE nombre LIKE ? AND nuevo = 0 AND habilitado = 1';
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
    'libreHumo, wifi, demora FROM local WHERE direccion LIKE ? AND nuevo = 0 AND habilitado = 1'
    var values = ['%'+shop.direccion+'%']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopWithPromos = (shop, callback) => {
    const sql = 'SELECT id AS idPromo, cuit, local.nombre, direccion, telefono, razonSocial, mail, mascotas, bebes, juegos, aireLibre, ' +
    'libreHumo, wifi, demora FROM promocion INNER JOIN local ON local = cuit WHERE nuevo = 0 AND habilitado = 1 GROUP BY local';
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

