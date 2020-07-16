var conMysql = require('../mysqlConnection');

exports.getShopDisabledIngredients = (shop, callback) => {
    const sql = 'SELECT id, nombre, precio, detalle FROM ingrediente WHERE local = ? AND disponible = 0;';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateIngredientStatus = (ingredient, callback) => {
    const sql = 'UPDATE ingrediente SET disponible = ? WHERE id = ?';
    var values = [ingredient.disponible, ingredient.id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getIngredientsOrder = (orderNum, callback) => {
    const sql = 'SELECT nombre, pedidoingrediente.cantidad, agregado FROM pedidoproducto INNER JOIN pedidoingrediente ON pedidoproducto.id = ' +
        'pedidoingrediente.pedidoProducto INNER JOIN ingrediente ON pedidoingrediente.ingrediente = ingrediente.id WHERE ' +
        'pedidoingrediente.pedidoProducto = ?';
    var values = [orderNum]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getIngredientsByProductMenu = (prodId, callback) => {
    const sql = 'SELECT ingrediente.id, nombre, codigo, precio, detalle, disponible, cantidad FROM ingrediente INNER JOIN ' +
        'productoingrediente ON ingrediente.id = productoingrediente.ingrediente WHERE productoingrediente.producto = ? AND disponible = 1';
    var values = [prodId]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateIngredient = (ingredient, callback) => {
    const sql = 'SELECT * FROM ingrediente WHERE id = ? AND disponible = 1';
    conMysql.query(sql, [ingredient.idIngrediente], (err, result) => {
        if (err)
            callback(err)
        else
            callback(null, result)
    })
}

exports.createIngredientForOrder = (ingredient, idPedidoProducto, idProducto, callback) => {
    const sql = 'INSERT INTO pedidoingrediente (pedidoProducto, producto, ingrediente, cantidad, agregado) VALUES ?';
    var values = [
        [idPedidoProducto, idProducto, ingredient.idIngrediente, ingredient.cantidad, ingredient.agregado]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}