var conMysql = require('../mysqlConnection');

exports.createPromo = (promo, callback) => {
    const sql = 'INSERT INTO promocion (nombre, detalle, precio, local) VALUES ?';
    var values = [
        [promo.nombre, promo.detalle, promo.precio, promo.cuit]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.createProductPromo = (product, idPromo, callback) => {
    const sql = 'INSERT INTO promocionproducto (promocion, producto, cantidad) VALUES ?';
    var values = [
        [idPromo, product.id, product.cantidad]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.createPromoForOrder = (promo, orderNum, callback) => {
    const sql = 'INSERT INTO pedidopromocion (pedido, promocion, cantidad) VALUES ?';
    var values = [
        [orderNum, promo.idPromo, promo.cantidad]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err)
        else {
            callback(null, result)
        }
    });
}

exports.getShopPromos = (shop, callback) => {
    const sql = 'SELECT id, nombre, detalle, precio, valida FROM promocion WHERE local = ? ORDER BY valida DESC';
    var values = [shop.cuit]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopWithPromos = (callback) => {
    const sql = 'SELECT id, local FROM promocion WHERE valida = 1';
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getProductsPromo = (promoID, callback) => {
    const sql = 'SELECT producto.id, nombre, cantidad, disponible, codigo, precio, detalle, condicion, tipo, tope, selectivo FROM promocionproducto ' +
        'INNER JOIN producto ON producto = producto.id WHERE promocion = ?';
    var values = [promoID]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getProductsPromos = (promos, callback) => {
    const sql = 'SELECT producto.id FROM promocionproducto INNER JOIN producto ON producto = producto.id WHERE promocion IN ?';
    conMysql.query(sql, [[promos]], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateValidPromo = (valida, id, callback) => {
    const sql = 'UPDATE promocion SET valida = ? WHERE id = ?';
    var values = [valida, id]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.createPromoHours = (promo, callback) => {
    const sql = 'INSERT INTO validezpromocion (promocion, diaSemana, horaAbre, horaCierra, horaExtendida) VALUES ?'; 
    var values = [
        [promo.idPromo, promo.diaSemana, promo.horaAbre, promo.horaCierra, (promo.horaExtendida != null) ? promo.horaExtendida : 0]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deletePromoHours = (idPromo, diaSemana, callback) => {
    const sql = 'DELETE FROM validezpromocion WHERE promocion = ? AND diaSemana = ?';
    var values = [idPromo, diaSemana]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getAllPromos = (callback) => {
    const sql = 'SELECT * FROM promocion'; 
    conMysql.query(sql, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getPromoHours = (idPromo, callback) => {
    const sql = 'SELECT id, diaSemana, horaAbre, horaCierra, horaExtendida FROM validezpromocion WHERE promocion = ? ORDER BY diaSemana, horaAbre ASC'; 
    conMysql.query(sql, [idPromo], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validatePromos = (promos, callback) => {
    const sql = 'SELECT id FROM promocion WHERE id IN ? AND valida = 0';
    conMysql.query(sql, [[promos]], (err, result) => {
        if (err)
            callback(err)
        else
            callback(null, result)
    })
}

exports.getOrderPromos = (orderNum, stage, callback) => {
    const sql = 'SELECT promocion.id, nombre, precio, pedidopromocion.cantidad FROM pedido INNER JOIN pedidopromocion ON pedido.numero = ' +
    'pedidopromocion.pedido INNER JOIN promocion ON promocion.id = pedidopromocion.promocion WHERE pedido.numero = ? AND etapa = ?';
    var values = [orderNum, stage]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.checkHours = (idPromo, callback) => {
    var actualDay = new Date().getDay() + 1
    var prevDay = (actualDay == 1) ? 7 : actualDay-1
    const sql = 'SELECT * FROM validezpromocion WHERE promocion = ? AND ( (diaSemana = ? AND horaAbre <= current_time() AND horaCierra >= ' +
    'current_time()) OR (diaSemana = ? AND horaExtendida = 1 AND horaCierra >= current_time()) OR (diaSemana = ? AND horaExtendida = 1 ' +
    'AND horaCierra <= current_time()))'
    conMysql.query(sql, [idPromo, actualDay, prevDay, actualDay], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}