const cons = require('consolidate');
var conMysql = require('../mysqlConnection');

exports.createProduct = (body, CUIT, callback) => {
    const sql = 'INSERT INTO producto (nombre, codigo, precio, detalle, condicion, tipo, tope, selectivo, local) VALUES ?';
    var values = [
        [body.nombre, body.codigo, body.precio, body.detalle, body.condicion, body.tipo, body.tope, body.selectivo, CUIT]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getProductsOrder = (orderNum, callback) => {
    const sql = 'SELECT id, nombre, precio, detalle, cantidad, modificado, condicion FROM pedidoproducto WHERE pedido = ?';
    var values = [orderNum]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getProductsMenu = (local, callback) => {
    const sql = 'SELECT * FROM producto WHERE local = ? AND disponible = 1 ORDER BY nombre ASC;';
    var values = [local.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopDisabledProducts = (shop, callback) => {
    const sql = 'SELECT id, nombre, precio, detalle, condicion, tope, selectivo FROM producto WHERE local = ? AND disponible = 0;';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateNameAndCodeOfProduct = (name, code, CUIT, callback) => {
    const sql = 'SELECT * FROM producto WHERE (nombre = ? OR codigo = ?) AND local = ?';
    conMysql.query(sql, [name, code, CUIT], (err, result) => {
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
    const sql1 = 'SELECT id FROM producto WHERE id IN ? AND disponible = 0; SELECT id FROM ingrediente WHERE id IN ? AND disponible = 0;'
    const sql2 = 'SELECT id FROM producto WHERE id IN ? AND disponible = 0;'
    if(ingredients.length > 0){
        conMysql.query(sql1, [[products], [ingredients]], (err, result) => {
            if (err)
                callback(err)
            else
                callback(null, result)
        })
    }
    else{
        conMysql.query(sql2, [[products]], (err, result) => {
            if (err)
                callback(err)
            else
                callback(null, result)
        })
    }
}

exports.createProductForOrder = (product, orderNum, callback) => {
    const sql = 'INSERT INTO pedidoproducto (pedido, nombre, precio, detalle, condicion, cantidad, modificado) VALUES ?';
    var values = [
        [orderNum, product.nombre, product.precio, product.detalle, product.condicion, product.cantidad, (product.modificado) ? product.modificado : 0]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err)
        else {
            callback(null, result)
        }
    });
}

exports.createProductPromoForOrder = (product, idPedidoPromocion, callback) => {
    const sql = 'INSERT INTO pedidopromocionproducto (pedidoPromocion, nombre, precio, detalle, condicion, cantidad, modificado) VALUES ?';
    var values = [
        [idPedidoPromocion, product.nombre, product.precio, product.detalle, product.condicion, product.cantidad, (product.modificado) ? product.modificado : 0]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deleteProduct = (id, callback) => {
    const sql = 'DELETE promocion, promocionproducto FROM promocion INNER JOIN promocionproducto ON promocion.id = promocionproducto.promocion ' + 
    'WHERE promocionproducto.producto = ?; DELETE FROM producto WHERE id = ?;'
    conMysql.query(sql, [id, id], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateProduct = (product, callback) => {
    const sql = 'UPDATE producto SET nombre = ?, precio = ?, detalle = ?, condicion = ?, tipo = ?, tope = ?, selectivo = ? WHERE id = ?';
    var values = [product.nombre, product.precio, product.detalle, product.condicion, product.tipo, product.tope, product.selectivo, product.id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateNameOfExistentProduct = (name, id, CUIT, callback) => {
    const sql = 'SELECT * FROM producto WHERE (nombre = ? AND id != ?) AND local = ?';
    conMysql.query(sql, [name, id, CUIT], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}