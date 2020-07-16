var conMysql = require('../mysqlConnection');

exports.getProductsOrder = (orderNum, callback) => {
    const sql = 'SELECT nombre, precio, cantidad, pedidoproducto.id FROM pedidoproducto INNER JOIN producto ON pedidoproducto.producto = producto.id ' +
        'WHERE pedidoproducto.pedido = ?';
    var values = [orderNum]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getProductsMenu = (local, callback) => {
    const sql = 'SELECT * FROM producto WHERE local = ? AND disponible = 1 ORDER BY tipo DESC;';
    var values = [local.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopDisabledProducts = (shop, callback) => {
    const sql = 'SELECT id, nombre, precio, detalle, condicion FROM producto WHERE local = ? AND disponible = 0;';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateProductStatus = (product, callback) => {
    const sql = 'UPDATE producto SET disponible = ? WHERE id = ?';
    var values = [product.disponible, product.id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateProduct = (product, callback) => {
    const sql = 'SELECT * FROM producto WHERE id = ? AND disponible = 1';
    conMysql.query(sql, [product.idProducto], (err, result) => {
        if (err)
            callback(err)
        else
            callback(null, result)
    })
}

exports.validateProductsAndIngredients = (products, ingredients, callback) => {
    const sql = 'SELECT id FROM producto WHERE id IN ? AND disponible = 0; SELECT id FROM ingrediente WHERE id IN ? AND disponible = 0;'
    conMysql.query(sql, [[products],[ingredients]] , (err, result) => {
        if (err)
            callback(err)
        else
            callback(null, result)
    })
}

exports.createProductForOrder = (product, orderNum, callback) => {
    const sql = 'INSERT INTO pedidoproducto (pedido, producto, cantidad) VALUES ?';
    var values = [
        [orderNum, product.idProducto, product.cantidad]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err)
        else {
            callback(null, result)
        }
    });
}