var conMysql = require('../mysqlConnection');

exports.createIngredient = (body, idProd, CUIT, callback) => {
    const sql = 'INSERT INTO ingrediente (nombre, codigo, precio, detalle, local) VALUES ?'
    var values = [
        [body.nombre, body.codigo, body.precio, body.detalle, CUIT]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(this.asociateIngredientAndProduct(body, idProd, result.insertId, callback))
    })
}

exports.asociateIngredientAndProduct = (body, idProd, idIngr, callback) => {
    const sql = 'INSERT INTO productoingrediente (producto, ingrediente, cantidad, opcion) VALUES ?';
    values = [
        [idProd, idIngr, body.cantidad, (body.opcion != null) ? body.opcion : false]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateNameAndCodeOfIngredient = (names, codes, CUIT, callback) => {
    const sql = 'SELECT * FROM ingrediente WHERE (nombre IN ? OR codigo IN ?) AND local = ?';
    conMysql.query(sql, [[names], [codes], CUIT], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

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

exports.getIngredientsByProduct = (prodId, callback) => {
    const sql = 'SELECT ingrediente.id, nombre, codigo, precio, detalle, disponible, cantidad, opcion FROM ingrediente INNER JOIN ' +
        'productoingrediente ON ingrediente.id = productoingrediente.ingrediente WHERE productoingrediente.producto = ? AND disponible = 1';
    var values = [prodId]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getIngredientsByShop = (shop, callback) => {
    const sql = 'SELECT id, nombre, codigo, precio, detalle, disponible FROM ingrediente WHERE local = ?';
    var values = [shop.cuit]
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

/*exports.getIngredientByShop = (id, CUIT, callback) => {
    const sql = 'SELECT * FROM ingrediente WHERE local = ? AND id = ?';
    var values = [CUIT, id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}*/