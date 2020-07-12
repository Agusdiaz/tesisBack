var conMysql = require('../mysqlConnection');

exports.getProductOrders = (orderNum, callback) => {
    const sql = 'SELECT nombre, precio, cantidad FROM pedidoproducto INNER JOIN producto ON pedidoproducto.producto = producto.id ' + 
    'WHERE pedidoproducto.pedido = ?';
    var values = [orderNum]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopDisabledProducts = (shop, callback) => {
    const sql = 'SELECT nombre, precio, detalle, condicion FROM producto WHERE local = ? AND disponible = 0;';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateDisabledProduct = (product, callback) => {
    const sql = 'UPDATE producto SET disponible = 1 WHERE id = ?';
    var values = [product.id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}