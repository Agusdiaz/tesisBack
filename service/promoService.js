var conMysql = require('../mysqlConnection');

exports.getShopPromos = (shop, callback) => {
    const sql = 'SELECT id, nombre, detalle, precio FROM promocion WHERE local = ?';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopWithPromos = (callback) => {
    const sql = 'SELECT id, local FROM promocion';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getProductsPromo = (promoID, callback) => {
    const sql = 'SELECT producto.id, nombre, cantidad, disponible, codigo, precio, detalle, condicion, tipo FROM promocionproducto ' + 
    'INNER JOIN producto ON producto = producto.id WHERE promocion = ?;';
    var values = [promoID]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}
